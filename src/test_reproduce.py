"""Meaningful offline aggregation/integrity regressions; no private archive."""
import copy, json, unittest
from pathlib import Path
from reproduce import ROOT, percentile, compare, validate, aggregate

class ReproductionTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.campaigns = json.loads((ROOT/'evidence/campaigns.json').read_text())['campaigns']
        cls.records = json.loads((ROOT/'evidence/evaluated-records.json').read_text())['records']

    def test_percentile_interpolation_and_empty(self):
        self.assertIsNone(percentile([], .5))
        self.assertEqual(percentile([0,10,20,30], .9),27)
        self.assertEqual(percentile([0,10], .025),.25)

    def test_incomplete_trial_set_rejected(self):
        with self.assertRaisesRegex(AssertionError,'Incomplete schedule'):
            validate(self.campaigns,self.records[:-1])

    def test_duplicate_trial_rejected(self):
        with self.assertRaisesRegex(AssertionError,'Duplicate attempt'):
            validate(self.campaigns,self.records+[self.records[0]])

    def test_tampered_review_conjunction_rejected(self):
        rows=copy.deepcopy(self.records)
        row=next(r for r in rows if r['narrativeRequired'] and r['strictPass'])
        row['narrativeReview']['pass']=False
        with self.assertRaisesRegex(AssertionError,'Invalid strict-review conjunction'):
            validate(self.campaigns,rows)

    def test_strict_score_tampering_rejected(self):
        rows=copy.deepcopy(self.records)
        rows[0]['strictPass']=not rows[0]['strictPass']
        with self.assertRaisesRegex(AssertionError,'Invalid strict-review conjunction'):
            validate(self.campaigns,rows)

    def test_control_success_does_not_affect_primary_score(self):
        campaign=self.campaigns[-1]
        rows=[copy.deepcopy(r) for r in self.records if r['campaignId']==campaign['campaignId']]
        original=aggregate(campaign,rows)
        for row in rows:
            if row['split']=='control': row['strictPass']=False
        changed=aggregate(campaign,rows)
        compare(original['models']['openai-gpt-6.1-sol']['primary'],changed['models']['openai-gpt-6.1-sol']['primary'])
        self.assertEqual(changed['models']['openai-gpt-6.1-sol']['controls']['passed'],0)

if __name__=='__main__': unittest.main()
