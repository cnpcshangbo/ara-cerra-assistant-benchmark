#!/usr/bin/env node
/** Collector safety checks against an in-process loopback stub; no model call. */
import assert from 'node:assert/strict';
import http from 'node:http';
import {mkdtemp,readFile,rm,stat,symlink} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
const execute=promisify(execFile);
const script=fileURLToPath(new URL('./collect-api.mjs',import.meta.url));
const root=fileURLToPath(new URL('../',import.meta.url));
const work=await mkdtemp(path.join(tmpdir(),'cerra-collector-test-'));
let calls=0,last;
const server=http.createServer(async(req,res)=>{
 let text='';for await(const chunk of req)text+=chunk;
 calls++;last={origin:req.headers.origin,cookie:req.headers.cookie,payload:JSON.parse(text)};
 res.writeHead(200,{'Content-Type':'application/json'});
 res.end(JSON.stringify({modelId:'qwen3-14b',answer:'synthetic private answer',feedback:{receipt:'synthetic receipt'}}));
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const base='http://127.0.0.1:'+server.address().port;
const env={...process.env,CERRA_BASE_URL:base,CERRA_SESSION_COOKIE:'synthetic_test_session=example'};
const run=(args,override={})=>execute(process.execPath,[script,'--case','MD01','--model','qwen3-14b',...args],{env:{...env,...override}});
try{
 await run([]);assert.equal(calls,0,'Default dry run must not send requests');
 await assert.rejects(run(['--execute','--out',path.join(root,'forbidden-private-trial.json')]),/outside this publication directory/);
 await symlink(root,path.join(work,'public-link'),'dir');
 await assert.rejects(run(['--execute','--out',path.join(work,'public-link','forbidden-private-trial.json')]),/outside this publication directory/);
 await assert.rejects(run(['--execute','--out',path.join(work,'none.json')],{CERRA_SESSION_COOKIE:''}),/CERRA_SESSION_COOKIE/);
 await assert.rejects(run([],{CERRA_BASE_URL:'https://example.org'}),/Remote execution requires/);
 const output=path.join(work,'trial.json');
 const result=await run(['--execute','--out',output]);
 assert.equal(calls,1);assert.equal(last.origin,base);assert.equal(last.cookie,env.CERRA_SESSION_COOKIE);assert.equal(last.payload.model,'qwen3-14b');
 assert(!result.stdout.includes('synthetic private answer'));assert(!result.stdout.includes('synthetic_test_session'));
 const trial=JSON.parse(await readFile(output,'utf8'));
 assert.equal(trial.response.answer,'synthetic private answer');assert.equal(trial.response.feedback,undefined);
 assert.equal((await stat(output)).mode&0o777,0o600);
 await assert.rejects(run(['--execute','--out',output]),/EEXIST/);assert.equal(calls,1,'Existing output must block before another paid request');
 const tasks=JSON.parse(await readFile(new URL('../benchmark/tasks.json',import.meta.url),'utf8'));
 const browser=tasks.cases.find(c=>c.mode==='browser');
 await assert.rejects(execute(process.execPath,[script,'--case',browser.id,'--model','qwen3-14b'],{env}),/Browser cases require/);
 console.log('Collector checks passed: dry-run, loopback, private path including symlink, credentials, mode0600, redaction, no overwrite, and browser refusal. No model API was called.');
}finally{await new Promise(resolve=>server.close(resolve));await rm(work,{recursive:true,force:true});}
