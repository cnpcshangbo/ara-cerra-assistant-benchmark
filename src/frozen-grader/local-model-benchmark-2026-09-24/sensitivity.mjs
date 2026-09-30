/** Post-hoc diagnostic only. The frozen primary rubric is never changed. */
import assert from 'node:assert/strict';
export function sensitivityGrade(c,t,g,review){
 const result=(pass,reason=null)=>({pass,adjusted:pass&&!g.pass,reasons:reason?[reason]:[]});
 if(review?.pass===false)return result(false);
 if(g.needsNarrativeReview&&!review)return result(false);
 if(g.pass)return result(true);
 const failures=g.failures.map(f=>f.split(':')[0]);
 const only=allowed=>failures.length>0&&failures.every(k=>allowed.some(rule=>typeof rule==='string'?k===rule:rule.test(k)));
 const r=t.response??{};
 if(['MD05','MD06'].includes(c.id)&&only(['planOperation','evidenceOperation'])&&r.plan?.operation==='breakdown')
  return result(true,'Correct complete weather-constrained answer/evidence through breakdown rather than summary/weather.');
 if(c.id.startsWith('hin-10')&&r.plan?.metric==='weightedScorePerMile'&&only(['plan.metric','fact.ranked_by',/^answer\.ranked_claim\.\d+$/]))
  return result(true,'Same three source corridors in the correct order, ranked by the score-per-mile values underlying their source ranks.');
 if(c.id==='RV02'&&only(['exactAction'])&&r.action?.type==='set_filters'&&r.action.filters?.location===''&&Object.entries(r.action.filters).every(([k,v])=>k==='location'||(['estimate','placement'].includes(k)&&v===t.ui?.before[k])))
  return result(true,'Redundant preserved estimate/placement values; all actual controls, URL, bounds and data query match the intended result.');
 if(c.id==='MD15'&&only(['caveat.0'])&&r.action==null&&/not support|do not support|not a map filter|cannot|can.t/i.test(r.answer??''))
  return result(true,'Entire unsupported action refused with no UI mutation, but explanation is less specific about the unavailable weather filter.');
 if(c.id==='MD04'&&only(['planScope','evidenceScope'])&&r.plan?.scope==='all'&&r.evidence?.scope==='all')
  return result(true,'All-scope plus explicit county and cleared other filters gives identical complete annual evidence.');
 return result(false);
}
if(process.argv.includes('--self-test')){
 const gr=failures=>({pass:false,failures,checks:{}}),base={status:200,response:{plan:{operation:'breakdown'}}};
 assert.equal(sensitivityGrade({id:'MD06'},base,gr(['planOperation','evidenceOperation']),null).pass,true);
 assert.equal(sensitivityGrade({id:'MD05'},base,gr(['planOperation','totals.crashes: incorrect']),null).pass,false);
 assert.equal(sensitivityGrade({id:'hin-10-test'},{response:{plan:{metric:'weightedScorePerMile'}}},gr(['plan.metric','fact.ranked_by','answer.ranked_claim.1']),null).pass,true);
 assert.equal(sensitivityGrade({id:'hin-10-test'},{response:{plan:{metric:'weightedScorePerMile'}}},gr(['evidence.exact_ordered_ids']),null).pass,false);
 const action={response:{action:{type:'set_filters',filters:{location:'',estimate:'unresolved',placement:'compare'}}},ui:{before:{estimate:'unresolved',placement:'compare'}}};
 assert.equal(sensitivityGrade({id:'RV02'},action,gr(['exactAction']),null).pass,true);
 assert.equal(sensitivityGrade({id:'RV02'},action,gr(['exactAction','ui.location']),null).pass,false);
 assert.equal(sensitivityGrade({id:'MD15'},{response:{action:null,answer:'The map filters do not support those conditions. No filters were changed.'}},gr(['caveat.0']),null).pass,true);
 assert.equal(sensitivityGrade({id:'MD15'},{response:{action:null,answer:'Cannot do that'}},gr(['caveat.0','ui.year']),null).pass,false);
 assert.equal(sensitivityGrade({id:'MD04'},{response:{plan:{scope:'all'},evidence:{scope:'all'}}},gr(['planScope','evidenceScope']),null).pass,true);
 assert.equal(sensitivityGrade({id:'MD04'},{response:{plan:{scope:'all'},evidence:{scope:'all'}}},gr(['planScope','evidenceScope','evidenceRows']),null).pass,false);
 assert.equal(sensitivityGrade({id:'MD06'},base,gr(['planOperation']),{pass:false}).pass,false);
 console.log('11 sensitivity-rule fixture checks passed');
}
