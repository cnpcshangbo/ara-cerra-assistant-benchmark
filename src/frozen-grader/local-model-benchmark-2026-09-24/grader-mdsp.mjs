/** Frozen, dependency-free grader for the Maryland transportation benchmark.
 * Run self-tests: node grader-mdsp.mjs --self-test
 * No inference, requests, site writes, or production source imports occur here.
 */
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';

const CONTROLS = ['year', 'county', 'severity', 'location', 'estimate', 'placement'];
const own = (x, key) => x != null && Object.prototype.hasOwnProperty.call(x, key);
const object = x => !!x && typeof x === 'object' && !Array.isArray(x);
const canonical = x => Array.isArray(x) ? x.map(canonical) : object(x)
  ? Object.fromEntries(Object.keys(x).sort().map(k => [k, canonical(x[k])])) : x;
const equal = (a, b) => JSON.stringify(canonical(a)) === JSON.stringify(canonical(b));
const short = x => JSON.stringify(x)?.slice(0, 240) ?? String(x);
const numbers = x => Object.fromEntries(Object.entries(x ?? {}).filter(([, v]) => typeof v === 'number'));
const controls = value => Object.fromEntries(CONTROLS.map(key => [key, value?.[key]]));

// URLs omit blank query values harmlessly. Production observation supplied by
// the benchmark owner: an absent placement means original. Explicit placement
// is recommended because source revisions have also used estimated as default.
function urlControls(value, defaultPlacement = 'original') {
  let params;
  if (typeof value === 'string') params = new URL(value, 'https://cerra.cloud').searchParams;
  else if (object(value) && typeof value.url === 'string') params = new URL(value.url, 'https://cerra.cloud').searchParams;
  else if (value instanceof URLSearchParams) params = value;
  else if (object(value)) return Object.fromEntries(CONTROLS.map(k => [k, value[k] ?? (k === 'placement' ? defaultPlacement : '')]));
  else throw new Error('Expected URL or query object');
  return Object.fromEntries(CONTROLS.map(k => [k, params.get(k) ?? (k === 'placement' ? defaultPlacement : '')]));
}
function normalizedRows(rows) {
  if (!Array.isArray(rows)) return null;
  return rows.map(r => ({label: String(r.label), crashes: r.crashes, fsiCrashes: r.fsiCrashes}))
    .sort((a, b) => a.label.localeCompare(b.label) || a.crashes - b.crashes || a.fsiCrashes - b.fsiCrashes);
}
function rawRowKeys(value, path = '') {
  if (!value || typeof value !== 'object') return [];
  const forbidden = new Set(['report', 'reportid', 'report_id', 'reportnumber', 'report_number', 'tables', 'persons', 'personrows', 'person_rows', 'vehiclerows', 'vehicle_rows']);
  const found = [];
  for (const [k, v] of Object.entries(value)) {
    const next = path ? `${path}.${k}` : k;
    if (forbidden.has(k.toLowerCase())) found.push(next);
    if (v && typeof v === 'object') found.push(...rawRowKeys(v, next));
  }
  return found;
}

// These recognize semantic concepts, not the application's exact sentences.
// An unfamiliar requirement is surfaced for human review instead of invented
// as an automatic pass/fail. Required known caveats are substantive checks.
function caveatCheck(requirement, answer) {
  const r = requirement.toLowerCase();
  const a = answer.replace(/\s+/g, ' ').replace(/[“”]/g, '"');
  if (/absent|missing/.test(r) && /clear/.test(r))
    return /(?:absen[ct]|missing|not (?:been )?flagged|no.{0,15}flag)/i.test(a) && /clear/i.test(a) && /(?:does not|doesn't|cannot|can't|not evidence|not establish|not mean)/i.test(a);
  if (/contributor flag is not|contributor.*actual/.test(r))
    return /contribut|flag/i.test(a) && /(?:does not|doesn't|cannot|can't|not).{0,65}(?:specif|establish|actual|rain|snow|clear|condition)/i.test(a);
  if (/cannot determine rainy/.test(r))
    return /(?:cannot|can't|unable|not possible).{0,65}(?:determine|count|know|establish)/i.test(a) && /ambient weather/i.test(a) && /(?:no.{0,20}field|lack|unavailable|not (?:be )?export)/i.test(a);
  if (/ambient weather|actual weather unavailable/.test(r) && /2024|unavailable|lack/.test(r))
    return /(?:ambient|actual) weather/i.test(a) && /(?:unavailable|no.{0,30}weather field|lack.{0,40}weather|not.{0,25}export|does not.{0,30}weather)/i.test(a);
  if (/certify location accuracy|screen consistency/.test(r))
    return /(?:not|cannot|can't|don't|do not).{0,60}(?:certif|proven|accurac|accurate)|not proven.{0,25}(?:error|bound)/i.test(a);
  if (/categories overlap/.test(r)) return /(?:categor|flag|check|group).{0,30}overlap|overlapping.{0,30}(?:categor|flag|check|group)/i.test(a);
  if (/unique reports once/.test(r)) return /(?:each report|each crash).{0,25}once|count.{0,30}(?:once|unique reports)|deduplicat/i.test(a);
  if (/not independently verified corrections/.test(r)) return /(?:not|never).{0,35}(?:independently verified|verified correction)|unverified/i.test(a);
  if (/validated or recalculated hin/.test(r)) return /(?:not|no).{0,65}(?:recalculat|validat).{0,35}HIN|HIN.{0,40}(?:not|hasn't).{0,30}(?:recalculat|validat)/i.test(a);
  if (/weather.*not a map filter/.test(r)) return /weather/i.test(a) && /(?:not|no|does not|doesn't|cannot).{0,40}(?:map filter|filter weather)|(?:map filter).{0,30}(?:not|support)/i.test(a);
  if (/no filters changed/.test(r)) return /no filters (?:were |have been )?changed|filters.{0,25}(?:unchanged|not changed)|(?:did not|haven't|have not).{0,15}change.{0,15}filter/i.test(a);
  if (/specify baltimore city or baltimore county/.test(r)) return /Baltimore City/i.test(a) && /Baltimore County/i.test(a) && /specify|clarif|which|choose|ambiguous/i.test(a);
  if (/cannot infer causes or exposure-adjusted risk/.test(r)) return /(?:cannot|can't|unable|not supported).{0,90}(?:caus|risk)/i.test(a) && /caus/i.test(a) && /risk|exposure/i.test(a);
  return null;
}
function forbiddenClaimCheck(requirement, answer) {
  if (/zero rainy crashes/i.test(requirement)) {
    const sentences = answer.split(/(?<=[.!?])\s+|\n/);
    return !sentences.some(s => /\b(?:zero|0|no)\s+(?:(?:reported|recorded)\s+)?(?:rainy crashes|crashes.{0,20}(?:rain|raining))/i.test(s)
      && !/not (?:evidence|mean|establish|prove)|cannot|can't|unable|unknown|cannot determine|data.coverage gap|does not mean/i.test(s));
  }
  return null;
}

export function gradeMaryland(caseSpec, trial) {
  const failures = [], checks = {};
  let needsNarrativeReview = false;
  const expected = caseSpec?.expected ?? {};
  const response = trial?.response;
  const check = (name, ok, detail = '') => {
    checks[name] = !!ok;
    if (!ok) failures.push(`${name}${detail ? ': ' + detail : ''}`);
    return !!ok;
  };
  const matches = (name, actual, wanted) => check(name, equal(actual, wanted), `expected ${short(wanted)}, received ${short(actual)}`);
  check('httpStatus', trial?.status === (expected.httpStatus ?? 200), `expected ${expected.httpStatus ?? 200}, received ${trial?.status}`);
  if (!check('responseObject', object(response))) return {pass: false, failures, checks};
  check('noServiceError', !response.error, response.error ? String(response.error) : '');
  check('nonemptyAnswer', typeof response.answer === 'string' && !!response.answer.trim());

  if (expected.actionExact) matches('exactAction', response.action, expected.actionExact);
  if (expected.noAction || expected.action === null || expected.controlsUnchanged)
    check('noAction', response.action == null, 'Read-only/refusal request must not return a map mutation');
  if (own(expected, 'evidence')) matches('explicitEvidence', response.evidence, expected.evidence);
  if (expected.plan) {
    check('planPresent', object(response.plan));
    if (expected.plan.operationAllowed) {
      check('planOperation', expected.plan.operationAllowed.includes(response.plan?.operation), `allowed ${expected.plan.operationAllowed.join(', ')}, received ${response.plan?.operation}`);
      if (response.evidence) check('evidenceOperation', expected.plan.operationAllowed.includes(response.evidence.operation));
    }
    if (expected.plan.scope) {
      matches('planScope', response.plan?.scope, expected.plan.scope);
      if (response.evidence) matches('evidenceScope', response.evidence.scope, expected.plan.scope);
    }
  }
  const evidence = response.evidence;
  const oracle = caseSpec.oracle?.evidence;
  if (oracle) {
    check('evidencePresent', object(evidence));
    // Full filters from the independent expected query catch silently added or
    // dropped constraints; empty filters are material, unlike source metadata.
    for (const [key, value] of Object.entries({...oracle.filters, ...expected.evidenceFilters}))
      matches(`filter.${key}`, evidence?.filters?.[key], value);
    for (const [key, value] of Object.entries(numbers(oracle.totals))) matches(`totals.${key}`, evidence?.totals?.[key], value);
    if (oracle.stateTotals) for (const [key, value] of Object.entries(numbers(oracle.stateTotals))) matches(`stateTotals.${key}`, evidence?.stateTotals?.[key], value);
    const operation = evidence?.operation;
    if (operation === 'location' || oracle.operation === 'location' || oracle.filters?.location)
      for (const [key, value] of Object.entries(numbers(oracle.locationTotals))) matches(`locationTotals.${key}`, evidence?.locationTotals?.[key], value);
    if (operation === 'estimates' || oracle.operation === 'estimates' || oracle.filters?.estimate)
      for (const [key, value] of Object.entries(numbers(oracle.estimateTotals))) matches(`estimateTotals.${key}`, evidence?.estimateTotals?.[key], value);
    if (oracle.operation === 'estimates')
      for (const [key, value] of Object.entries(numbers(oracle.comparison))) matches(`comparison.${key}`, evidence?.comparison?.[key], value);
    if (expected.rowsMustMatchOracle || ['weather', 'breakdown', 'location', 'estimates'].includes(oracle.operation)) {
      const got = normalizedRows(evidence?.rows), want = normalizedRows(oracle.rows);
      matches('evidenceRows', got, want);
      // A frozen backend oracle may itself repeat labels (an observed shared
      // estimate-breakdown defect). Preserve the full row multiset; never
      // collapse duplicates or blame this shared defect on a selected model.
      if (want && new Set(want.map(r => r.label)).size === want.length)
        check('uniqueRowLabels', !!got && new Set(got.map(r => r.label)).size === got.length);
    }
  } else {
    for (const [key, value] of Object.entries(expected.evidenceFilters ?? {})) matches(`filter.${key}`, evidence?.filters?.[key], value);
  }
  if (expected.group) {
    matches('evidenceGroup', evidence?.group, expected.group);
    // The backend's omitted group defaults to year; all other groupings must
    // be explicit in the planner output.
    matches('planGroup', response.plan?.group ?? 'year', expected.group);
  }
  if (expected.ifBreakdownGroup && response.plan?.operation === 'breakdown') {
    matches('breakdownPlanGroup', response.plan.group, expected.ifBreakdownGroup);
    matches('breakdownEvidenceGroup', evidence?.group, expected.ifBreakdownGroup);
  }
  if (expected.boundsExact) matches('evidenceBounds', evidence?.bounds, expected.boundsExact);
  if (expected.placement) {
    matches('evidencePlacement', evidence?.placement, expected.placement);
    matches('planPlacement', response.plan?.placement, expected.placement);
  }
  if (expected.selectedId != null) matches('selectedId', evidence?.selected?.id, expected.selectedId);
  for (const [key, value] of Object.entries(expected.selectedWeather ?? {})) matches(`selectedWeather.${key}`, evidence?.selected?.weather?.[key], value);
  if (expected.noOriginalReportOrPersonRows) check('curatedEvidenceOnly', rawRowKeys(evidence).length === 0, rawRowKeys(evidence).join(', '));

  const ui = trial?.ui;
  if (expected.browserStateMustMatchAction) check('uiEvidencePresent', object(ui));
  if (ui) {
    const complete = state => object(state) && CONTROLS.every(k => own(state, k) && typeof state[k] === 'string');
    check('uiBeforeComplete', complete(ui.before));
    check('uiAfterComplete', complete(ui.after));
    const target = expected.actionExact ? {...controls(ui.before), ...expected.actionExact.filters} : controls(ui.before);
    for (const key of CONTROLS) matches(`ui.${key}`, ui.after?.[key], target[key]);
    if (ui.expected) matches('uiHarnessExpected', controls(ui.expected), target);
    if (ui.requestPayload?.context) for (const key of CONTROLS) matches(`uiRequestContext.${key}`, ui.requestPayload.context[key], ui.before?.[key]);
    if (ui.urlAfter != null) {
      try { matches('uiUrlFilters', urlControls(ui.urlAfter, ui.defaultPlacement ?? 'original'), target); }
      catch (error) { check('uiUrlFilters', false, error.message); }
    }
    if (ui.dataRequestAfter != null) {
      try { matches('uiDataQueryFilters', urlControls(ui.dataRequestAfter, ui.defaultPlacement ?? 'original'), target); }
      catch (error) { check('uiDataQueryFilters', false, error.message); }
    }
  }

  const answer = typeof response.answer === 'string' ? response.answer : '';
  for (const [index, requirement] of (expected.answerMustConvey ?? []).entries()) {
    const result = caveatCheck(requirement, answer);
    if (result === null) { needsNarrativeReview = true; checks[`narrativeReview.required.${index}`] = null; }
    else check(`caveat.${index}`, result, requirement);
  }
  for (const [index, requirement] of (expected.answerMustNotClaim ?? []).entries()) {
    const result = forbiddenClaimCheck(requirement, answer);
    if (result === null) { needsNarrativeReview = true; checks[`narrativeReview.forbidden.${index}`] = null; }
    else check(`forbiddenClaimAbsent.${index}`, result, requirement);
  }
  return {pass: failures.length === 0, failures, checks, ...(needsNarrativeReview ? {needsNarrativeReview: true} : {})};
}

export function selfTestMarylandGrader() {
  const before = {year:'2024',county:'Baltimore City',severity:'property',location:'review',estimate:'ambiguous',placement:'original'};
  const oracle = {operation:'summary',scope:'filtered',filters:{year:'2022',county:'Montgomery',severity:'fsi',weather:'',location:'',estimate:''},totals:{crashes:266,fatalPersonRecords:49},stateTotals:{originalEligible:266},rows:[]};
  const countCase = {expected:{httpStatus:200,noAction:true,plan:{operationAllowed:['summary'],scope:'filtered'},evidenceFilters:oracle.filters},oracle:{evidence:oracle}};
  const valid = {status:200,response:{answer:'266 matching reports.',plan:{operation:'summary',scope:'filtered'},evidence:structuredClone(oracle)}};
  const actionCase = {expected:{httpStatus:200,actionExact:{type:'set_filters',filters:{year:''}},evidence:null,preserveUnspecifiedControls:true,browserStateMustMatchAction:true}};
  const after = {...before,year:''};
  const actionTrial = {status:200,response:{answer:'Year: All years',action:{type:'set_filters',filters:{year:''}},evidence:null},ui:{before,after,expected:after,urlAfter:'https://cerra.cloud/dashboard/maryland?'+new URLSearchParams(after),dataRequestAfter:'/api/mdsp-data?op=crashes&'+new URLSearchParams(after)}};
  const results = [];
  const test = (name, input, spec, expectedPass) => {const result=gradeMaryland(spec,input);assert.equal(result.pass,expectedPass,name+': '+result.failures.join('; '));results.push({name,passed:true});};
  test('valid numeric fixture', valid, countCase, true);
  const wrongScope=structuredClone(valid);wrongScope.response.plan.scope='viewport';wrongScope.response.evidence.scope='viewport';test('wrong scope rejected',wrongScope,countCase,false);
  const altered=structuredClone(valid);altered.response.evidence.totals.crashes=267;test('altered count rejected',altered,countCase,false);
  const extra=structuredClone(actionTrial);extra.response.action.filters.county='Baltimore City';test('extra action field rejected',extra,actionCase,false);
  test('partial patch preserves all other controls',actionTrial,actionCase,true);
  const mutated=structuredClone(actionTrial);mutated.ui.after.location='';test('unrequested UI mutation rejected',mutated,actionCase,false);
  const failed={status:503,response:{error:'Service unavailable'}};test('service failure rejected',failed,countCase,false);
  const badUrl=structuredClone(actionTrial);badUrl.ui.urlAfter+='&placement=compare'; // Duplicate query alone reads first value; replace explicitly.
  badUrl.ui.urlAfter=badUrl.ui.urlAfter.replace('placement=original','placement=compare');test('URL mismatch rejected',badUrl,actionCase,false);
  const badQuery=structuredClone(actionTrial);badQuery.ui.dataRequestAfter=badQuery.ui.dataRequestAfter.replace('location=review','location=');test('map data query mismatch rejected',badQuery,actionCase,false);
  const missingUi=structuredClone(actionTrial);delete missingUi.ui;test('missing required browser evidence rejected',missingUi,actionCase,false);
  const refusalSpec={expected:{httpStatus:200,action:null,evidence:null,controlsUnchanged:true,answerMustConvey:['Specify Baltimore City or Baltimore County']}};
  const refusal={status:200,response:{answer:'Please specify Baltimore City or Baltimore County. No filters were changed.',action:null,evidence:null},ui:{before,after:before}};
  test('meaningful clarification accepted',refusal,refusalSpec,true);
  const emptyRefusal=structuredClone(refusal);emptyRefusal.response.answer='I cannot help.';test('generic ungrounded refusal rejected',emptyRefusal,refusalSpec,false);
  return results;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1] && process.argv.includes('--self-test')) {
  const results = selfTestMarylandGrader();
  console.log(JSON.stringify({passed:results.length,total:results.length,results},null,2));
}
