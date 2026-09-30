---
title: 'Beyond Answer Accuracy: Evaluating Source-Grounded Language-Model Assistants in Interactive Transportation
  Analytics'
artifact_title: CERRA Assistant Benchmark
authors: []
author_status: Names, order, and affiliations unconfirmed
year: 2026
venue: Working draft; venue unconfirmed
doi: Not assigned
ara_version: '1.0'
domain: Computer science; interactive analytical assistants
keywords:
- language-model evaluation
- analytical assistants
- tool use
- transportation analytics
- source grounding
- reproducibility
- question-design review
claims_summary:
- Request completion does not establish workflow correctness.
- Strict contract failure and visible state violations are distinct diagnostics.
- Practical configuration quality can trade off against response time.
- Shared reconciliation bounds model-only failure attribution.
- Complete scoring guidance matters even in blinded review.
- Different execution conditions limit intrinsic model comparisons.
- Implicit output granularity can reject a correct aggregate.
abstract: This scoped public research artifact documents CERRA’s fixed-suite evaluation of configured analytical
  assistants. Five campaigns retain 924 application attempts across ten configurations and eleven configuration–campaign
  observations. It connects question design, source expectations, exact scored outcomes, aggregate reproduction,
  failure analysis and a post-hoc research trajectory. The contemporaneous local Qwen comparison exposes a
  success–latency trade-off; a separate GPT-6.1 Sol API extension remains an unmatched configuration observation.
  The public derivative explicitly redacts a selected incident-record binding and excludes source databases,
  credentials and private inference logs. Independent human domain review and a held-out task suite remain
  pending.
---

# CERRA Assistant Benchmark

A public, scoped Agent-Native Research Artifact accompanying the manuscript. This is a post-hoc compilation, not an externally preregistered experiment. The public task derivative and original archive hashes are distinct. Authors and venue remain unconfirmed.

Start with [review/README.md](review/README.md) for collaborator review or [trajectory.html](trajectory.html) for the interactive research trajectory. [logic/solution/constraints.md](logic/solution/constraints.md) states the boundaries of each claim.

## Layer Index

### Cognitive layer

| File | Role |
|---|---|
| [logic/claims.md](logic/claims.md) | 7 bounded claims |
| [logic/concepts.md](logic/concepts.md) | 9 concepts |
| [logic/experiments.md](logic/experiments.md) | 5 experiment/analysis records |
| [logic/problem.md](logic/problem.md) | problem |
| [logic/related_work.md](logic/related_work.md) | related_work |
| [logic/solution/architecture.md](logic/solution/architecture.md) | architecture |
| [logic/solution/audit-history.md](logic/solution/audit-history.md) | audit history |
| [logic/solution/constraints.md](logic/solution/constraints.md) | constraints |
| [logic/solution/method.md](logic/solution/method.md) | method |

### Implementation and reproduction

| File | Role |
|---|---|
| [src/README.md](src/README.md) | README |
| [src/artifacts.md](src/artifacts.md) | artifacts |
| [src/environment.md](src/environment.md) | environment |
| [src/reproduce.py](src/reproduce.py) | reproduce |

### Exploration graph

| File | Role |
|---|---|
| [trace/exploration_tree.yaml](trace/exploration_tree.yaml) | 11 source-grounded nodes; one rejected review route |

### Scientific evidence

| File | Role |
|---|---|
| [evidence/README.md](evidence/README.md) | Complete evidence ledger: 2 figures, 1 numbered table and 2 appendix tables |
| [evidence/campaigns.json](evidence/campaigns.json) | campaigns |
| [evidence/code-validation.json](evidence/code-validation.json) | code validation |
| [evidence/evaluated-records.json](evidence/evaluated-records.json) | evaluated records |
| [evidence/expected-aggregates.json](evidence/expected-aggregates.json) | expected aggregates |
| [evidence/export-provenance.json](evidence/export-provenance.json) | export provenance |
| [evidence/figures/figure1.md](evidence/figures/figure1.md) | figure1 |
| [evidence/figures/figure2.md](evidence/figures/figure2.md) | figure2 |
| [evidence/grader-export-parity.json](evidence/grader-export-parity.json) | grader export parity |
| [evidence/tables/appendix-a-task-inventory.md](evidence/tables/appendix-a-task-inventory.md) | appendix a task inventory |
| [evidence/tables/appendix-b-provenance.md](evidence/tables/appendix-b-provenance.md) | appendix b provenance |
| [evidence/tables/table1.md](evidence/tables/table1.md) | table1 |
