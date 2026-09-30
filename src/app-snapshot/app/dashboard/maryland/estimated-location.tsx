export type Placement = 'original'|'estimated'|'compare'|'diagnostic';
export type StateLocation = {originalStatus:string;originalDistanceOutsideM:number|null;originalEligible:boolean;effectiveStatus:string;effectiveEligible:boolean;locationUnresolved:boolean;toleranceM:number};
export type StateTotals = {originalEligible:number;effectiveEligible:number;originalRejected:number;boundaryReview:number;locationUnresolved:number};
export type StatePolicy = {reports:number;toleranceM:number;originalEligible:number;effectiveEligible:number;locationUnresolved:number;notes:string[];source:{name:string;url:string;vintage:string}};
export type LocationEstimate = {
  status: 'estimated'|'unresolved'|'ambiguous'|'not_needed'|'near_source';
  reason: string; method: string; confidence: string;
  coordinates: number[]|null; displacementM: number|null;
  candidates: {coordinates:number[];routeDistanceM:number|null;eligible?:boolean;exclusions?:string[]}[];
  candidateCount: number; evidence: string[]; uncertaintyM: number|null;
};
export type LocationComparison = {original:number;estimated:number;both:number;movedIn:number;movedOut:number;relocated:number;unresolved:number;originalFsi:number;estimatedFsi:number};
export type EstimateMethod = {version:number;statusCounts:Record<string,number>;sources:{name:string;url:string;vintage:string}[];notes:string[];validation?:{controls:number;resolved:number;within100m:number;medianM:number|null;maxM:number|null;independentCrashTruth:boolean}};

const distance=(value:number)=>value>=1000?`${(value/1000).toFixed(2)} km`:`${Math.round(value)} m`;
export default function EstimatedLocationDetails({estimate,onLocate}:{estimate:LocationEstimate;onLocate?:(coordinates:number[])=>void}) {
  const inferred=estimate.status==='estimated';
  return <section className="mdsp-estimate-detail" aria-label="Estimated location evidence">
    <h3>{inferred?'Estimated location':estimate.status==='ambiguous'?'Multiple candidate locations':'Location estimate'}</h3>
    <p><strong>{inferred?'Unique supported junction · inferred':estimate.status==='not_needed'?'No inferred replacement':'Unresolved · original GPS archived'}</strong></p>
    <p>{estimate.reason}</p>
    {estimate.coordinates&&<dl><dt>Estimated longitude, latitude</dt><dd>{estimate.coordinates.map(v=>v.toFixed(6)).join(', ')}</dd><dt>Distance from original GPS</dt><dd>{distance(estimate.displacementM??0)}</dd><dt>Location precision</dt><dd>Approximate road junction; lane and exact impact point are unknown.</dd></dl>}
    {estimate.evidence.length>0&&<ul>{estimate.evidence.map(text=><li key={text}>{text}</li>)}</ul>}
    {estimate.coordinates&&onLocate&&<button onClick={()=>onLocate(estimate.coordinates!)}>Show estimated point</button>}
    {estimate.candidateCount>1&&<p>{estimate.candidateCount} named-road junctions. None is selected automatically.{estimate.candidates.length<estimate.candidateCount?' Only the first candidates are displayed.':''}</p>}
    {estimate.status==='ambiguous'&&<ol className="mdsp-candidate-list">{estimate.candidates.map((c,i)=><li key={i}>Candidate {i+1}: {c.coordinates.map(v=>v.toFixed(6)).join(', ')}{c.exclusions?.length?` · ${c.exclusions.join(' ')}`:' · Passes reference screens; not uniquely established.'}</li>)}</ol>}
    <small>Confidence describes agreement between fields and references, not a measured probability of accuracy. Estimates are exploratory and have not been verified against original police reports.</small>
  </section>;
}
