#!/usr/bin/env node
/** Portable response grader, adapted from the frozen grade-run.mjs overlay.
 * Takes a caller-supplied private response; never contacts a model or server.
 * The campaign-specific core graders and sensitivity rules are byte-identical.
 */
import {readFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import path from 'node:path';

const controls = ['year','county','severity','location','estimate','placement'];
export const campaigns = [
  'transportation-model-benchmark-2026-09-18',
  'transportation-gpt-benchmark-2026-09-23',
  'local-model-benchmark-2026-09-24',
  'qwen-newer-benchmark-2026-09-29',
  'gpt61-sol-benchmark-2026-09-29',
];

export function applyProtocolOverlay(c, t, rawGrade, review) {
  const originalFrozenGrade = structuredClone(rawGrade);
  const g = structuredClone(rawGrade);
  const extra = (key, value) => {g.checks[key] = !!value; if (!value) g.failures.push(key);};
  extra('selectedModelVerified', t.status === 200 && t.response?.modelId === t.modelId);
  if (c.mode === 'browser') extra('browserEvidenceRequired', Boolean(t.ui));
  if (t.ui) {
    extra('browserPostedSelectedModel', t.ui.requestPayload?.model === t.modelId);
    const patch = c.expected?.actionExact?.filters ?? {};
    if (!Object.hasOwn(patch, 'county')) extra('preservedMapBounds', t.ui.boundsBefore === t.ui.boundsAfter);
    if (c.expected?.actionExact && Object.keys(patch).some(k => t.ui.before[k] !== patch[k]))
      extra('updatedMapDataRequest', Boolean(t.ui.dataRequestAfter));
  }
  g.pass = g.failures.length === 0;
  const narrativeRequired = c.answer_path === 'planner_then_generated_narrative' || Boolean(g.needsNarrativeReview);
  return {
    originalFrozenGrade, protocolGrade: g, narrativeRequired,
    pendingNarrativeReview: narrativeRequired && !review,
    strictPass: g.pass && (!narrativeRequired || review?.pass === true),
    unintendedMutation: t.ui ? controls.some(k => {
      const patch = c.expected?.actionExact?.filters ?? {};
      return t.ui.after[k] !== t.ui.before[k] && (!Object.hasOwn(patch, k) || t.ui.after[k] !== patch[k]);
    }) : false,
  };
}

export async function gradeResponse(c, t, review = null, campaign = campaigns.at(-1)) {
  if (!campaigns.includes(campaign)) throw new Error('Unknown frozen campaign');
  const [{gradeMaryland}, {gradeHin}, {sensitivityGrade}] = await Promise.all([
    import(`./frozen-grader/${campaign}/grader-mdsp.mjs`),
    import(`./frozen-grader/${campaign}/grader-hin.mjs`),
    import(`./frozen-grader/${campaign}/sensitivity.mjs`),
  ]);
  const result = applyProtocolOverlay(c, t, c.module === 'maryland' ? gradeMaryland(c,t) : gradeHin(c,t), review);
  result.sensitivity = sensitivityGrade(c, t, result.protocolGrade, review);
  return result;
}

async function main() {
  const args = process.argv.slice(2);
  const value = flag => {const i = args.indexOf(flag); return i < 0 ? null : args[i + 1];};
  if (args.includes('--help') || !value('--trial')) {
    console.log('node src/grade-response.mjs --case MD01 --trial /private/trial.json [--review /private/review.json] [--campaign <folder>]\nOptional --case-file /private/original-case.json uses an original private case instead of benchmark/tasks.json.\nOutputs potentially sensitive grading details to stdout; do not publish them without review.');
    return;
  }
  const taskSet = JSON.parse(await readFile(new URL('../benchmark/tasks.json', import.meta.url), 'utf8'));
  const c = value('--case-file') ? JSON.parse(await readFile(value('--case-file'),'utf8'))
    : taskSet.cases.find(c => c.id === value('--case') || c.benchmarkCaseId === value('--case'));
  if (!c) throw new Error('Case not found');
  if (JSON.stringify(c).includes('selected-weather-unavailable-01'))
    throw new Error('MD07 has a redacted source oracle. Supply the restored original private case with --case-file to claim exact grading.');
  const t = JSON.parse(await readFile(value('--trial'),'utf8'));
  const review = value('--review') ? JSON.parse(await readFile(value('--review'),'utf8')) : null;
  const result = await gradeResponse(c, t, review, value('--campaign') ?? campaigns.at(-1));
  console.log(JSON.stringify(result, null, 2));
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url)
  await main();
