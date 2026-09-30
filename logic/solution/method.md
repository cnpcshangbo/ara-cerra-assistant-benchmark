# Evaluation method

## Frozen tasks and controls
The original suite contains 24 primary tasks and four controls, each repeated three times per configuration. Nine tasks are browser cases (seven primary and two controls), while the others exercise equivalent authenticated API payloads. Canonical context and histories reset each attempt. Model ordering is fixed by the seeded schedule. No external retry replaces a failed attempt. `benchmark/tasks.json` is a declared public derivative; MD07 record redactions are not retroactive edits to scored originals. C01 and C06.

## Strict and diagnostic outcomes
Strict success requires all essential completion, identity, operation, scope, constraint, evidence, semantic and browser checks. Controls are excluded from primary ranking and latency. Supported filter changes and actual state violations have separate denominators. Secondary functional equivalence is inherited from the initial post-hoc analysis and does not replace the primary rubric. C01 and C02.

## Score and uncertainty
For configuration $m$, task $i$ and repetition $r$, let $y_{mir}$ be binary strict success. The task mean is $\bar y_{mi}=R^{-1}\sum_r y_{mir}$ and score is $S_m=T^{-1}\sum_i\bar y_{mi}$. For the original primary suite, $T=24$ and $R=3$. The paired effect is $\widehat\Delta_{b-a}=T^{-1}\sum_i(\bar y_{bi}-\bar y_{ai})$. Bootstrap sampling retains repetitions within task clusters: 10,000 draws, seed 20260918, percentile 95% intervals. This seed fixes scheduling/resampling, not model token sampling. These convenience-suite intervals are unadjusted and do not remove task-selection bias. The single-configuration API extension has no paired effect. C03 and C06.

## Time and consistency
Request latency includes all primary attempts, failures included, and covers loading, internal retries and data access. Browser completion additionally includes resulting UI rendering. Report median and P90 plus strict successes completed within 30 seconds (browser completion time for browser cases). Count tasks passing all three repetitions directly; do not call this a separately estimated general reliability statistic. C03.

## Semantic adjudication
Review supplies answers, required/forbidden propositions, original qualification notes and anonymous calibration while withholding model identity and aggregate scores. Required and optional propositions remain separate. Original judgments and later packet corrections are preserved. This is AI-assisted review, with human domain validation pending. C05.

## Claim interpretation
The contemporaneous Qwen pair compares practical configurations with differing model size and offload. Historical campaigns and the API extension retain distinct execution groups. Configuration scores inform deployment choices but do not establish intrinsic model ranking, human benefit or an optimal default. C06.
