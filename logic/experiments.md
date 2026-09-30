# Experiments and analyses

These declarative records reconstruct what was performed. “Expected outcome” states the analysis purpose directionally; it is not a claim of prospective preregistration. Exact observed values belong in evidence files.

## E01: Historical workflow comparisons
- **Verifies**: [C01, C02, C06]
- **Evidence**: evidence/tables/table1.md; evidence/evaluated-records.json; evidence/expected-aggregates.json
- **Run**: src/artifacts.md; frozen graders and public reproduction command indexed there
- **Setup**: Historical deployed local and hosted API configurations with retained source snapshots and frozen suite.
- **Procedure**: Execute the scheduled tasks from canonical context; retain failed outcomes; apply structural, semantic and browser checks; report each campaign separately.
- **Metrics**: Strict task success, request time, supported actions, state violations and controls.
- **Expected outcome**: Exposes whether request completion and aggregate success omit workflow-specific failures.
- **Baselines**: No cross-campaign causal ranking; comparisons remain within documented execution conditions.
- **Dependencies**: Frozen source/task/criterion records; distinct campaign identities retained.

## E02: Contemporaneous local configuration comparison
- **Verifies**: [C02, C03, C06]
- **Evidence**: evidence/figures/figure2.md; evidence/tables/table1.md; paper/source/paired-summary.json
- **Run**: src/artifacts.md; local campaign frozen graders and aggregate reproduction
- **Setup**: The baseline and newer larger Qwen packages share frozen application/data and hardware but differ in size/offload.
- **Procedure**: Run the fixed interleaved schedule, retain every attempt, compare task means using paired task-cluster resampling and report request/browser timing separately.
- **Metrics**: Strict successes, task consistency, paired difference, supported actions, state violations and latency.
- **Expected outcome**: Tests the direction of a practical configuration difference and whether accuracy gains carry response-time cost; this description is post-hoc, not a preregistered directional hypothesis.
- **Baselines**: Historical observations contextualize but do not enter the paired effect.
- **Dependencies**: Frozen source/task/criterion records; distinct campaign identities retained.

## E03: Separate hosted API extension
- **Verifies**: [C01, C06]
- **Evidence**: evidence/tables/table1.md; evidence/expected-aggregates.json; evidence/evaluated-records.json
- **Run**: src/artifacts.md; extension frozen grader and public reproduction
- **Setup**: A frozen local application calls the requested hosted API alias under its explicit reasoning/output configuration.
- **Procedure**: Check source/oracle/grader parity, freeze configuration, execute one scheduled campaign, review narratives blindly, verify completeness and provider identity before aggregation.
- **Metrics**: Strict success, marginal uncertainty, time, HTTP status, controls, browser effects and narrative pass.
- **Expected outcome**: Provides an additional configuration observation and shows whether completed requests meet the full analytical contract.
- **Baselines**: No contemporaneous comparator or within-campaign paired effect.
- **Dependencies**: Frozen source/task/criterion records; distinct campaign identities retained.

## E04: Failure and criterion-sensitivity audit
- **Verifies**: [C02, C04, C07]
- **Evidence**: logic/solution/audit-history.md; evidence/tables/appendix-a-task-inventory.md; evidence/evaluated-records.json
- **Run**: src/artifacts.md; application inspection snapshot, graders and sensitivity code
- **Setup**: Recorded final outputs, browser effects, source-code scope reconciliation and inherited acceptance/sensitivity rules.
- **Procedure**: Inspect strict failures; distinguish wrong evidence, contract mismatch, redundant actions and actual state change; verify scope override from code; flag prompt ambiguity without rewriting scored originals.
- **Metrics**: Failure categories and sensitivity differences, bounded by absent raw intermediates.
- **Expected outcome**: Identifies which failures concern rubric design or shared processing rather than numerical fabrication or isolated model behavior.
- **Baselines**: New held-out task revision and causal attribution runs are not performed.
- **Dependencies**: Frozen source/task/criterion records; distinct campaign identities retained.

## E05: Narrative packet correction audit
- **Verifies**: [C05]
- **Evidence**: logic/solution/audit-history.md; paper/source/main.tex
- **Run**: src/artifacts.md; frozen scoring guidance; retained original correction documented in manuscript
- **Setup**: Unchanged historical narrative answers, the original incomplete packet, full frozen scoring notes and anonymous historical calibration.
- **Procedure**: Preserve initial judgments; repeat identity-blind review with complete guidance; retain both outcomes and document that no answer, oracle or inference attempt was replaced.
- **Metrics**: Changed decisions, completeness of essential qualifications and traceability of review metadata.
- **Expected outcome**: Tests sensitivity of semantic adjudication to omitted guidance; does not measure human inter-rater reliability.
- **Baselines**: Independent domain review remains an open next step.
- **Dependencies**: Frozen source/task/criterion records; distinct campaign identities retained.
