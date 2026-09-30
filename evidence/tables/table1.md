# Table 1: All configuration–campaign observations
- **Source**: Working draft Table 1, page 7, PDF SHA-256 `cbb6d45e6e6dbf9619527b16a530af897a9d0534a6515dd872fb55eaf9460217`; `paper/source/results-table.tex` and `paper/source/aggregate-results.csv`.
- **Caption**: 11 observations from 10 CERRA assistant configurations across 5 campaigns. Strict and functional scores use 72 primary attempts per observation; controls are excluded. Intervals are 95% task-cluster bootstrap intervals. Request latency retains failed primary attempts. Runtime paths and dates differ between campaigns.
- **Screenshot**: [table1.png](table1.png)
- **Extraction type**: faithful_source_table
- **Supports**: C01, C02, C03, C06

| Campaign / path | Configuration | Strict success | 95% CI | Median (s) | P90 (s) | UI actions | UI-state violations | Functional |
|---|---|---:|---:|---:|---:|---:|---:|---:|
| 2026-09-18 / Production site | Qwen3 8B | 51/72 (70.8%) | 52.8–87.5 | 1.06 | 2.17 | 6/15 | 6/21 | 51/72 |
| 2026-09-18 / Production site | Llama 3.1 8B | 40/72 (55.6%) | 36.1–75.0 | 2.00 | 3.77 | 14/15 | 7/21 | 40/72 |
| 2026-09-18 / Production site | Gemma 3 4B | 34/72 (47.2%) | 27.8–66.7 | 2.40 | 4.18 | 12/15 | 3/21 | 48/72 |
| 2026-09-23 / Production site | GPT-4.1 mini | 57/72 (79.2%) | 62.5–93.1 | 1.20 | 2.59 | 12/15 | 3/21 | 63/72 |
| 2026-09-23 / Production site | GPT-5.4 mini | 58/72 (80.6%) | 65.3–93.1 | 1.12 | 2.76 | 14/15 | 0/21 | 62/72 |
| 2026-09-23 / Production site | GPT-5.4 | 66/72 (91.7%) | 79.2–100.0 | 1.27 | 2.94 | 12/15 | 0/21 | 66/72 |
| 2026-09-24 / Production site | Qwen3 14B | 51/72 (70.8%) | 54.2–87.5 | 2.93 | 5.56 | 12/15 | 3/21 | 57/72 |
| 2026-09-24 / Production site | Gemma 4 12B | 58/72 (80.6%) | 63.9–95.8 | 3.51 | 6.71 | 15/15 | 0/21 | 61/72 |
| 2026-09-29 / Paired local | Qwen3 14B | 49/72 (68.1%) | 50.0–84.7 | 3.77 | 7.20 | 11/15 | 3/21 | 55/72 |
| 2026-09-29 / Paired local | Qwen3.8 27B Q4_K_M | 63/72 (87.5%) | 75.0–100.0 | 14.50 | 29.81 | 15/15 | 0/21 | 63/72 |
| 2026-09-29 / Frozen local app / API | GPT-6.1 Sol | 64/72 (88.9%) | 76.4–100.0 | 2.15 | 4.88 | 15/15 | 0/21 | 64/72 |

UI actions: supported filter changes. UI-state violations: actual value changes violating the frozen task policy among 21 primary browser attempts; redundant unchanged fields are excluded. Functional equivalence was a post-hoc diagnostic in the initial campaign, inherited by later campaigns; it does not replace strict success. The September 29 paired-local baseline is the contemporaneous Qwen3 14B rerun. Campaigns that share a date remain separate experiments; the API extension is not part of this Qwen pair.

The group labels are repeated per row for a flat Markdown transcription; no observations have been removed. Displayed rounding matches the source table, while full-precision values remain in `paper/source/aggregate-results.csv`.
