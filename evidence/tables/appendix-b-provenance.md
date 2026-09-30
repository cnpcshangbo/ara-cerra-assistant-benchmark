# Appendix B: Provenance inventory (unnumbered source table)
- **Source**: Working draft Appendix B, page 12, PDF SHA-256 `cbb6d45e6e6dbf9619527b16a530af897a9d0534a6515dd872fb55eaf9460217`; `paper/source/main.tex` and `paper/source/provenance.json`.
- **Caption**: No numbered caption in source. Section title: “Provenance and Audit Inventory”.
- **Screenshot**: [appendix-b-provenance.png](appendix-b-provenance.png)
- **Extraction type**: faithful_source_table
- **Supports**: C05, C06

| Campaign | Archive directory identifier | Trials | Manifest SHA-256 prefix | Context |
|---|---|---:|---|---|
| Sep. 18 | transportation-model-benchmark-2026-09-18 | 252 | a73f5b9e835ec776 | Production v36 |
| Sep. 23 | transportation-gpt-benchmark-2026-09-23 | 252 | 9239d992da1869f9 | Production v48 |
| Sep. 24 | local-model-benchmark-2026-09-24 | 168 | a2fb59169c45f215 | Production v51/v52 |
| Sep. 29 | qwen-newer-benchmark-2026-09-29 | 168 | a32cb875e9e9b2ac | Compiled local app |
| Sep. 29 | gpt61-sol-benchmark-2026-09-29 | 84 | b2777e4a29be6c55 | Frozen local app / API |

Date labels alone are not experiment IDs. The two September 29 campaigns retain distinct manifests and execution paths. Full original manifest hashes are retained in the public provenance; public redacted derivative hashes are separate and must not be substituted for them.
