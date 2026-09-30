#!/usr/bin/env node
/** One exploratory API attempt against a caller-owned CERRA deployment.
 * Default is dry-run. This is NOT the historical 84-trial browser+API harness.
 * Credentials come only from environment; outputs are private and never printed.
 */
import {readFile, writeFile, realpath} from 'node:fs/promises';
import {performance} from 'node:perf_hooks';
import {fileURLToPath} from 'node:url';
import path from 'node:path';

process.umask(0o077);
const args=process.argv.slice(2);
const arg=flag=>{const i=args.indexOf(flag);return i<0?null:args[i+1];};
if(args.includes('--help')||!arg('--case')||!arg('--model')){
  console.log('node src/collect-api.mjs --case MD01 --model <application-model-id> [--execute --out /private/new-trial.json] [--allow-remote]\nEnvironment: CERRA_BASE_URL (default http://127.0.0.1:3000), CERRA_SESSION_COOKIE (your existing session), CERRA_SELECTED_WEATHER_ID (your local MD07 binding, if needed).\nWithout --execute this validates the request without sending it. A real attempt may invoke your configured paid model. Browser cases are rejected.');
  process.exit(0);
}
const base=new URL(process.env.CERRA_BASE_URL||'http://127.0.0.1:3000');
if(base.username||base.password||base.pathname!=='/'||base.search||base.hash)throw new Error('Use a bare origin with no credentials, path, query or fragment.');
const loopback=['127.0.0.1','localhost','[::1]'].includes(base.hostname);
if(!loopback&&!args.includes('--allow-remote'))throw new Error('Remote execution requires --allow-remote and a deployment you are authorized to test.');
if(!loopback&&base.protocol!=='https:')throw new Error('Remote origins must use HTTPS.');
if(!['http:','https:'].includes(base.protocol))throw new Error('Unsupported protocol');
const taskSet=JSON.parse(await readFile(new URL('../benchmark/tasks.json',import.meta.url),'utf8'));
const c=taskSet.cases.find(c=>c.id===arg('--case')||c.benchmarkCaseId===arg('--case'));
if(!c)throw new Error('Unknown task');
if(c.mode!=='api')throw new Error('Browser cases require genuine browser-state evidence; this API-only tool refuses them.');
let payload=c.request?{...c.request,model:arg('--model')}:{question:c.prompt,context:c.context,history:c.history??[],...(c.previousQuery?{previousQuery:c.previousQuery}:{}),model:arg('--model')};
if(JSON.stringify(payload).includes('selected-weather-unavailable-01')){
  const binding=process.env.CERRA_SELECTED_WEATHER_ID;
  if(!binding||!/^\d+$/.test(binding))throw new Error('MD07 requires your own CERRA_SELECTED_WEATHER_ID; no private source record is distributed.');
  payload=JSON.parse(JSON.stringify(payload),(_key,value)=>value==='selected-weather-unavailable-01'?Number(binding):value);
}
if(!args.includes('--execute')){
  console.log(JSON.stringify({dryRun:true,case:c.benchmarkCaseId,mode:'api',model:arg('--model'),loopback,requestWillBeSent:false},null,2));
  process.exit(0);
}
const output=arg('--out');
if(!output)throw new Error('--execute requires an explicit private --out file');
const artifactRoot=await realpath(fileURLToPath(new URL('../',import.meta.url)));
const resolved=path.join(await realpath(path.dirname(path.resolve(output))),path.basename(output));
if(resolved===artifactRoot||resolved.startsWith(artifactRoot+path.sep))throw new Error('Store raw responses outside this publication directory.');
const cookie=process.env.CERRA_SESSION_COOKIE;
if(!cookie||/[\r\n]/.test(cookie))throw new Error('Supply your existing CERRA_SESSION_COOKIE in the environment.');
const url=new URL(c.endpoint,base);
if(url.origin!==base.origin||!['/api/assistant','/api/mdsp-assistant'].includes(url.pathname))throw new Error('Unexpected endpoint');
// Reserve output before submitting; never overwrite a prior attempt.
await writeFile(resolved,JSON.stringify({startedAt:new Date().toISOString(),caseId:c.id,status:'started'})+'\n',{flag:'wx',mode:0o600});
const sanitize=value=>Array.isArray(value)?value.map(sanitize):value&&typeof value==='object'?Object.fromEntries(Object.entries(value).filter(([k])=>!['feedback','receipt','token','password','cookie','authorization'].includes(k.toLowerCase())).map(([k,v])=>[k,sanitize(v)])):value;
const startedAt=new Date().toISOString(),start=performance.now();
let status=0,response=null,transportFailure=false;
try{
  const result=await fetch(url,{method:'POST',redirect:'error',headers:{Origin:base.origin,'Content-Type':'application/json',Cookie:cookie},body:JSON.stringify(payload),signal:AbortSignal.timeout(180000)});
  status=result.status;
  response=sanitize(await result.json());
}catch{transportFailure=true;}
const seconds=(performance.now()-start)/1000;
const trial={trialId:'exploratory-'+Date.now(),caseId:c.id,modelId:arg('--model'),split:c.split,mode:'api',startedAt,finishedAt:new Date().toISOString(),status,seconds,response,transportFailure,
  provenance:{historicalBenchmark:false,reason:'New API-only attempt on caller-owned deployment; source snapshots, routing and source oracle not verified.'}};
await writeFile(resolved,JSON.stringify(trial,null,2)+'\n',{mode:0o600});
console.log(JSON.stringify({case:c.benchmarkCaseId,model:arg('--model'),status,seconds,transportFailure,privateOutputWritten:true,historicalBenchmark:false},null,2));
