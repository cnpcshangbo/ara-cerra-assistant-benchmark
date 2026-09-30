#!/usr/bin/env python3
"""Recompute all published aggregates from public, sanitized scalar outcomes.

Python 3.10+, standard library only; no model calls or network access.
This checks aggregation and the strict-review conjunction, not the correctness
of undisclosed answers, source databases, or individual semantic ratings.
"""
from pathlib import Path
import argparse, hashlib, json, math, random, statistics

ROOT = Path(__file__).resolve().parents[1]

def percentile(values, p):
    values = sorted(values)
    if not values:
        return None
    index = (len(values) - 1) * p
    lo = int(index)
    hi = min(lo + 1, len(values) - 1)
    return values[lo] + (values[hi] - values[lo]) * (index - lo)

def stats(rows):
    passed = [r for r in rows if r['strictPass']]
    return {
        'attempts': len(rows), 'passed': len(passed),
        'score': len(passed) / len(rows) if rows else None,
        'medianSeconds': percentile([r['seconds'] for r in rows], .5),
        'p90Seconds': percentile([r['seconds'] for r in rows], .9),
        'successfulMedianSeconds': percentile([r['seconds'] for r in passed], .5),
        'medianBrowserRenderSeconds': percentile([r['browserRenderSeconds'] for r in rows if r['uiPresent']], .5),
        'successWithin30s': sum((r['browserRenderSeconds'] if r['uiPresent'] else r['seconds']) <= 30 for r in passed),
        'http200': sum(r['status'] == 200 for r in rows),
        'unintendedMutations': sum(r['unintendedMutation'] for r in rows),
        'pendingNarrative': sum(r['pendingNarrativeReview'] for r in rows),
        'frozenGraderPass': sum(r['frozenGraderPass'] for r in rows),
    }

def validate(campaigns, records):
    """Reject inconsistent/missing attempts; never impute missing failures."""
    by_campaign = {c['campaignId']: c for c in campaigns}
    assert len(by_campaign) == len(campaigns), 'Duplicate campaign'
    keys = [(r['campaignId'], r['modelId'], r['caseId'], r['repetition']) for r in records]
    assert len(set(keys)) == len(keys), 'Duplicate attempt'
    assert {r['campaignId'] for r in records} == set(by_campaign), 'Unknown or missing campaign'
    for campaign in campaigns:
        cases = {c['id']: c for c in campaign['caseOrder']}
        assert len(cases) == len(campaign['caseOrder']), 'Duplicate case'
        rows = [r for r in records if r['campaignId'] == campaign['campaignId']]
        expected_keys = {(campaign['campaignId'], m, c, rep)
                         for m in campaign['models'] for c in cases
                         for rep in range(1, campaign['repetitions'] + 1)}
        assert {k for k in keys if k[0] == campaign['campaignId']} == expected_keys, 'Incomplete schedule'
        assert len(rows) == campaign['expectedTrials'], 'Count mismatch'
        assert sorted(r['orderIndex'] for r in rows) == list(range(1, len(rows) + 1)), 'Invalid order'
        for r in rows:
            case = cases[r['caseId']]
            assert r['split'] == case['split'] and r['mode'] == case['mode'], 'Case metadata mismatch'
            assert r['originalManifestSha256'] == campaign['originalManifestSha256'], 'Manifest mismatch'
            assert isinstance(r['seconds'], (int, float)) and math.isfinite(r['seconds']) and r['seconds'] >= 0
            assert isinstance(r['protocolPass'], bool) and r['protocolPass'] == all(r['protocolChecks'].values()), 'Invalid protocol conjunction'
            assert all(isinstance(v, bool) for v in r['protocolChecks'].values())
            assert not r['pendingNarrativeReview'], 'Incomplete narrative review'
            if r['narrativeRequired']:
                assert r['narrativeReview'] is not None, 'Missing narrative review'
                assert all(isinstance(r['narrativeReview'][k], bool) for k in ['pass', 'supportedClaims', 'caveatsComplete'])
            else:
                assert r['narrativeReview'] is None, 'Unexpected narrative review'
            strict = r['protocolPass'] and (not r['narrativeRequired'] or r['narrativeReview']['pass'])
            assert r['strictPass'] == strict, 'Invalid strict-review conjunction'
            assert r['sensitivity']['adjusted'] == (r['sensitivity']['pass'] and not r['protocolPass']), 'Sensitivity flag mismatch'
            assert not r['strictPass'] or r['sensitivity']['pass'], 'Sensitivity lost a strict success'
            assert r['uiPresent'] == (r['mode'] == 'browser'), 'Missing browser outcome'
            if r['uiPresent']:
                assert math.isfinite(r['browserRenderSeconds']) and r['browserRenderSeconds'] >= 0
            else:
                assert r['browserRenderSeconds'] is None and not r['uiChanged'] and not r['unintendedMutation']

def aggregate(campaign, rows):
    models = campaign['models']
    primary = [r for r in rows if r['split'] == 'primary']
    case_ids = [c['id'] for c in campaign['caseOrder'] if c['split'] == 'primary']
    scores = {m: [statistics.mean(r['strictPass'] for r in primary if r['modelId'] == m and r['caseId'] == c)
                  for c in case_ids] for m in models}
    rng = random.Random(campaign['seed'])
    bootstrap = {m: [] for m in models}
    differences = {(a, b): [] for i, a in enumerate(models) for b in models[i + 1:]}
    for _ in range(10000):
        indices = [rng.randrange(len(case_ids)) for _ in case_ids]
        means = {m: statistics.mean(scores[m][i] for i in indices) for m in models}
        for m in models:
            bootstrap[m].append(means[m])
        for a, b in differences:
            differences[a, b].append(means[a] - means[b])
    result = {
        'campaignId': campaign['campaignId'], 'manifestSha256': campaign['originalManifestSha256'],
        'complete': True, 'trialCount': len(rows), 'expectedTrials': campaign['expectedTrials'],
        'caseCount': len(campaign['caseOrder']), 'primaryCaseCount': len(case_ids),
        'runWindow': campaign['runWindow'], 'models': {}, 'pairedDifferences': [], 'sensitivity': {},
    }
    for m in models:
        ts = [r for r in primary if r['modelId'] == m]
        result['models'][m] = {
            'primary': stats(ts), 'controls': stats([r for r in rows if r['modelId'] == m and r['split'] == 'control']),
            'taskCluster95CI': [percentile(bootstrap[m], .025), percentile(bootstrap[m], .975)],
            'allThreePassedCases': sum(sum(r['strictPass'] for r in ts if r['caseId'] == c) == 3 for c in case_ids),
            'byCategory': {cat: stats([r for r in ts if r['category'] == cat]) for cat in sorted({r['category'] for r in primary})},
            'byMode': {mode: stats([r for r in ts if r['mode'] == mode]) for mode in ['browser', 'api']},
        }
        result['sensitivity'][m] = {
            'passed': sum(r['sensitivity']['pass'] for r in ts), 'attempts': len(ts),
            'score': statistics.mean(r['sensitivity']['pass'] for r in ts),
            'adjusted': sum(r['sensitivity']['adjusted'] for r in ts),
        }
    for (a, b), values in differences.items():
        result['pairedDifferences'].append({'a': a, 'b': b,
            'difference': statistics.mean(scores[a]) - statistics.mean(scores[b]),
            'taskCluster95CI': [percentile(values, .025), percentile(values, .975)]})
    return result

def compare(actual, expected, path=''):
    if isinstance(expected, dict):
        assert isinstance(actual, dict) and actual.keys() == expected.keys(), f'Key mismatch: {path}'
        for key in expected:
            compare(actual[key], expected[key], path + '/' + str(key))
    elif isinstance(expected, list):
        assert isinstance(actual, list) and len(actual) == len(expected), f'List mismatch: {path}'
        for i, (a, e) in enumerate(zip(actual, expected)):
            compare(a, e, path + '/' + str(i))
    elif isinstance(expected, (float, int)) and not isinstance(expected, bool):
        assert isinstance(actual, (float, int)) and math.isclose(actual, expected, rel_tol=0, abs_tol=1e-12), f'Numeric mismatch: {path}: {actual} vs {expected}'
    else:
        assert actual == expected, f'Value mismatch: {path}: {actual} vs {expected}'

def check_hashes(root):
    provenance = json.loads((root / 'evidence/export-provenance.json').read_text())
    for entry in provenance['files']:
        path = (root / entry['publicPath']).resolve()
        assert path.is_relative_to(root.resolve()), 'Unsafe provenance path'
        actual = hashlib.sha256(path.read_bytes()).hexdigest()
        assert actual == entry['publicSha256'], f'Public file checksum mismatch: {entry["publicPath"]}'
        if entry['transformation'].startswith('byte-identical'):
            assert actual == entry['originalSha256'], 'Exact-copy provenance mismatch'
    return len(provenance['files'])

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--root', type=Path, default=ROOT)
    parser.add_argument('--output', type=Path, help='Optional output file; otherwise read-only')
    args = parser.parse_args()
    count = check_hashes(args.root)
    campaigns = json.loads((args.root / 'evidence/campaigns.json').read_text())['campaigns']
    records = json.loads((args.root / 'evidence/evaluated-records.json').read_text())['records']
    expected = json.loads((args.root / 'evidence/expected-aggregates.json').read_text())
    validate(campaigns, records)
    result = {'schemaVersion': 1, 'campaigns': [aggregate(c, [r for r in records if r['campaignId'] == c['campaignId']]) for c in campaigns]}
    compare(result, expected)
    if args.output:
        args.output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
    print(json.dumps({'verified': True, 'campaigns': len(campaigns), 'attempts': len(records),
        'primaryAttempts': sum(r['split'] == 'primary' for r in records),
        'browserAttempts': sum(r['mode'] == 'browser' for r in records),
        'narrativeReviews': sum(r['narrativeRequired'] for r in records),
        'publicHashesChecked': count, 'bootstrapDrawsPerCampaign': 10000,
        'boundary': 'Aggregate reproduction from exported outcomes; not independent semantic/source-data verification.'}, indent=2))

if __name__ == '__main__':
    main()
