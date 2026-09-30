export type RankingScale = 'half' | 'one' | 'two';
export type HinTier = 'Major Concern' | 'Moderate Concern' | 'Minor Concern';
export type TierFilter = HinTier | 'all';
export type IntersectionTier = 'Tier 1' | 'Tier 2' | 'Tier 3';
export type IntersectionTierFilter = IntersectionTier | 'all';
export type HinLayerKey = 'ranked' | 'intersections' | 'fsi' | 'nonMotorist' | 'tracts';
export type TractMetric =
  | 'pedestrianActivityLevel'
  | 'zeroVehicleHouseholdsPct'
  | 'micromobilityMiles'
  | 'totalPopulation'
  | 'medianIncome';
export type LineGeometry =
  | { type: 'LineString'; coordinates: [number, number][] }
  | { type: 'MultiLineString'; coordinates: [number, number][][] };
export type PointGeometry = { type: 'Point'; coordinates: [number, number] };
export type AreaGeometry =
  | { type: 'Polygon'; coordinates: [number, number][][] }
  | { type: 'MultiPolygon'; coordinates: [number, number][][][] };

type BaseHinFeature<Geometry> = {
  id: string;
  sourceFile: string;
  name: string;
  geometry: Geometry;
};

export type RankedCorridor = BaseHinFeature<LineGeometry> & {
  kind: 'ranked';
  scale: RankingScale;
  rank: number;
  fatal: number;
  serious: number;
  fatalAndSerious: number;
  nonMotorist: number;
  weightedScorePerMile: number;
};

export type FsiSegment = BaseHinFeature<LineGeometry> & {
  kind: 'fsiSegment';
  sourceObjectId: number;
  type: string;
  tier: HinTier;
  fatalAndSerious: number;
};

export type NonMotoristSegment = BaseHinFeature<LineGeometry> & {
  kind: 'nonMotoristSegment';
  sourceObjectId: number;
  sourceFeatureId: number;
  type: string;
  tier: HinTier;
  nonMotorist: number;
};

export type IntersectionFeature = BaseHinFeature<PointGeometry> & {
  kind: 'intersection';
  sourceObjectId: number;
  intersectionId: number;
  clineId: string;
  rank: number;
  tier: IntersectionTier;
  fatal: number;
  serious: number;
  nonMotorist: number;
  score: number;
  sourceCrs: 'EPSG:6488';
};

export type TractFeature = BaseHinFeature<AreaGeometry> & {
  kind: 'tract';
  sourceObjectId: number;
  geoid: string;
  totalPopulation: number;
  medianIncome: number | null;
  zeroVehicleHouseholdsPct: number | null;
  micromobilityMiles: number | null;
  pedestrianActivityLevel: number;
  busStops: number;
  trafficSignals: number;
  schools: number;
  hospitals: number;
};

export type HinFeature = RankedCorridor | FsiSegment | NonMotoristSegment | IntersectionFeature | TractFeature;

export type HinDataAudit = {
  intersectionVersionAudit: {
    localRecords: number;
    publicRecords: number;
    sharedIntersectionIds: number;
    localOnlyIntersectionIds: number;
    publicOnlyIntersectionIds: number;
    sharedIdsWithDifferentRank: number;
    sharedIdsCrossingTierBoundary: number;
    sharedIdsWithDifferentScore: number;
    sharedIdsWithDifferentFatalCount: number;
    sharedIdsWithDifferentSeriousCount: number;
    sharedIdsWithDifferentNonMotoristCount: number;
    sharedGeometryDistanceMeters: {
      minimum: number;
      maximum: number;
      mean: number;
    };
  };
  rankedVersionAudit: Record<RankingScale, {
    existingMapRecords: number;
    databaseRecords: number;
    rowsMatchingByRankAndAttributes: number;
  }>;
};

export type HinDataPayload = {
  rankedCorridors: Record<RankingScale, RankedCorridor[]>;
  fsiSegments: FsiSegment[];
  nonMotoristSegments: NonMotoristSegment[];
  intersections: IntersectionFeature[];
  tracts: TractFeature[];
  audit: HinDataAudit | null;
  sourceFolderUrl: string;
  foundationalFolderUrl: string;
  intersectionMapUrl: string;
  censusGeometryUrl: string;
};

export const rankingScaleLabels: Record<RankingScale, string> = {
  half: '0.5-mile minimum',
  one: '1-mile minimum',
  two: '2-mile minimum',
};

export const tierOptions: HinTier[] = ['Major Concern', 'Moderate Concern', 'Minor Concern'];
export const intersectionTierOptions: IntersectionTier[] = ['Tier 1', 'Tier 2', 'Tier 3'];

export const tractMetricMeta: Record<TractMetric, { label: string; legendLabel: string }> = {
  pedestrianActivityLevel: {
    label: 'Pedestrian activity level',
    legendLabel: 'activity index',
  },
  zeroVehicleHouseholdsPct: {
    label: 'Households with no vehicle',
    legendLabel: 'percent',
  },
  micromobilityMiles: {
    label: 'Micromobility miles traveled',
    legendLabel: 'miles',
  },
  totalPopulation: {
    label: 'Total population',
    legendLabel: 'people',
  },
  medianIncome: {
    label: 'Median household income',
    legendLabel: 'USD',
  },
};

export const tractPalette = ['#edf4f1', '#cfe1da', '#9fc4b8', '#5e9b8c', '#236b63'] as const;

export const layerMeta: Record<HinLayerKey, { label: string; detail: string; color: string }> = {
  ranked: {
    label: 'High Injury Corridors',
    detail: 'Top 30 by HIN score per mile at each minimum length',
    color: '#d28a2f',
  },
  intersections: {
    label: 'High-injury intersections',
    detail: 'New database Top 300 · three ranked tiers',
    color: '#17748a',
  },
  fsi: {
    label: 'Fatal + serious injury segments',
    detail: '1,066 source records · internal BCDOT screen',
    color: '#bd4b43',
  },
  nonMotorist: {
    label: 'Non-motorist crash segments',
    detail: '694 source records · internal BCDOT screen',
    color: '#6d5aa5',
  },
  tracts: {
    label: 'Census tract context',
    detail: '199 tract-level transportation and demographic summaries',
    color: '#89aa9f',
  },
};

export const sourceModifiedDate = 'July 26, 2025';
export const crashObservationPeriod = '2019–2023';
export const methodologySource = 'UMD/BCDOT Draft Final Report · September 2025';

export const segmentTierNotes = {
  fsi: {
    screen: 'At least 2 people killed or seriously injured over five years',
    tiers: ['Minor: 2 people', 'Moderate: 3–4 people', 'Major: 5+ people'],
  },
  nonMotorist: {
    screen: 'At least 5 crashes involving non-motorists over five years',
    tiers: ['Minor: 5–7 crashes', 'Moderate: 8–11 crashes', 'Major: 12+ crashes'],
  },
} as const;

export const sourceFiles = {
  ranked: [
    'top_30_corrdors_half_mile.geojson',
    'top_30_corrdors_one_mile.geojson',
    'top_30_corrdors_two_mile.geojson',
  ],
  fsi: 'segment_of_concern_fatality_severe_injury.geojson',
  nonMotorist: 'segment_of_concern_non_motorist_crash.geojson',
};

export function featureLayer(feature: HinFeature): HinLayerKey {
  if (feature.kind === 'ranked') return 'ranked';
  if (feature.kind === 'intersection') return 'intersections';
  if (feature.kind === 'fsiSegment') return 'fsi';
  if (feature.kind === 'nonMotoristSegment') return 'nonMotorist';
  return 'tracts';
}

export function featureTypeLabel(feature: HinFeature) {
  if (feature.kind === 'ranked') return 'High Injury Corridor';
  if (feature.kind === 'intersection') return 'High-injury intersection';
  if (feature.kind === 'fsiSegment') return 'Fatal + serious injury segment';
  if (feature.kind === 'nonMotoristSegment') return 'Non-motorist crash segment';
  return 'Census tract context';
}

export function corridorHinScore(feature: RankedCorridor) {
  return feature.serious + (2 * feature.nonMotorist) + (10 * feature.fatal);
}

// Normalize search terms only; retain the source name for display and evidence.
export function normalizeStreetName(value: string) {
  const aliases: Record<string, string> = { avenue: 'ave', street: 'st', road: 'rd', boulevard: 'blvd',
    drive: 'dr', lane: 'ln', highway: 'hwy', parkway: 'pkwy', court: 'ct', place: 'pl',
    terrace: 'ter', circle: 'cir', north: 'n', south: 's', east: 'e', west: 'w' };
  return value.toLowerCase().replace(/\./g, '').replace(/\b[a-z]+\b/g, word => aliases[word] ?? word)
    .replace(/\//g, ' ').replace(/\s+/g, ' ').trim();
}

export function matchesStreet(feature: { name: string }, query: string) {
  const needle = normalizeStreetName(query);
  return !needle || ` ${normalizeStreetName(feature.name)}`.includes(` ${needle}`);
}

export function tractMetricValue(feature: TractFeature, metric: TractMetric) {
  return feature[metric];
}
