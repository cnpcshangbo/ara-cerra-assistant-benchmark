import { corridorHinScore, featureLayer, layerMeta, matchesStreet, rankingScaleLabels } from './hin-data';
import type { HinDataPayload, HinFeature, HinLayerKey, RankedCorridor } from './hin-data';
import type { ViewState } from './scenarios';

export type QueryPlan = {
  operation: 'overview' | 'rank' | 'count' | 'selected' | 'compare' | 'methodology' | 'unsupported';
  layer?: HinLayerKey;
  scope: 'view' | 'dataset';
  metric?: string;
  scale?: ViewState['scale'];
  limit: number;
  tier?: ViewState['tier'];
  intersectionTier?: ViewState['intersectionTier'];
  street?: string;
  streets?: string[];
  reason?: string;
};
export type EvidenceRow = { id: string; name: string; values: { label: string; value: string | number | null }[] };
export type Evidence = { title: string; scope: string; facts: { label: string; value: string | number }[]; rows: EvidenceRow[]; sources: string[]; notes: string[] };
export type AssistantReply = { answer: string; model: string; evidence: Evidence; plan: QueryPlan; feedback?: { id: string; receipt: string } };
const keys = Object.keys(layerMeta) as HinLayerKey[];
export const metricLabels: Record<string, string> = {
  rank: 'Source rank', weightedScorePerMile: 'HIN score / mile', score: 'HIN score',
  fatal: 'Fatalities (people)', serious: 'Serious injuries (people)', fatalAndSerious: 'Fatal + serious injuries (people)',
  nonMotorist: 'Non-motorist crashes', totalPopulation: 'Population', medianIncome: 'Median household income (USD)',
  zeroVehicleHouseholdsPct: 'Households without a vehicle (%)', micromobilityMiles: 'Micromobility miles',
  pedestrianActivityLevel: 'Pedestrian activity index', busStops: 'Bus stops', trafficSignals: 'Traffic signals', schools: 'Schools', hospitals: 'Hospitals',
};
const allowedMetrics: Record<HinLayerKey, string[]> = {
  ranked: ['rank', 'weightedScorePerMile', 'fatal', 'serious', 'nonMotorist', 'fatalAndSerious'],
  intersections: ['rank', 'score', 'fatal', 'serious', 'nonMotorist'],
  fsi: ['fatalAndSerious'], nonMotorist: ['nonMotorist'],
  tracts: ['zeroVehicleHouseholdsPct', 'pedestrianActivityLevel', 'micromobilityMiles', 'totalPopulation', 'medianIncome', 'busStops', 'trafficSignals', 'schools', 'hospitals'],
};
export const dataNotes = [
  'Crash observation period: 2019–2023. The data are historical screening summaries, not current risk predictions.',
  'HIN score = serious injuries + 2 × non-motorist crashes + 10 × fatalities. Injuries/fatalities count people; non-motorist counts crashes.',
  'Corridors rank by HIN score per mile independently in the 0.5-, 1-, and 2-mile minimum-length sets. Minimum length is not the measured length. Source rank controls order.',
  'Intersections use the supplied database Top 300 version. Rank 1–100: Tier 1; 101–200: Tier 2; 201–300: Tier 3.',
  'Source segment tiers are retained: FSI Minor 2, Moderate 3–4, Major 5+ people; non-motorist Minor 5–7, Moderate 8–11, Major 12+ crashes. Report strict-boundary wording conflicts and remains unresolved.',
  'Records may overlap spatially. Do not add corridors, segments, intersections, or minimum-length sets to produce citywide crash/person totals. Segment counts mean source records, not unique road segments.',
  'Tract context is aggregate data joined by GEOID to Census 2020 geometry; null is unavailable, not zero. It cannot establish individual behavior or causation.',
  'No annual trend, exposure-adjusted crash rate, treatment effect, project cost, current conditions, or crash-level data are available to this assistant. A causal explanation or treatment recommendation needs additional evidence.',
  'Report intersection influence distances conflict (150 vs 250 feet). Database and public intersection ranks differ; the dashboard preserves the database version. Two-mile database corridor table differs from the retained supplied map layer.',
];

export function validatePlan(input: unknown): QueryPlan {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Invalid query plan');
  const value = input as Record<string, unknown>;
  const fields = ['operation', 'layer', 'scope', 'metric', 'scale', 'limit', 'street', 'streets', 'reason', 'tier', 'intersectionTier'];
  if (Object.keys(value).some(k => !fields.includes(k))) throw new Error('Unsupported query condition');
  if (!['overview','rank','count','selected','compare','methodology','unsupported'].includes(String(value.operation))) throw new Error('Unknown operation');
  if (!['view','dataset'].includes(String(value.scope))) throw new Error('Invalid scope');
  if (value.layer !== undefined && !keys.includes(value.layer as HinLayerKey)) throw new Error('Unknown layer');
  if (value.scale !== undefined && !['half','one','two'].includes(String(value.scale))) throw new Error('Invalid scale');
  if (value.limit !== undefined && (!Number.isInteger(value.limit) || Number(value.limit) < 1 || Number(value.limit) > 10)) throw new Error('Limit must be 1–10');
  if (value.tier !== undefined && (!['fsi','nonMotorist'].includes(String(value.layer)) || !['all','Major Concern','Moderate Concern','Minor Concern'].includes(String(value.tier)))) throw new Error('Invalid segment tier');
  if (value.intersectionTier !== undefined && (value.layer !== 'intersections' || !['all','Tier 1','Tier 2','Tier 3'].includes(String(value.intersectionTier)))) throw new Error('Invalid intersection tier');
  if (value.street !== undefined && (typeof value.street !== 'string' || value.street.length > 160)) throw new Error('Invalid street');
  if (value.streets !== undefined && (!Array.isArray(value.streets) || value.streets.length > 3 || value.streets.some(s => typeof s !== 'string' || !s.trim() || s.length > 160))) throw new Error('Invalid comparison');
  if (value.reason !== undefined && (typeof value.reason !== 'string' || value.reason.length > 400)) throw new Error('Invalid reason');
  if (['rank','count'].includes(String(value.operation)) && !value.layer) throw new Error('A layer is required');
  if (value.operation === 'compare' && !(value.streets as string[] | undefined)?.length && !value.street) throw new Error('Street names required');
  if (value.metric !== undefined && (!value.layer || !allowedMetrics[value.layer as HinLayerKey].includes(String(value.metric)))) throw new Error('Metric does not belong to layer');
  return { ...value, limit: value.limit ?? 5 } as QueryPlan;
}

export function allFeatures(data: HinDataPayload): HinFeature[] {
  return [...Object.values(data.rankedCorridors).flat(), ...data.intersections, ...data.fsiSegments, ...data.nonMotoristSegments, ...data.tracts];
}
export function featureRow(feature: HinFeature): EvidenceRow {
  const metrics = allowedMetrics[featureLayer(feature)];
  const values: EvidenceRow['values'] = metrics.map(key => ({ label: metricLabels[key], value: (feature as unknown as Record<string, number | null>)[key] }));
  if ('tier' in feature) values.unshift({ label: 'Source tier', value: feature.tier });
  if (feature.kind === 'ranked') values.unshift({ label: 'Minimum-length set', value: rankingScaleLabels[feature.scale] }, { label: 'HIN score', value: corridorHinScore(feature) });
  if (feature.kind === 'tract') values.unshift({ label: 'GEOID', value: feature.geoid });
  return { id: feature.id, name: feature.name, values };
}

function featuresForLayer(data: HinDataPayload, layer: HinLayerKey, state: ViewState, plan: QueryPlan): HinFeature[] {
  let features: HinFeature[] = layer === 'ranked' ? data.rankedCorridors[plan.scale ?? state.scale] : layer === 'fsi' ? data.fsiSegments : layer === 'nonMotorist' ? data.nonMotoristSegments : layer === 'intersections' ? data.intersections : data.tracts;
  if (plan.scope === 'view') {
    if (!state.layers[layer]) return [];
    if (layer === 'ranked' && plan.scale && plan.scale !== state.scale) return [];
    features = features.filter(f => {
      if (f.kind === 'ranked') return f.rank <= state.rankLimit && matchesStreet(f, state.streetQuery);
      if (f.kind === 'fsiSegment' || f.kind === 'nonMotoristSegment') return (state.tier === 'all' || state.tier === f.tier) && matchesStreet(f, state.streetQuery);
      if (f.kind === 'intersection') return state.intersectionTier === 'all' || state.intersectionTier === f.tier;
      return true;
    });
  }
  if (plan.tier && plan.tier !== 'all') features = features.filter(f => 'tier' in f && f.tier === plan.tier);
  if (plan.intersectionTier && plan.intersectionTier !== 'all') features = features.filter(f => f.kind === 'intersection' && f.tier === plan.intersectionTier);
  if (plan.street?.trim()) features = features.filter(f => matchesStreet(f, plan.street!));
  return features;
}

export function queryData(data: HinDataPayload, state: ViewState, plan: QueryPlan, selectedId?: string, authorizedLayers: HinLayerKey[] = keys): Evidence {
  const evidence: Evidence = { title: 'Dashboard evidence', scope: plan.scope === 'view' ? 'Current map layers and filters (not the viewport boundary)' : 'Available dataset; map filters do not apply', facts: [], rows: [], sources: [], notes: [...dataNotes] };
  const sources = new Set<string>();
  if (plan.scope === 'view' && plan.layer === 'ranked' && plan.scale && plan.scale !== state.scale) {
    evidence.notes.unshift(`The requested ${rankingScaleLabels[plan.scale]} set is not active; the map uses ${rankingScaleLabels[state.scale]}. Switch the map set or ask about the full dataset.`);
  }
  const add = (features: HinFeature[]) => { features.forEach(f => sources.add(f.sourceFile)); };
  if (plan.operation === 'unsupported') {
    evidence.title = 'Additional data needed';
    evidence.facts.push({ label: 'Query status', value: 'The requested conclusion cannot be calculated from the available dashboard fields.' });
  } else if (plan.operation === 'methodology') {
    evidence.title = 'HIN methods and data limits';
    sources.add('UMD/BCDOT Draft Final Report · September 2025 (definitions transcribed into dashboard)');
  } else if (plan.operation === 'selected') {
    evidence.title = 'Selected map feature';
    const f = allFeatures(data).find(f => f.id === selectedId);
    if (f) { evidence.rows = [featureRow(f)]; add([f]); }
    else evidence.facts.push({ label: 'Selection', value: 'No map feature selected. Select a line, point, or tract first.' });
  } else if (plan.operation === 'compare') {
    evidence.title = 'Corridor comparison across minimum-length sets';
    evidence.scope = 'Available Top 30 corridor sets; matched by source name, not a persistent corridor ID';
    const names = plan.streets ?? [plan.street!];
    const features: RankedCorridor[] = [];
    for (const name of names) for (const scale of ['half','one','two'] as const) {
      const matches = data.rankedCorridors[scale].filter(f => matchesStreet(f, name));
      evidence.facts.push({ label: `${name} · ${rankingScaleLabels[scale]}`, value: matches.length ? `${matches.length} source-name matches` : 'Not in the supplied Top 30; not evidence of zero crashes' });
      features.push(...matches);
    }
    evidence.rows = [...new Map(features.map(f => [f.id, f])).values()].slice(0, 10).map(featureRow); add(features);
    if (features.length > 10) evidence.notes.unshift('Only the first 10 matched records are displayed; narrow the street names to compare specific corridors.');
  } else {
    const requestedLayers = plan.operation === 'overview' ? authorizedLayers : [plan.layer!];
    for (const layer of requestedLayers) {
      const features = featuresForLayer(data, layer, state, plan);
      add(features);
      evidence.facts.push({ label: `${layerMeta[layer].label} · source records`, value: features.length });
      if (plan.operation === 'count') {
        for (const tier of [...new Set(features.flatMap(f => 'tier' in f ? [f.tier] : []))]) {
          evidence.facts.push({ label: tier, value: features.filter(f => 'tier' in f && f.tier === tier).length });
        }
      }
      if (plan.operation === 'rank') {
        const metric = plan.metric ?? allowedMetrics[layer][0];
        const measurable = features.filter(f => typeof (f as unknown as Record<string, unknown>)[metric] === 'number');
        const sorted = [...measurable].sort((a,b) => {
          const av = (a as unknown as Record<string,number>)[metric], bv = (b as unknown as Record<string,number>)[metric];
          return (metric === 'rank' ? av - bv : bv - av) || a.id.localeCompare(b.id);
        });
        evidence.title = `${layerMeta[layer].label} · ${metricLabels[metric]}`;
        evidence.facts.push({ label: 'Ranked by', value: `${metricLabels[metric]} (${metric === 'rank' ? 'ascending' : 'descending'})` }, { label: 'Records with available metric', value: measurable.length }, { label: 'Records returned', value: Math.min(plan.limit, sorted.length) });
        evidence.rows.push(...sorted.slice(0, plan.limit).map(featureRow));
        if (features.length > measurable.length) evidence.notes.unshift(`${features.length - measurable.length} records have unavailable values and are excluded from this ranking.`);
      }
    }
  }
  evidence.sources = [...sources];
  if (!evidence.sources.length) evidence.sources = ['Dashboard data catalog and methodology definitions'];
  return evidence;
}

export function factualAnswer(evidence: Evidence, plan: QueryPlan, language: string): string | undefined {
  let answer: string | undefined;
    // Counts and an empty selection have exact, short responses. The model still
    // resolves the natural-language query; these factual outputs never depend on prose generation.
    if (plan.operation === 'count' || plan.operation === 'overview') {
      const prefix = language === 'English' ? 'Calculated source-record counts:' : '计算得到的源记录数量：';
      const scope = language === 'English' ? evidence.scope : plan.scope === 'view' ? '范围：当前启用图层及筛选，不按地图窗口边界筛选。' : '范围：现有数据集，不受地图筛选限制。';
      answer = `${prefix}\n${evidence.facts.map(f => `${f.label}: ${f.value}`).join('\n')}\n\n${scope}\n${language === 'English' ? 'These are source records, not verified unique road segments. Overlapping layers cannot be added to obtain a citywide crash total.' : '这里统计的是源记录，不是经过去重的唯一路段。重叠图层不能相加得到全市事故总数。'}`;
    }
    if (plan.operation === 'rank' && evidence.rows.length) {
      const metricLabel = evidence.facts.find(f => f.label === 'Ranked by')?.value ?? '';
      const metric = String(metricLabel).replace(/ \((?:ascending|descending)\)$/, '');
      const lead = language === 'English' ? `${evidence.title} — ${evidence.rows.length} returned records:` : `${evidence.title}，返回 ${evidence.rows.length} 条源记录：`;
      answer = `${lead}\n${evidence.rows.map((row,i) => `${i+1}. ${row.name} — ${metric}: ${row.values.find(v => v.label === metric)?.value ?? 'Unavailable'}`).join('\n')}\n\n${language === 'English' ? evidence.scope : (plan.scope === 'view' ? '范围：当前启用图层及筛选，不按地图窗口边界筛选。' : '范围：现有数据集，不受地图筛选限制。')}\n${plan.layer === 'ranked' ? (language === 'English' ? 'Each minimum-length set is ranked independently by HIN score per mile; the minimum is not the measured corridor length.' : '每组最低长度内按每英里 HIN 评分独立排名；最低长度不是走廊的实际测量长度。') : (language === 'English' ? 'Unavailable values are excluded. See the source records below.' : '缺失值不参与排名，具体字段及来源见下方记录。')}`;
    }
    if (plan.operation === 'compare' && evidence.rows.length) {
      answer = `${language === 'English' ? 'Source corridor-name matches across minimum-length sets:' : '按源走廊名称匹配各最低长度组：'}\n${evidence.rows.map(row => `${row.name} · ${row.values.find(v => v.label === 'Minimum-length set')?.value}: #${row.values.find(v => v.label === 'Source rank')?.value} · HIN score/mi ${row.values.find(v => v.label === 'HIN score / mile')?.value}`).join('\n')}\n\n${language === 'English' ? 'Each set ranks independently. Matching names do not establish identical geometry. Do not add records across sets to produce a crash total.' : '各组独立排名。相同名称不代表几何范围已确认一致，不能跨组累加事故数量。'}`;
    }
    if (plan.operation === 'selected' && evidence.rows.length) {
      const row = evidence.rows[0];
      answer = `${row.name}\n${row.values.map(value => `${value.label}: ${value.value === null ? 'Unavailable' : value.value}`).join('\n')}\n\n${language === 'English' ? 'Fatalities and serious injuries count people; non-motorist values count crashes. Historical screening records do not establish the cause of crashes or predict current risk.' : 'Fatalities 和 Serious injuries 统计人数，Non-motorist crashes 统计事故次数。历史筛查记录不能解释事故原因，也不是当前风险预测。'}`;
    }
    if (plan.operation === 'selected' && !evidence.rows.length) answer = language === 'English' ? 'Select a line, intersection, or census tract on the map first. I can then explain its recorded outcomes, ranking, and source.' : '请先在地图上选择一条道路、一个交叉口或一个 Census tract，我就能解释它的记录指标、排名和来源。';
  return answer;
}

// Reconcile explicit, controlled filter terms before execution. A model omission
// must not turn a tier-specific question into an unfiltered total.
export function reconcilePlan(input: Record<string, unknown>, question: string, history: { role: string; content: string }[] = [], view?: ViewState): QueryPlan {
  const parsed = { ...input };
  const text = question.toLowerCase();
  const followup = /^(?:what about|how about|and\b|same\b|those\b|these\b|那|再|同样|这些|它们)/u.test(text.trim());
  const context = followup ? [...history.filter(m => m.role === 'user').slice(-1).map(m => m.content), question].join('\n').toLowerCase() : text;
  const explicitDataset = /\b(?:(?:whole|entire|full) dataset|all available|ignore (?:the )?(?:current )?(?:map )?filters|regardless of (?:the )?(?:current )?(?:map )?filters)\b|全数据|全部数据|整个数据集|忽略.*筛选|不受.*筛选/u.test(text);
  const datasetQuestion = /\b(?:citywide|city-wide|(?:whole|entire|full) city)\b|全市/u.test(text);
  const viewQuestion = /\b(?:current|shown|showing|these|those|here|on (?:the |this )?map|in (?:this|the) (?:view|map)|filtered)\b|当前|显示|这些|此视图|这里|此处|地图上|图上|图中|这个地图|筛选后/u.test(text);
  if (explicitDataset) parsed.scope = 'dataset';
  else if (viewQuestion) parsed.scope = 'view';
  else if (datasetQuestion) parsed.scope = 'dataset';
  // Otherwise preserve the planner's interpretation, including a real follow-up.
  if (parsed.operation === 'count' && (!parsed.layer || parsed.layer === 'all' || parsed.layer === 'view')) parsed.operation = 'overview';
  if (['selected','overview','methodology','unsupported'].includes(String(parsed.operation))) {
    return validatePlan({ operation: parsed.operation, scope: parsed.operation === 'selected' ? 'view' : parsed.scope ?? 'view', limit: 5, ...(parsed.reason ? { reason: parsed.reason } : {}) });
  }
  const segmentTierRequested = /(?:major|moderate|minor) concern|重大关注|中度关注|轻度关注/u.test(context);
  const intersectionTierRequested = /tier\s*[123]|第\s*[一二三123]\s*(?:级|层)/u.test(context);
  const scaleRequested = /(?:\b(?:half|one|two|0\.5|1|2)[ -]*(?:mile|mi\b)|(?:半|一|二|两|0\.5|1|2)\s*英里)/u.test(context);
  // The view is applied by the query engine. Remove only recognized filters
  // copied from that view without user intent; never drop an explicit condition.
  if (view) {
    if (!segmentTierRequested && parsed.tier === view.tier) delete parsed.tier;
    if (!intersectionTierRequested && parsed.intersectionTier === view.intersectionTier) delete parsed.intersectionTier;
    if (!scaleRequested && parsed.scale === view.scale) delete parsed.scale;
  }
  if (['fsi','nonMotorist'].includes(String(parsed.layer))) {
    const tierTerms = ['Major Concern','Moderate Concern','Minor Concern'] as const;
    const current = tierTerms.filter(tier => text.includes(tier.toLowerCase()));
    const requested = current.length ? current : tierTerms.filter(tier => context.includes(tier.toLowerCase()));
    if (requested.length === 1) parsed.tier = requested[0];
  }
  if (parsed.layer === 'intersections') {
    const current = [...text.matchAll(/tier\s*([123])/gi)];
    const matches = current.length ? current : [...context.matchAll(/tier\s*([123])/gi)];
    if (matches.length === 1) parsed.intersectionTier = `Tier ${matches[0][1]}`;
  }
  if (parsed.operation === 'rank') {
    const words: Record<string,number> = { one:1,two:2,three:3,four:4,five:5,six:6,seven:7,eight:8,nine:9,ten:10,
      eleven:11,twelve:12,twenty:20,pair:2,couple:2,trio:3,quartet:4,dozen:12 };
    const withoutLengths = (text: string) => text.toLowerCase()
      .replace(/\b(?:\d+(?:\.\d+)?|half|one|two)\s*[-–—]?\s*(?:miles?|mi\b)/gu, 'length-set')
      .replace(/(?:半|[一二两0-9.]+)\s*英里/gu, 'length-set');
    const limitFor = (text: string) => {
      const clean = withoutLengths(text);
      const token = `-?\\d+(?:\\.\\d+)?|${Object.keys(words).join('|')}`;
      const match = clean.match(new RegExp(`\\b(?:top|first|which|highest)\\s+(${token})\\b|(?:^|\\s)(${token})\\s+(?:(?:highest|best|top)[ -]*(?:ranked)?\\s*|ranked\\s+)?(?:intersections?|corridors?|roads?|records?|tracts?|segments?)\\b|前\\s*(-?\\d+(?:\\.\\d+)?|[零〇一二三四五六七八九十百千两]+)\\s*(?:个|条|名)?`, 'u'));
      const value = match?.[1] ?? match?.[2] ?? match?.[3];
      if (value === undefined) return undefined;
      if (/^-?\d+(?:\.\d+)?$/.test(value)) return Number(value);
      if (words[value]) return words[value];
      const digits: Record<string, number> = { 零:0,〇:0,一:1,二:2,两:2,三:3,四:4,五:5,六:6,七:7,八:8,九:9 };
      const units: Record<string, number> = { 十:10,百:100,千:1000 };
      let total=0, digit=0;
      for (const char of value) {
        if (units[char]) { total += (digit || 1) * units[char]; digit=0; }
        else digit=digits[char];
      }
      return total + digit;
    };
    const quantityCue = new RegExp(`\\b(?:\\d+|${Object.keys(words).join('|')})\\b|前[零〇一二三四五六七八九十百千两0-9]`, 'u').test(withoutLengths(question));
    const requested = limitFor(question) ?? (followup ? [...history].reverse().filter(m => m.role === 'user').map(m => limitFor(m.content)).find(value => value !== undefined) : undefined) ?? (quantityCue ? parsed.limit : undefined) ?? 5;
    if (typeof requested !== 'number') throw new Error('Invalid ranking limit');
    if (requested > 10) return { operation: 'unsupported', scope: 'dataset', limit: 5, reason: 'At most 10 ranked records can be returned per question. Ask for Top 10, or use the map ranking list for Top 30.' };
    parsed.limit = requested;
  }
  return validatePlan(parsed);
}
