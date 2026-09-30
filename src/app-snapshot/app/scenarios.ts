import { layerMeta, rankingScaleLabels, tractMetricMeta } from './hin-data';
import type { HinLayerKey, RankingScale, TierFilter, IntersectionTierFilter, TractMetric } from './hin-data';

export type ViewState = {
  layers: Record<HinLayerKey, boolean>;
  scale: RankingScale;
  rankLimit: 10 | 20 | 30;
  tier: TierFilter;
  intersectionTier: IntersectionTierFilter;
  tractMetric: TractMetric;
  streetQuery: string;
};
export const defaultView: ViewState = {
  layers: { ranked: true, intersections: true, fsi: false, nonMotorist: false, tracts: false },
  scale: 'one', rankLimit: 10, tier: 'all', intersectionTier: 'all',
  tractMetric: 'pedestrianActivityLevel', streetQuery: '',
};
export const scenarios = [
  { id: 'priorities', title: 'Network priorities', number: '01', color: '#d28a2f',
    description: 'Review high-ranking corridors and intersections for further investigation.',
    question: 'Which corridors rank highest in the one-mile set?',
    view: { ...defaultView } },
  { id: 'severe', title: 'Fatal & serious injuries', number: '02', color: '#bd4b43',
    description: 'Focus on major-concern road segments alongside Tier 1 intersections.',
    question: 'How many major-concern injury segment records are shown?',
    view: { ...defaultView, layers: { ranked: false, intersections: true, fsi: true, nonMotorist: false, tracts: false }, tier: 'Major Concern', intersectionTier: 'Tier 1' } },
  { id: 'walking', title: 'Walking & cycling', number: '03', color: '#6d5aa5',
    description: 'Explore non-motorist crash segments with neighborhood pedestrian activity.',
    question: 'Which non-motorist segments have the most crashes?',
    view: { ...defaultView, layers: { ranked: false, intersections: false, fsi: false, nonMotorist: true, tracts: true } } },
  { id: 'community', title: 'Community context', number: '04', color: '#17748a',
    description: 'See households without vehicles alongside the high-injury network.',
    question: 'Which census tracts have the highest share of households without a vehicle?',
    view: { ...defaultView, layers: { ranked: true, intersections: true, fsi: false, nonMotorist: false, tracts: true }, tractMetric: 'zeroVehicleHouseholdsPct' } },
] satisfies Array<{ id: string; title: string; number: string; color: string; description: string; question: string; view: ViewState }>;

export function parseView(params: URLSearchParams, fallback: ViewState = defaultView): ViewState {
  const preset = scenarios.find(s => s.id === params.get('scenario'));
  const state: ViewState = structuredClone(preset?.view ?? fallback);
  if (params.has('layers')) {
    const enabled = new Set(params.get('layers')?.split(','));
    for (const key of Object.keys(layerMeta) as HinLayerKey[]) state.layers[key] = enabled.has(key);
  }
  const scale = params.get('scale');
  if (scale && Object.hasOwn(rankingScaleLabels, scale)) state.scale = scale as RankingScale;
  const limit = Number(params.get('limit'));
  if ([10, 20, 30].includes(limit)) state.rankLimit = limit as ViewState['rankLimit'];
  const tiers: Record<string, TierFilter> = { all: 'all', major: 'Major Concern', moderate: 'Moderate Concern', minor: 'Minor Concern' };
  if (params.has('tier')) state.tier = tiers[params.get('tier')!] ?? 'all';
  const itiers: Record<string, IntersectionTierFilter> = { all: 'all', '1': 'Tier 1', '2': 'Tier 2', '3': 'Tier 3' };
  if (params.has('itier')) state.intersectionTier = itiers[params.get('itier')!] ?? 'all';
  const metric = params.get('metric');
  if (metric && Object.hasOwn(tractMetricMeta, metric)) state.tractMetric = metric as TractMetric;
  state.streetQuery = (params.get('q') ?? state.streetQuery).slice(0, 160);
  return state;
}

export function viewParams(state: ViewState) {
  const params = new URLSearchParams({ view: 'map', scale: state.scale, limit: String(state.rankLimit),
    layers: (Object.keys(layerMeta) as HinLayerKey[]).filter(k => state.layers[k]).join(','),
    tier: state.tier === 'all' ? 'all' : state.tier.split(' ')[0].toLowerCase(),
    itier: state.intersectionTier === 'all' ? 'all' : state.intersectionTier.slice(-1), metric: state.tractMetric });
  if (state.streetQuery.trim()) params.set('q', state.streetQuery.trim());
  return params;
}

export function matchingScenario(state: ViewState) {
  return scenarios.find(s => viewParams(s.view).toString() === viewParams(state).toString());
}

export function validateView(input: unknown): ViewState {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new Error('Invalid map state');
  const state = input as ViewState;
  if (!state.layers || typeof state.layers !== 'object' || Object.keys(layerMeta).some(key => typeof state.layers[key as HinLayerKey] !== 'boolean')) throw new Error('Invalid layers');
  if (!['half','one','two'].includes(state.scale) || ![10,20,30].includes(state.rankLimit)) throw new Error('Invalid corridor filters');
  if (!['all','Major Concern','Moderate Concern','Minor Concern'].includes(state.tier) || !['all','Tier 1','Tier 2','Tier 3'].includes(state.intersectionTier)) throw new Error('Invalid tier');
  if (!Object.hasOwn(tractMetricMeta, state.tractMetric) || typeof state.streetQuery !== 'string' || state.streetQuery.length > 160) throw new Error('Invalid filters');
  return parseView(viewParams(state));
}
