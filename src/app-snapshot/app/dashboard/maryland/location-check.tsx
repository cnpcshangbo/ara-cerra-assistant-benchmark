export type LocationCheck = {status:string;flags:string[];county:{reported:string;atCoordinate:string|null;status:string;distanceToReportedCountyM:number;distanceToReportedBoundaryM:number};road:{reported:string;status:string;nameStatus:string;nameDistanceM:number|null;route:string|null;routeStatus:string;routeDistanceM:number|null;nearestOmocM:number;nearestNamedRoad:string;nearestNamedRoadM:number;offroad:boolean};crossStreet:{reported:string;distanceM:number|null;offset:string;units:string;direction:string;note:string};coordinateReuse:{reports:number;counties:number;roadNames:number;flagged:boolean}};
export type LocationMethod = {crashes:number;statusCounts:Record<string,number>;flagCounts:Record<string,number>;thresholds:{roadM:number;boundaryM:number;reuseReports:number;reuseRoadNames:number};sources:{name:string;url:string;vintage:string}[];notes:string[]};
export const locationLabel=(s:string)=>({review:'Needs review',consistent:'Checks consistent',inconclusive:'Inconclusive'}[s]||s);
const flags:Record<string,string>={county_conflict:'GPS conflicts with the reported county',far_from_reference_roads:'GPS is far from reference roads',road_name_conflict:'Reported road name is not near the GPS point',route_conflict:'Reported route is not near the GPS point',reused_coordinate:'Many different roads share this exact coordinate'};
const distance=(n:number|null)=>n===null?'Not found in reference':n>=1000?`${(n/1000).toFixed(2)} km`:`${Math.round(n)} m`;
export default function LocationCheckDetails({check,coordinates}:{check:LocationCheck;coordinates?:number[]}){
 const c=check.county,r=check.road;
 return <section className="mdsp-location-check" aria-label="GPS cross-check">
  <p className="mdsp-eyebrow">GPS CROSS-CHECK</p><h3 className={'mdsp-location-badge '+check.status}>{locationLabel(check.status)}</h3>
  <p>Screening evidence, not a corrected crash location.</p>
  {check.flags.length>0&&<ul>{check.flags.map(f=><li key={f}>{flags[f]||f}</li>)}</ul>}
  <dl>{coordinates&&<><dt>Original GPS · latitude, longitude</dt><dd>{coordinates[1].toFixed(6)}, {coordinates[0].toFixed(6)}</dd></>}
  <dt>Reported county → GPS county</dt><dd>{c.reported} → {c.atCoordinate||'Outside Maryland county polygons'}</dd>
  <dt>County check</dt><dd>{c.status==='match'?'Inside reported county':c.status==='boundary'?'Within 100 m of reported county boundary; uncertain':`${distance(c.distanceToReportedCountyM)} outside reported county`}</dd>
  <dt>Reported road</dt><dd>{r.reported||'Not recorded'}</dd><dt>Nearest same-name road in reported county</dt><dd>{r.nameStatus==='missing'?'No usable source road name':distance(r.nameDistanceM)}</dd>
  {r.route&&<><dt>Reported route · distance to matching route</dt><dd>{r.route} · {r.routeStatus==='not_assessed_ambiguous'||/^(MU|RP) /.test(r.route)?'Not assessed: route number is ambiguous':distance(r.routeDistanceM)}</dd></>}
  <dt>Nearest MDOT road in Maryland</dt><dd>{distance(r.nearestOmocM)}</dd><dt>Nearest named Maryland road</dt><dd>{r.nearestNamedRoad} · {distance(r.nearestNamedRoadM)}</dd>
  <dt>Road check</dt><dd>{r.offroad?'Reported off-road/nontraffic; road-distance flags not applied':r.status==='corroborated'?'Road name or eligible route corroborated within 150 m':r.status==='conflict'?'Road evidence conflicts; review needed':'Not enough road-name / route evidence'}</dd>
  {check.crossStreet.reported&&<><dt>Reported cross street / reference street</dt><dd>{check.crossStreet.reported} · {distance(check.crossStreet.distanceM)}</dd><dt>Source reference offset</dt><dd>{check.crossStreet.offset||'Not recorded'} {check.crossStreet.units==='F'?'feet':check.crossStreet.units==='M'?'miles':check.crossStreet.units} {check.crossStreet.direction}</dd></>}
  {check.coordinateReuse.reports>1&&<><dt>Exact coordinate reuse</dt><dd>{check.coordinateReuse.reports.toLocaleString()} reports · {check.coordinateReuse.counties} counties · {check.coordinateReuse.roadNames} road-name strings</dd></>}
  </dl>
  <small>Different source/reference dates, aliases and private roads can explain a mismatch. Cross streets may be offset landmarks. Repeated coordinates are a review signal, not proof of an error. Original GPS is retained.</small>
 </section>;
}
