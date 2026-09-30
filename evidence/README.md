# Evidence ledger

This is a scoped public derivative, compiled after the experiments. All scientific figure and table regions were visually inspected in the 12-page five-campaign draft. The snapshot PDF SHA-256 is `cbb6d45e6e6dbf9619527b16a530af897a9d0534a6515dd872fb55eaf9460217`. Later artifact-link edits to the public paper do not change the recorded scientific results, except for the disclosed Appendix A mode-label correction below; the screenshot hashes identify this earlier, explicitly recorded version. No screenshots of accounts or service administration are included.

| Source object | Filed transcription | Screenshot | Claims |
|---|---|---|---|
| Figure 1 (page 4) | [figures/figure1.md](figures/figure1.md) | [PNG](figures/figure1.png) | C01, C04, C06 |
| Figure 2 (page 8) | [figures/figure2.md](figures/figure2.md) | [PNG](figures/figure2.png) | C02, C03 |
| Table 1 (page 7) | [tables/table1.md](tables/table1.md) | [PNG](tables/table1.png) | C01, C02, C03, C06 |
| Appendix A, unnumbered task inventory | [tables/appendix-a-task-inventory.md](tables/appendix-a-task-inventory.md) | [PNG](tables/appendix-a-task-inventory.png) | C01, C02, C04, C07 |
| Appendix B, unnumbered provenance table | [tables/appendix-b-provenance.md](tables/appendix-b-provenance.md) | [PNG](tables/appendix-b-provenance.png) | C05, C06 |

Every numbered source object is filed: Figures 1–2 and Table 1. The two unnumbered appendix tables are additionally preserved. The first-page ARA badge is a framework mark, not a scientific figure; it remains with the paper and upstream attribution. Equations defining score and paired effect are preserved in `logic/solution/method.md`; no proof claim is made. There are no silently omitted numbered objects.

## Machine evidence and scope

| File | Purpose | Claims |
|---|---|---|
| [evaluated-records.json](evaluated-records.json) | Sanitized per-attempt outcomes, including failures; no raw responses or incident identifiers | C01, C02, C03, C04, C06, C07 |
| [expected-aggregates.json](expected-aggregates.json) | Published per-campaign aggregate targets for independent recomputation | C01, C02, C03, C06 |
| [campaigns.json](campaigns.json) | Schedules, original-manifest linkage and execution context | C03, C06 |
| [export-provenance.json](export-provenance.json) | Hashes and public-derivative boundary | C04, C05, C06, C07 |
| [../paper/source/aggregate-results.csv](../paper/source/aggregate-results.csv) | Full-precision paper table values | C01, C02, C03, C06 |
| [../paper/source/paired-summary.json](../paper/source/paired-summary.json) | Exact Qwen paired effect and bootstrap configuration | C03 |
| [../logic/solution/audit-history.md](../logic/solution/audit-history.md) | Narrative correction, criterion ambiguity and attribution limits | C04, C05, C07 |

The public package supports task-design review, grading-code inspection and aggregate recomputation. It is not the complete private raw inference archive or a turnkey reproduction of production accounts and source databases. Public source redactions and omitted upstream data are documented rather than silently replaced with synthetic historical evidence.

## Disclosed manuscript correction

The historical Appendix A screenshot/transcription swaps MD16 and HIN01 execution-mode labels. Actual modes are MD16 **Browser**, HIN01 **API**, as the original manifests and retained records establish. Both labels are corrected in the public paper. The preserved historical screenshot has an explicit correction note; no task, attempt, score or mode denominator has changed.
