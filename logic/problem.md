# Problem specification

## Setting
CERRA embeds constrained language-model assistants in Maryland crash analytics and Baltimore high-injury-network workflows. Models choose plans or narrate source evidence; shared application code validates, queries, renders and changes browser controls. The evaluated unit is that configured system, not isolated model arithmetic or open-ended web navigation.

## Observations
### O1: Request delivery and task correctness diverge
- **Statement**: The API extension has 84 HTTP-200 responses but 64/72 primary strict successes; controls are separate.
- **Evidence**: `paper/source/main.tex`, “A separate API configuration observation”; `evidence/evaluated-records.json`.
- **Implication**: HTTP success alone cannot validate analytical assistance.
### O2: Accuracy gains can carry interaction costs
- **Statement**: The contemporaneous local pair changes strict success from 49/72 to 63/72 while request median changes from 3.77 s to 14.50 s (displayed rounding).
- **Evidence**: `evidence/figures/figure2.md` and full-precision `paper/source/aggregate-results.csv`.
- **Implication**: Deployment selection needs more than a score ordering.
### O3: Scoring depends on contract and guidance
- **Statement**: The local baseline changes from 49/72 strict to 55/72 functional sensitivity; restoring omitted narrative notes changes 15 of 24 earlier review decisions.
- **Evidence**: `evidence/tables/table1.md`; `logic/solution/audit-history.md`.
- **Implication**: Publish acceptance boundaries and adjudication corrections.

## Gaps
### G1: Text-only or completion-only evaluation misses application effects
- **Statement**: A fluent answer can use the wrong scope, omit a qualification, or change unrelated controls.
- **Caused by**: O1, O3.
- **Existing attempts**: Structured plans, independent oracles and observed browser effects are combined in the present benchmark.
- **Why they fail**: Surplus prose assertions and the full upstream extraction process are not exhaustively checked; no human domain validation is complete.
### G2: Historical measurements do not isolate model differences
- **Statement**: Deployment path, adapter, loading, precision, size and inference settings vary across campaigns.
- **Caused by**: O2.
- **Existing attempts**: A contemporaneous local pair reduces some variation.
- **Why they fail**: Size and CPU offload still differ; the API extension has no contemporaneous comparator.

## Key Insight
- **Insight**: Evaluate the whole analytical workflow against independent source expectations and actual state, then report contract correctness, visible state violations and time separately.
- **Derived from**: O1, O2, O3.
- **Enables**: A bounded, auditable configuration comparison and a concrete review of question design without claiming universal model quality.

## Assumptions
- A1: Retained source snapshots define truth for this evaluation, not current public totals or epidemiological validity.
- A2: The task suite is a convenience sample authored with implementation knowledge; no external preregistration or population sampling is claimed.
- A3: Published derivative records preserve scored outcomes but omit private source records and inference traces; aggregate replay and new inference have different prerequisites.
