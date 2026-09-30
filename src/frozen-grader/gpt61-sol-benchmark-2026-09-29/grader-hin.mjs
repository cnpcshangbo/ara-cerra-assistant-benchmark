/**
 * Frozen pre-inference HIN grader. Numeric expected values come from the separate
 * raw-JSON oracle, never from production queryData or another model's answer.
 * Generated narratives deliberately require later blinded semantic review.
 * Run `node grader-hin.mjs --self-test` for synthetic adversarial fixtures.
 */
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';

const metricLabels = Object.freeze({
  rank: 'Source rank', weightedScorePerMile: 'HIN score / mile', score: 'HIN score',
  fatal: 'Fatalities (people)', serious: 'Serious injuries (people)',
  fatalAndSerious: 'Fatal + serious injuries (people)', nonMotorist: 'Non-motorist crashes',
  totalPopulation: 'Population', medianIncome: 'Median household income (USD)',
  zeroVehicleHouseholdsPct: 'Households without a vehicle (%)', micromobilityMiles: 'Micromobility miles',
  pedestrianActivityLevel: 'Pedestrian activity index', busStops: 'Bus stops',
  trafficSignals: 'Traffic signals', schools: 'Schools', hospitals: 'Hospitals',
});
const visibleMetrics = Object.freeze({
  ranked: ['rank','weightedScorePerMile','fatal','serious','nonMotorist','fatalAndSerious'],
  intersection: ['rank','score','fatal','serious','nonMotorist'],
  fsiSegment: ['fatalAndSerious'], nonMotoristSegment: ['nonMotorist'],
  tract: ['zeroVehicleHouseholdsPct','pedestrianActivityLevel','micromobilityMiles','totalPopulation','medianIncome','busStops','trafficSignals','schools','hospitals'],
});
const layerLabels = Object.freeze({ranked:'High Injury Corridors',intersections:'High-injury intersections',fsi:'Fatal + serious injury segments',nonMotorist:'Non-motorist crash segments',tracts:'Census tract context'});
const scales = Object.freeze({half:'0.5-mile minimum',one:'1-mile minimum',two:'2-mile minimum'});
const scopes = Object.freeze({view:'Current map layers and filters (not the viewport boundary)',dataset:'Available dataset; map filters do not apply'});
const knownModels = new Set(['openai-gpt-6.1-sol','qwen3.8-27b','qwen3-8b','qwen3-14b','gemma4-12b','llama3.1-8b','gemma3-4b','openai-gpt-4.1-mini','openai-gpt-5.4-mini','openai-gpt-5.4']);
const same = (a,b) => JSON.stringify(a) === JSON.stringify(b);
const list = x => Array.isArray(x) ? x : [];
const object = x => x !== null && typeof x === 'object' && !Array.isArray(x);
const normalize = x => String(x).trim().toLowerCase();
const quote = x => JSON.stringify(x);
const regexEscape = x => String(x).replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const numberToken = n => new RegExp(`(?<![\\d.])${regexEscape(n)}(?![\\d.])`);

function expectedValues(source) {
  const values = new Map();
  for (const key of visibleMetrics[source.kind] ?? []) values.set(metricLabels[key],source[key]);
  if (source.tier !== undefined) values.set('Source tier',source.tier);
  if (source.kind === 'ranked') {
    values.set('Minimum-length set',scales[source.scale]);
    values.set('HIN score',source.serious + 2 * source.nonMotorist + 10 * source.fatal);
  }
  if (source.kind === 'tract') values.set('GEOID',source.geoid);
  return values;
}

export function gradeHin(caseSpec, trial) {
  const failures = [], checks = {};
  const narrative = caseSpec.answer_path === 'planner_then_generated_narrative';
  const result = () => ({pass:failures.length===0,failures,checks,...(narrative?{needsNarrativeReview:true}:{})});
  const check = (name,ok,detail='') => {checks[name]=Boolean(ok);if(!ok) failures.push(`${name}${detail?`: ${detail}`:''}`);};
  check('http_ok',trial?.status===200,`expected 200, received ${quote(trial?.status)}`);
  if (trial?.status!==200) return result();
  const response=trial.response;
  check('response_object',object(response));
  if(!object(response)) return result();
  check('no_service_error',!response.error,quote(response.error));
  check('known_model_id',knownModels.has(response.modelId),quote(response.modelId));
  const requestedModel=trial.modelId ?? trial.model ?? caseSpec.request?.model;
  if(typeof requestedModel==='string') check('requested_model_used',response.modelId===requestedModel,`expected ${requestedModel}, received ${response.modelId}`);
  check('nonempty_answer',typeof response.answer==='string'&&response.answer.trim().length>0);
  check('plan_object',object(response.plan));
  check('evidence_object',object(response.evidence));
  if(!object(response.plan)||!object(response.evidence)) return result();
  const plan=response.plan, evidence=response.evidence, constraints=caseSpec.expected_plan_constraints??{}, oracle=caseSpec.independent_oracle??{};
  for(const [key,expected] of Object.entries(constraints)) {
    if(key==='streets_or_street_case_insensitive') {
      const actual=plan.streets??(plan.street?[plan.street]:[]);
      check('plan.streets',same(list(actual).map(normalize),expected.map(normalize)),`expected ${quote(expected)}, received ${quote(actual)}`);
    } else if(key.endsWith('_one_of')) {
      const field=key.slice(0,-7), actual=plan[field]??null;
      check(`plan.${field}`,expected.some(x=>same(x,actual)),`expected one of ${quote(expected)}, received ${quote(actual)}`);
    } else {
      check(`plan.${key}`,same(plan[key],expected),`expected ${quote(expected)}, received ${quote(plan[key])}`);
    }
  }
  check('valid_scope',['view','dataset'].includes(plan.scope));
  check('valid_limit',Number.isInteger(plan.limit)&&plan.limit>=1&&plan.limit<=10);
  for(const name of ['facts','rows','sources','notes']) check(`evidence.${name}_array`,Array.isArray(evidence[name]));
  check('evidence.title_nonempty',typeof evidence.title==='string'&&evidence.title.trim().length>0);
  check('evidence.scope_nonempty',typeof evidence.scope==='string'&&evidence.scope.trim().length>0);
  check('evidence.sources_nonempty',list(evidence.sources).length>0&&list(evidence.sources).every(x=>typeof x==='string'&&x.length>0));
  const facts=list(evidence.facts), rows=list(evidence.rows);
  check('evidence.facts_shape',facts.every(x=>object(x)&&typeof x.label==='string'&&['string','number'].includes(typeof x.value)));
  check('evidence.rows_shape',rows.every(x=>object(x)&&typeof x.id==='string'&&typeof x.name==='string'&&Array.isArray(x.values)));
  const factMap=new Map(facts.filter(object).map(x=>[x.label,x.value]));
  check('evidence.unique_fact_labels',factMap.size===facts.length);
  check('evidence.unique_row_ids',new Set(rows.map(x=>x?.id)).size===rows.length);
  const expectedIds=oracle.ordered_row_ids??oracle.expected_row_ids;
  if(expectedIds) check('evidence.exact_ordered_ids',same(rows.map(x=>x?.id),expectedIds),`expected ${quote(expectedIds)}, received ${quote(rows.map(x=>x?.id))}`);
  if(constraints.scope&&plan.operation!=='compare') check('evidence.scope',evidence.scope===scopes[constraints.scope],`expected ${quote(scopes[constraints.scope])}, received ${quote(evidence.scope)}`);
  if(plan.operation==='compare') check('evidence.comparison_scope',evidence.scope==='Available Top 30 corridor sets; matched by source name, not a persistent corridor ID');
  if(oracle.source_files) check('evidence.source_provenance',same([...new Set(list(evidence.sources))].sort(),[...new Set(oracle.source_files)].sort()),`expected ${quote(oracle.source_files)}, received ${quote(evidence.sources)}`);
  const fact=(label,expected,key=label)=>check(`fact.${key}`,same(factMap.get(label),expected),`expected ${quote(expected)}, received ${quote(factMap.get(label))}`);
  if(oracle.expected_status) fact('Query status',oracle.expected_status);
  if(oracle.candidate_source_records!==undefined&&plan.layer) fact(`${layerLabels[plan.layer]} · source records`,oracle.candidate_source_records,'candidate_source_records');
  if(oracle.expected_record_count!==undefined&&plan.layer) fact(`${layerLabels[plan.layer]} · source records`,oracle.expected_record_count,'record_count');
  for(const [tier,n] of Object.entries(oracle.expected_tier_distribution??{})) fact(tier,n);
  for(const [layer,n] of Object.entries(oracle.expected_counts_by_layer??{})) fact(`${layerLabels[layer]} · source records`,n,layer);
  if(oracle.expected_single_row_count!==undefined) check('evidence.selected_row_count',rows.length===oracle.expected_single_row_count);
  if(oracle.metric&&plan.operation==='rank') {
    fact('Ranked by',`${metricLabels[oracle.metric]} (${oracle.metric==='rank'?'ascending':'descending'})`,'ranked_by');
    if(oracle.available_metric_records!==undefined||oracle.candidate_source_records!==undefined) fact('Records with available metric',oracle.available_metric_records??oracle.candidate_source_records,'available_metric_records');
    fact('Records returned',(expectedIds??[]).length,'records_returned');
  }
  for(const source of oracle.source_rows??[]) {
    const row=rows.find(x=>x?.id===source.id);
    check(`row.${source.id}.present`,Boolean(row));
    if(!row) continue;
    check(`row.${source.id}.name`,row.name===source.name,`expected ${quote(source.name)}, received ${quote(row.name)}`);
    const rowValues=list(row.values), values=new Map(rowValues.filter(object).map(v=>[v.label,v.value]));
    check(`row.${source.id}.unique_metric_labels`,values.size===rowValues.length);
    const expected=expectedValues(source);
    check(`row.${source.id}.exact_metric_labels`,same([...values.keys()].sort(),[...expected.keys()].sort()));
    for(const [label,value] of expected) check(`row.${source.id}.${label}`,same(values.get(label),value),`expected ${quote(value)}, received ${quote(values.get(label))}`);
  }
  if(oracle.ordered_metric_values&&oracle.metric) {
    const actual=rows.map(x=>list(x?.values).find(v=>v?.label===metricLabels[oracle.metric])?.value);
    check('evidence.ordered_metric_values',same(actual,oracle.ordered_metric_values),`expected ${quote(oracle.ordered_metric_values)}, received ${quote(actual)}`);
  }
  if(oracle.excluded_null_ids) check('evidence.excludes_null_records',rows.every(x=>!oracle.excluded_null_ids.includes(x?.id)));

  // Generated prose is reviewed against its semantic proposition rubric later;
  // structural pass is expressly not a narrative correctness judgment.
  if(narrative) return result();
  const answer=typeof response.answer==='string'?response.answer:'', chinese=/[\u3400-\u9fff]/u.test(caseSpec.request?.question??'');
  check('answer.request_language',chinese?/[\u3400-\u9fff]/u.test(answer):!/[\u3400-\u9fff]/u.test(answer));
  // These paths use fixed source-value templates: check each displayed answer
  // claim against the independent oracle rather than scoring fluent keywords.
  if(plan.operation==='rank'&&oracle.source_rows&&oracle.metric) {
    const numbered=answer.split('\n').filter(line=>/^\d+\.\s/u.test(line.trim()));
    check('answer.ranked_result_count',numbered.length===oracle.source_rows.length);
    oracle.source_rows.forEach((source,i)=>{
      const line=numbered[i]??'', label=metricLabels[oracle.metric];
      check(`answer.ranked_claim.${i+1}`,line.includes(source.name)&&line.includes(label)&&numberToken(source[oracle.metric]).test(line),`expected ${source.name}, ${label}=${source[oracle.metric]}; received ${quote(line)}`);
    });
  }
  if(['count','overview'].includes(plan.operation)) {
    for(const [label,value] of factMap) check(`answer.count_claim.${label}`,answer.includes(`${label}: ${value}`));
    check('answer.source_record_units',chinese?answer.includes('源记录'):answer.includes('source records'));
    check('answer.nonadditivity_caveat',chinese?answer.includes('不能相加'):answer.includes('cannot be added'));
  }
  if(constraints.scope&&['rank','count','overview'].includes(plan.operation)) {
    const expectedScope=chinese?(constraints.scope==='view'?'当前启用图层及筛选':'现有数据集，不受地图筛选限制'):scopes[constraints.scope];
    check('answer.scope',answer.includes(expectedScope));
  }
  if(plan.operation==='rank'&&plan.layer==='ranked') check('answer.minimum_length_caveat',chinese?answer.includes('最低长度不是')&&answer.includes('独立排名'):answer.includes('minimum is not the measured corridor length')&&answer.includes('ranked independently'));
  if(plan.operation==='selected') for(const source of oracle.source_rows??[]) {
    check(`answer.selected_name.${source.id}`,answer.includes(source.name));
    for(const [label,value] of expectedValues(source)) check(`answer.selected_value.${source.id}.${label}`,answer.includes(`${label}: ${value===null?'Unavailable':value}`));
  }
  if(plan.operation==='compare') for(const source of oracle.source_rows??[]) check(`answer.comparison.${source.id}`,answer.split('\n').some(line=>line.includes(source.name)&&line.includes(scales[source.scale])&&line.includes(`#${source.rank}`)&&line.includes(String(source.weightedScorePerMile))));
  return result();
}

export function selfTestHinGrader() {
  // Minimal fixture from a frozen raw source row; no production helper imports.
  const source={id:'rank-half-3',kind:'ranked',sourceFile:'top_30_corrdors_half_mile.geojson',name:'E NORTH AVE/ W NORTH AVE',scale:'half',rank:3,fatal:17,serious:117,fatalAndSerious:134,nonMotorist:258,weightedScorePerMile:159.67};
  const spec={id:'synthetic-rank',answer_path:'planner_then_deterministic_answer',request:{question:'List the top corridor by fatalities in the half-mile set.'},expected_plan_constraints:{operation:'rank',scope:'dataset',layer:'ranked',scale:'half',metric:'fatal',limit:1},independent_oracle:{ordered_row_ids:[source.id],source_rows:[source],source_files:[source.sourceFile],metric:'fatal',ordered_metric_values:[17],candidate_source_records:30}};
  const good={status:200,model:'qwen3-8b',response:{modelId:'qwen3-8b',plan:{operation:'rank',scope:'dataset',layer:'ranked',scale:'half',metric:'fatal',limit:1},evidence:{title:'High Injury Corridors · Fatalities (people)',scope:scopes.dataset,facts:[{label:'High Injury Corridors · source records',value:30},{label:'Ranked by',value:'Fatalities (people) (descending)'},{label:'Records with available metric',value:30},{label:'Records returned',value:1}],rows:[{id:source.id,name:source.name,values:[...expectedValues(source)].map(([label,value])=>({label,value}))}],sources:[source.sourceFile],notes:[]},answer:'High Injury Corridors — 1 returned records:\n1. E NORTH AVE/ W NORTH AVE — Fatalities (people): 17\n\nAvailable dataset; map filters do not apply\nEach minimum-length set is ranked independently by HIN score per mile; the minimum is not the measured corridor length.'}};
  const checked=[];
  const valid=gradeHin(spec,good);assert.equal(valid.pass,true,JSON.stringify(valid.failures));checked.push('valid rank');
  for(const [name,mutate,key] of [
    ['wrong IDs',t=>t.response.evidence.rows[0].id='rank-half-999','evidence.exact_ordered_ids'],
    ['wrong scope',t=>t.response.plan.scope='view','plan.scope'],
    ['fabricated metric',t=>t.response.evidence.rows[0].values.find(v=>v.label==='Fatalities (people)').value=99,'row.rank-half-3.Fatalities (people)'],
    ['fabricated answer value',t=>t.response.answer=t.response.answer.replace('Fatalities (people): 17','Fatalities (people): 99'),'answer.ranked_claim.1'],
    ['wrong model',t=>t.response.modelId='gemma3-4b','requested_model_used'],
  ]) {const t=structuredClone(good);mutate(t);const result=gradeHin(spec,t);assert.equal(result.pass,false,name);assert.equal(result.checks[key],false,name);checked.push(name);}
  const service=gradeHin(spec,{status:503,response:{error:'Model unavailable'}});assert.equal(service.pass,false);assert.equal(service.checks.http_ok,false);checked.push('service failure');
  const alternative=structuredClone(spec);alternative.expected_plan_constraints.metric_one_of=['fatal',null];delete alternative.expected_plan_constraints.metric;const t=structuredClone(good);delete t.response.plan.metric;assert.equal(gradeHin(alternative,t).pass,true);checked.push('permitted plan alternative');
  const narrativeSpec={answer_path:'planner_then_generated_narrative',expected_plan_constraints:{operation_one_of:['methodology','unsupported']},independent_oracle:{expected_row_ids:[]},request:{question:'Explain the source conflict.'}};
  const narrativeTrial={status:200,response:{modelId:'qwen3-8b',plan:{operation:'methodology',scope:'dataset',limit:5},evidence:{title:'HIN methods and data limits',scope:scopes.dataset,facts:[],rows:[],sources:['UMD report'],notes:[]},answer:'This synthetic answer is intentionally not semantically graded.'}};
  const pending=gradeHin(narrativeSpec,narrativeTrial);assert.equal(pending.pass,true);assert.equal(pending.needsNarrativeReview,true);checked.push('narrative remains unjudged');
  return {passed:checked.length,checks:checked};
}

if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href&&process.argv.includes('--self-test')) console.log(JSON.stringify(selfTestHinGrader(),null,2));
