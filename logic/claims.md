# Claims

These are post-hoc distilled, bounded conclusions from the retained experiments. They are not prospectively registered hypotheses. Numerical receipts below are verbatim from faithful source transcriptions or manuscript excerpts; displayed rounding is not a replacement for the machine data.

## C01: Completion is not workflow correctness
- **Statement**: Successful request delivery can coexist with incorrect analytical scope or task outcomes.
- **Conditions**: Bounded CERRA workflows with frozen source oracles and state checks; no general transport-reliability claim or isolated foundation-model attribution.
- **Sources**: `logic/solution/audit-history.md:33` «Median request latency is 2.15 seconds and P90 is 4.88 seconds; median primary-browser completion is 7.04 seconds. All 64 strict successes finish within the 30-second budget. These measurements describe the frozen local-application/API route in Section~\ref{sec:api-extension}, not a matched speed comparison with other campaigns. All 84 requests return HTTP 200, but eight primary attempts fail strict scoring: three on MD01, three on MD04, and two on MD09. This contrast isolates the difference between successful request delivery and successful analytical assistance. Neither the score nor the latency establishes superiority over the historical GPT configurations or local models without a contemporaneous comparison.» [result]
- **Status**: supported
- **Falsification criteria**: A representative held-out application suite in the same regime shows that completion predicts all required scope, evidence and state checks, leaving no completed-but-incorrect outcome.
- **Proof**: [E01, E03]
- **Evidence basis**: The single API campaign completes every request but retains failed primary outcomes; historical status totals are reported separately.
- **Dependencies**: []
- **Provenance**: ai-compiled from documented experiments; independent human review pending.

## C02: Contract adherence and visible state changes are distinct
- **Statement**: A strict interface contract can reject an otherwise useful answer or redundant action without an unwanted state change.
- **Conditions**: Applies to the retained acceptance contract and narrowly inherited functional sensitivity; it does not reclassify primary scores or measure user harm.
- **Sources**: `evidence/tables/table1.md:18` «| 2026-09-29 / Paired local | Qwen3 14B | 49/72 (68.1%) | 50.0–84.7 | 3.77 | 7.20 | 11/15 | 3/21 | 55/72 |» [result]
- **Status**: supported
- **Falsification criteria**: Every strict mismatch on a new matched set produces a substantive wrong answer or forbidden value change, and no contract-only mismatches remain under an independently reviewed rubric.
- **Proof**: [E01, E02, E04]
- **Evidence basis**: The strict versus functional difference and redundant-field example support inspecting separate diagnostics rather than treating every contract failure as harmful mutation.
- **Dependencies**: []
- **Provenance**: ai-compiled from documented experiments; independent human review pending.

## C03: Configuration quality and response time can trade off
- **Statement**: A practical configuration that improves workflow success can require substantially longer response time.
- **Conditions**: Supported by the contemporaneous local pair under its shared hardware, cold-loading and partial-offload conditions; not an isolated model-generation effect or universal accuracy–latency law.
- **Sources**: `evidence/figures/figure2.md:13` «| Qwen3 14B | 49/72 | 68.1% | 50.0–84.7 | 3.77 | 7.20 | 3/21 |» [result]; `evidence/figures/figure2.md:14` «| Qwen3.8 27B Q4_K_M | 63/72 | 87.5% | 75.0–100.0 | 14.50 | 29.81 | 0/21 |» [result]
- **Status**: supported
- **Falsification criteria**: Repeated matched measurements with the same configurations and source suite show no accuracy gain or no latency increase, reversing the stated directional relationship.
- **Proof**: [E02]
- **Evidence basis**: The paired accuracy improvement accompanies higher median and tail request latency; the comparison retains failures and distinguishes request time from browser completion.
- **Dependencies**: []
- **Provenance**: ai-compiled from documented experiments; independent human review pending.

## C04: Shared processing limits failure attribution
- **Statement**: Shared scope reconciliation can overwrite a model-selected scope, limiting attribution of final failures to the model alone.
- **Conditions**: The confirmed visible-keyword rule applies to plans reaching its scope-assignment branch. Raw pre-reconciliation plans were not retained, so each model’s initial interpretation remains unknown.
- **Sources**: `logic/solution/audit-history.md:18` «The frozen application's scope-reconciliation code contains a confirmed shared defect: for plans reaching its scope-assignment branch, a keyword check matches ``visible'' without handling negation or exclusion. It therefore assigns viewport scope even for ``outside the visible map,'' overwriting an otherwise appropriate filtered scope. This constraint is already recorded in the frozen task metadata and remains unchanged during evaluation. MD01 is consequently not a model-only failure. The shared rule is known, while the raw pre-reconciliation plans are not retained; we cannot reconstruct each model's original interpretation or isolate its additional contribution to every failed path.» [result]
- **Status**: supported
- **Falsification criteria**: A replay that captures pre- and post-reconciliation plans shows the reported rule never overwrites filtered scope on the relevant branch or cannot produce the stated wrong viewport assignment.
- **Proof**: [E04]
- **Evidence basis**: The source code rule ignores negation or exclusion in a scope keyword. The failure audit records the common task outcome without inventing missing intermediates.
- **Dependencies**: []
- **Provenance**: ai-compiled from documented experiments; independent human review pending.

## C05: Adjudication needs complete task guidance
- **Statement**: Omitting scoring qualifications from a blind review packet can change semantic judgments without changing model responses.
- **Conditions**: Supported by the documented packet correction with unchanged answers and anonymous calibration; no human inter-rater reliability or independently validated domain judgment is established.
- **Sources**: `logic/solution/audit-history.md:13` «Audit history matters for reproducibility. The original campaign added an aggregation layer after freezing to enforce model-identity and browser-evidence requirements already present in the written protocol; original and protocol grades were preserved. Separately, the September 24 narrative packet initially omitted original scoring notes. Re-review of unchanged answers with complete notes and anonymous calibration changed 15 of 24 judgments. The revised packet was carried into the September 29 study. We report final audited scores while retaining initial artifacts. These facts support a frozen written rubric, but not a claim that every analysis implementation or review packet was preregistered without amendment.» [result]
- **Status**: supported
- **Falsification criteria**: A blinded repeat on the same unchanged answers with and without the missing notes yields no judgment differences under independently verified packet processing.
- **Proof**: [E05]
- **Evidence basis**: The original and revised judgments are retained. Essential and optional propositions must remain distinct rather than making every note mandatory after observing answers.
- **Dependencies**: []
- **Provenance**: ai-compiled from documented experiments; independent human review pending.

## C06: Execution context bounds comparison
- **Statement**: Configuration outcomes measured under different execution conditions cannot by themselves isolate an intrinsic model-quality or speed effect.
- **Conditions**: Historical production observations, contemporaneous local inference, and the single API extension use distinct paths and settings; a broader matched study is unperformed.
- **Sources**: `evidence/tables/table1.md:20` «| 2026-09-29 / Frozen local app / API | GPT-6.1 Sol | 64/72 (88.9%) | 76.4–100.0 | 2.15 | 4.88 | 15/15 | 0/21 | 64/72 |» [result]
- **Status**: supported
- **Falsification criteria**: Inspection of the original campaign receipts establishes that the relevant environment, routing and resource conditions were actually held equal and only the claimed model factor varied, contrary to the documented unmatched design.
- **Proof**: [E01, E02, E03]
- **Evidence basis**: Separate campaign groups and original manifests preserve the context needed to avoid interpreting unmatched scores or latency as a controlled ranking.
- **Dependencies**: []
- **Provenance**: ai-compiled from documented experiments; independent human review pending.

## C07: Prompt granularity can dominate strict scoring
- **Statement**: An unstated output-granularity requirement can reject a numerically correct answer under a frozen rubric.
- **Conditions**: The documented county-total task expects annual rows even though the prompt does not explicitly request them; frozen grades remain unchanged and the issue is flagged for future suite revision.
- **Sources**: `logic/solution/audit-history.md:23` «MD04 asks for Baltimore County report totals for all years and all severity levels. Both paired configurations return the correct aggregate, 151,679, with appropriate filters. The frozen oracle expects separate annual rows, whereas the prompt does not explicitly require one row per year. Both fail all three strict attempts. The API extension repeats this pattern: the aggregate is correct in all three attempts, but the required annual rows are absent. We retain the scores and flag the ambiguity rather than retrospectively rewriting the oracle.» [result]
- **Status**: supported
- **Falsification criteria**: Independent reviewers consistently infer the annual-row requirement from the original prompt without access to the answer key, or recorded answers do not satisfy the claimed aggregate correctness.
- **Proof**: [E04]
- **Evidence basis**: The correct aggregate is rejected because the annual breakdown is absent. This is a question-design issue, not evidence of numerical fabrication.
- **Dependencies**: []
- **Provenance**: ai-compiled from documented experiments; independent human review pending.
