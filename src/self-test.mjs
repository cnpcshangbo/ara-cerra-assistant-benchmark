#!/usr/bin/env node
/** Offline synthetic regression checks, no keys, browsers or network. */
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {applyProtocolOverlay, campaigns} from './grade-response.mjs';

for (const campaign of campaigns)
  for (const filename of ['grader-mdsp.mjs','grader-hin.mjs','sensitivity.mjs']) {
    const output = execFileSync(process.execPath, [fileURLToPath(new URL(`./frozen-grader/${campaign}/${filename}`,import.meta.url)), '--self-test'], {encoding:'utf8'});
    console.log(campaign + '/' + filename + ': ' + output.trim());
  }

const g = {pass:true, checks:{fixture:true}, failures:[]};
const c = {mode:'api', answer_path:'planner_then_generated_narrative'};
const t = {status:200, modelId:'model-a', response:{modelId:'model-a'}};
assert.equal(applyProtocolOverlay(c,t,g,null).strictPass, false, 'Pending semantic review must not pass');
assert.equal(applyProtocolOverlay(c,t,g,{pass:false}).strictPass, false, 'Failed semantic review must override structural success');
assert.equal(applyProtocolOverlay(c,t,g,{pass:true}).strictPass, true);
assert.equal(applyProtocolOverlay(c,{...t,response:{modelId:'model-b'}},g,{pass:true}).strictPass, false, 'Wrong model must fail');
assert.equal(applyProtocolOverlay({mode:'browser'},t,g,null).strictPass, false, 'A claimed browser trial requires real UI evidence');
const ui = {before:{year:'2024'}, after:{year:'2020'}, requestPayload:{model:'model-a'}, boundsBefore:'x',boundsAfter:'x',dataRequestAfter:'observed'};
assert.equal(applyProtocolOverlay({mode:'browser'}, {...t,ui}, g,null).unintendedMutation, true, 'Clarify-first policy disallows partial year changes');
assert.equal(applyProtocolOverlay({mode:'browser',expected:{actionExact:{filters:{year:'2020'}}}}, {...t,ui},g,null).unintendedMutation,false);
assert.deepEqual(g,{pass:true,checks:{fixture:true},failures:[]},'Overlay must not mutate core grade');
console.log('8 review/identity/browser overlay checks passed.');
