# Audit history and attribution boundaries

These are verbatim scientific paragraphs from the retained manuscript source, with LaTeX markup preserved. They are evidence excerpts, not newly inferred chronology. Original operational logs and unrelated research history are excluded.

## HTTP completion
- **Source**: `paper/source/main.tex`, paragraph beginning “Across all five campaigns, recorded HTTP outcomes”.

Across all five campaigns, recorded HTTP outcomes comprise 883 status-200 responses and 41 status-422 responses. Successful HTTP delivery does not imply strict task success. A completed request can select the wrong scope, omit a required qualification, or change state incorrectly.

## Narrative packet correction
- **Source**: `paper/source/main.tex`, paragraph beginning “Audit history matters for reproducibility.”.

Audit history matters for reproducibility. The original campaign added an aggregation layer after freezing to enforce model-identity and browser-evidence requirements already present in the written protocol; original and protocol grades were preserved. Separately, the September 24 narrative packet initially omitted original scoring notes. Re-review of unchanged answers with complete notes and anonymous calibration changed 15 of 24 judgments. The revised packet was carried into the September 29 study. We report final audited scores while retaining initial artifacts. These facts support a frozen written rubric, but not a claim that every analysis implementation or review packet was preregistered without amendment.

## Shared scope reconciliation
- **Source**: `paper/source/main.tex`, paragraph beginning “The frozen application”.

The frozen application's scope-reconciliation code contains a confirmed shared defect: for plans reaching its scope-assignment branch, a keyword check matches ``visible'' without handling negation or exclusion. It therefore assigns viewport scope even for ``outside the visible map,'' overwriting an otherwise appropriate filtered scope. This constraint is already recorded in the frozen task metadata and remains unchanged during evaluation. MD01 is consequently not a model-only failure. The shared rule is known, while the raw pre-reconciliation plans are not retained; we cannot reconstruct each model's original interpretation or isolate its additional contribution to every failed path.

## Prompt granularity
- **Source**: `paper/source/main.tex`, paragraph beginning “MD04 asks for Baltimore County”.

MD04 asks for Baltimore County report totals for all years and all severity levels. Both paired configurations return the correct aggregate, 151,679, with appropriate filters. The frozen oracle expects separate annual rows, whereas the prompt does not explicitly require one row per year. Both fail all three strict attempts. The API extension repeats this pattern: the aggregate is correct in all three attempts, but the required annual rows are absent. We retain the scores and flag the ambiguity rather than retrospectively rewriting the oracle.

## State-policy interpretation
- **Source**: `paper/source/main.tex`, paragraph beginning “MD17 asks to focus”.

MD17 asks to focus the map on ``Baltimore'' for 2020, without specifying City or County. The baseline changes the year from 2024 to 2020 in all three attempts before resolving the geographical ambiguity. Qwen3.8 preserves state and requests clarification. The year change is explicitly requested, but applying it before geographical clarification violates the frozen preserve-state policy. These are premature partial actions under that policy; the experiment does not establish user harm or show that the year itself was unrequested.

## API extension failures
- **Source**: `paper/source/main.tex`, paragraph beginning “Median request latency is 2.15”.

Median request latency is 2.15 seconds and P90 is 4.88 seconds; median primary-browser completion is 7.04 seconds. All 64 strict successes finish within the 30-second budget. These measurements describe the frozen local-application/API route in Section~\ref{sec:api-extension}, not a matched speed comparison with other campaigns. All 84 requests return HTTP 200, but eight primary attempts fail strict scoring: three on MD01, three on MD04, and two on MD09. This contrast isolates the difference between successful request delivery and successful analytical assistance. Neither the score nor the latency establishes superiority over the historical GPT configurations or local models without a contemporaneous comparison.

## Configuration boundary
- **Source**: `paper/source/main.tex`, paragraph beginning “Architecture, parameter count”.

Architecture, parameter count, memory residency, and offload differ between the two configurations. Consequently, the comparison estimates a practical configuration difference under shared conditions. It cannot isolate a release-generation effect, and its latency should not be interpreted as a controlled baseline for earlier production measurements.

## September 24 correction receipt
- **Source**: retained `review-correction.json`, recordedAt `2026-09-24T20:54:50.118177+00:00`; only scientific fields summarized here.

The initial packet omitted original `ambiguities_or_scoring_notes`. All 24 unchanged answers were re-reviewed with complete frozen notes and anonymous historical calibration; 15 decisions changed and 19 final judgments passed. Initial judgments were preserved. No inference response, task oracle, prompt, or frozen grader was replaced. This is an adjudication correction, not a new model experiment. HIN11 requires formula plus people-versus-crashes units; normalization is secondary. HIN13 requires limits of historical counts, exposure and prediction, without requiring a particular modeling recipe. HIN14 requires a substantive causal refusal; detailed evaluation design is optional.

## Public-release boundary

The selected-record fixture in MD07 is represented by an explicitly redacted public binding token. Original manifest hashes identify retained originals; the public derivative has its own hash and cannot silently replace the scored original. See `benchmark/derivative-provenance.json`. Independent human review and a new held-out suite remain proposed, not completed.
