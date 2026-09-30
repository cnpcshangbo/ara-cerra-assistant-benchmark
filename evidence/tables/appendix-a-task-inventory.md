# Appendix A: Task inventory (unnumbered source table)
- **Source**: Working draft Appendix A, page 11, PDF SHA-256 `cbb6d45e6e6dbf9619527b16a530af897a9d0534a6515dd872fb55eaf9460217`; `paper/source/task-inventory.tex`.
- **Caption**: No numbered caption in source. Section title: “Task Inventory”.
- **Screenshot**: [appendix-a-task-inventory.png](appendix-a-task-inventory.png)
- **Extraction type**: faithful_source_table
- **Supports**: C01, C02, C04, C07

Descriptions are compact paraphrases, not replacements for frozen prompts or initial contexts. † marks a Chinese prompt translated for readability. Controls are excluded from primary score and latency. See `benchmark/tasks.json` for the public derivative and its redaction ledger.

| ID | Family | Mode | Task and principal acceptance boundary |
|---|---|---|---|
| MD01 | Data query | API | Count the full current crash selection, including reports outside the visible map. |
| MD02 | Data query | API | Summarize statewide ambient-weather completeness across all years. |
| MD03 | Data query | API | Produce statewide county-by-county totals for 2021, without severity restriction. |
| MD04 | Data query | API | Tabulate Baltimore County totals for all years and severities; frozen oracle requires annual rows (wording ambiguity noted). |
| MD05 | Data query | API | Count 2022 statewide crash reports listing ambient rain. |
| MD06 | Data query | API | Resolve a follow-up “What about 2025?” using the frozen canonical history. |
| MD07 | Data query | API | Explain whether an unmarked weather-contributor field on a selected crash establishes clear weather. |
| MD08 | Data query | API | Describe GPS screening for visible crashes without overstating positional certainty. |
| MD09 | Data query | API | Compare original and estimated locations in the viewport and count reports entering or leaving. |
| MD10† | UI action | Browser | Filter 2021 Baltimore County serious-injury crashes. |
| MD11 | UI action | Browser | Filter 2022 Anne Arundel fatal or serious-injury crashes. |
| MD12 | UI action | Browser | Remove only the year restriction; preserve other selections. |
| MD15 | UI boundary | Browser | Handle unsupported rain/fatal filtering; explain the query/filter distinction and preserve state. |
| MD17 | UI boundary | Browser | Clarify ambiguous “Baltimore” before acting on a 2020 map request. |
| RV01 | UI action | Browser | Change only county and severity; preserve year, GPS, estimates, and map positions. |
| RV02 | UI action | Browser | Clear only GPS cross-check while preserving estimate filters and comparison positions. |
| HIN02 | HIN source | API | Return the three half-mile-minimum corridors with the largest source fatality counts. |
| HIN03 | HIN source | API | Return the first three Tier 2 intersections in source-rank order. |
| HIN05 | HIN source | API | Rank four tracts by households without vehicles, excluding unavailable values. |
| HIN06† | HIN source | API | Count all Major Concern severe-injury source records, ignoring current map filters. |
| HIN10† | HIN source | API | Resolve a follow-up switching to the two-mile-minimum corridor group, retaining top-three scope. |
| HIN12 | HIN limits | API | Qualify conflicting intersection influence distances and differences between public and application rankings. |
| HIN13 | HIN limits | API | Decline an unsupported forecast of next-month fatal-crash probability per vehicle-mile. |
| HIN14 | HIN limits | API | Decline an unsupported causal percentage reduction from a hypothetical North Avenue road diet. |
| MD16 | Control | API | Deterministic refusal: rain cannot be established as causing fatal crashes per mile from these data. |
| MD18 | Control | Browser | Previously shown example: 2023 Baltimore City fatal-crash filtering. |
| HIN01 | Control | Browser | Previously shown example: retrieve the five highest-ranked one-mile corridors. |
| HIN11 | Control | API | Previously shown example: explain HIN scoring, including people-versus-crashes units. |

## Documentation correction after this historical snapshot

The captured draft swaps the modes of two controls: MD16 is displayed as API but the frozen task and retained records are **Browser**; HIN01 is displayed as Browser but the frozen task `hin-01-ui-one-mile-rank` and retained records are **API**. The public manuscript corrects both labels. This screenshot and transcription intentionally remain faithful to the identified historical PDF, with the discrepancy exposed here. The original task modes, browser/API totals, attempts and scores do not change. Authoritative modes are in `benchmark/tasks.json` and `evidence/campaigns.json`.
