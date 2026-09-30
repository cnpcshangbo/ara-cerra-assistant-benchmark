# Frozen task design and answer key

Begin with [questions first](questions-first.md), then use this answer key and [review checklist](checklist.csv). This file documents the historical task contract; it does not endorse every design choice. No model performance values are included. Exact machine-readable fields are in [tasks.json](../benchmark/tasks.json), with [the scoring contract](../benchmark/scoring-contract.json) and [source provenance](../benchmark/source-provenance.json).

The 24 primary tasks and four controls were each attempted three times per configuration. Seven primary browser tasks comprise five supported filter changes and two clarification/refusal boundaries. Two additional browser tasks are controls. The remaining 19 tasks use direct API requests with frozen context. HIN task IDs are historical identifiers and are intentionally not consecutive.

Strict pass requires successful HTTP completion, correct model attribution, required operation/scope/evidence/propositions and, for browser tasks, the observed final state. Every browser action is an exact partial patch: unspecified controls must remain unchanged. Redundant action fields can fail strict scoring even if they do not visibly change state. County patches may trigger a legitimate map refit; otherwise exact map bounds must be preserved. Actual control state, URL parameters and available ensuing map-data requests are checked, and a changed action must issue an updated data request.

API-mode questions do not provide a measured before/after browser outcome. Their preserved context describes the intended response contract. Maryland read-only questions require no returned action; HIN tasks are analytical requests rather than map commands.

**Oracle boundary:** stored Maryland aggregates and HIN source summaries are the expected reference payloads. HIN values were computed independently of application query/rendering code, but from shared application exports. This does not independently validate source collection, ETL, HIN science or location estimates. Maryland grading checks numeric filters/totals, applicable row multisets and selected caveats; HIN deterministic outputs also use template checks. Neither structural grader exhaustively reviews every possible extra prose assertion.

**Required versus optional:** the historical calibrated narrative rubric governs HIN11–HIN14. In particular, detailed model or causal-study prescriptions are not newly promoted to requirements. The original HIN11 metadata uses the words “Human semantic review”; actual retained adjudication was identity-blind **AI-assisted** review, not completed human expert review. This review invitation seeks that missing domain assessment.

| ID | Split | Execution | Main capability |
|---|---|---|---|
| [MD01](#md01) | primary | api | filtered count scope |
| [MD02](#md02) | primary | api | weather coverage |
| [MD03](#md03) | primary | api | county breakdown |
| [MD04](#md04) | primary | api | year breakdown county distinction |
| [MD05](#md05) | primary | api | weather count |
| [MD06](#md06) | primary | api | follow up missing weather |
| [MD07](#md07) | primary | api | selected current record |
| [MD08](#md08) | primary | api | gps screening |
| [MD09](#md09) | primary | api | placement comparison |
| [MD10](#md10) | primary | browser | bilingual filter action |
| [MD11](#md11) | primary | browser | compound filter action |
| [MD12](#md12) | primary | browser | partial filter clear |
| [MD15](#md15) | primary | browser | unsupported weather action |
| [MD17](#md17) | primary | browser | ambiguous geography action |
| [RV01](#rv01) | primary | browser | compound change explicit preservation |
| [RV02](#rv02) | primary | browser | single clear related controls preserved |
| [HIN02](#hin02) | primary | api | metric selection, minimum length scale, people not crashes |
| [HIN03](#hin03) | primary | api | intersection tier, source rank, dataset scope |
| [HIN05](#hin05) | primary | api | tract metric, missing values, aggregate not individual |
| [HIN06](#hin06) | primary | api | chinese, dataset scope override, source record count |
| [HIN10](#hin10) | primary | api | followup context, cross language, scale change, quantity |
| [HIN12](#hin12) | primary | api | source provenance, uncertainty, version awareness |
| [HIN13](#hin13) | primary | api | unsupported request, exposure adjustment, future risk |
| [HIN14](#hin14) | primary | api | unsupported request, countermeasure effect, causal caution |
| [MD16](#md16) | control | browser | unsupported causal risk |
| [MD18](#md18) | control | browser | seen ui action example |
| [HIN01](#hin01) | control | api | source ranking, minimum length scale, result count |
| [HIN11](#hin11) | control | api | methodology, formula explanation, units |

## MD01

**Primary · API** · Novel paraphrase within an implementation-aware suite; not an independently held-out task family

> How many reports match my current crash selection, including the ones outside the visible map?

**Purpose.** Filtered scope must ignore viewport. Direct read-only SQL independently verifies 266 crashes, 49 fatal and 264 serious linked person records. Crash count is not the sum of injury records.

**Frozen context.** See the corresponding section in [questions first](questions-first.md#md01); the complete values are also in `tasks.json`.

**Required contract**

```json
{
  "httpStatus": 200,
  "noAction": true,
  "plan": {
    "operationAllowed": [
      "summary"
    ],
    "scope": "filtered"
  },
  "evidenceFilters": {
    "year": "2022",
    "county": "Montgomery",
    "severity": "fsi"
  }
}
```

**Action boundary.** Return no map action. This is API-only; unchanged browser state was not measured for this question.

**Reference evidence to inspect**

```json
{
  "operation": "summary",
  "scope": "filtered",
  "filters": {
    "year": "2022",
    "county": "Montgomery",
    "severity": "fsi",
    "weather": "",
    "location": "",
    "estimate": ""
  },
  "placement": "estimated",
  "bounds": null,
  "totals": {
    "crashes": 266,
    "mapped": 266,
    "fsiCrashes": 266,
    "fatalPersonRecords": 49,
    "seriousPersonRecords": 264,
    "missingInjuryPersonRecords": 0,
    "ambientUnavailable": 0,
    "namedWeather": 247,
    "weatherContributing": 0
  },
  "locationTotals": {
    "flagged": 11,
    "county": 0,
    "road": 11,
    "reuse": 0
  },
  "estimateTotals": {
    "estimated": 0,
    "ambiguous": 1,
    "unresolved": 10
  },
  "stateTotals": {
    "originalEligible": 266,
    "effectiveEligible": 266,
    "originalRejected": 0,
    "boundaryReview": 0,
    "locationUnresolved": 0
  }
}
```

**Review focus.** The frozen application has a confirmed scope-reconciliation defect: its visible-keyword branch does not handle “outside the visible map.” It can overwrite a correct filtered plan. Review this as a system task; raw pre-reconciliation plans were not retained, so individual model interpretation cannot be reconstructed. A proposed future diagnostic must be a new task/version.

**Reviewer decision:** Keep / revise / remove / split / uncertain. Proposed versioned change: ______. Priority: ______.

## MD02

**Primary · API** · Novel paraphrase within an implementation-aware suite; not an independently held-out task family

> Across Maryland and all years, how complete is the recorded ambient weather information?

**Purpose.** Explicit statewide scope clears the deliberately restrictive UI context. Named-weather count is 484339 of 821657; unavailable ambient weather is 281816, not zero weather-related crashes.

**Frozen context.** See the corresponding section in [questions first](questions-first.md#md02); the complete values are also in `tasks.json`.

**Required contract**

```json
{
  "httpStatus": 200,
  "noAction": true,
  "plan": {
    "operationAllowed": [
      "weather",
      "breakdown"
    ],
    "scope": "all"
  },
  "evidenceFilters": {
    "year": "",
    "county": "",
    "severity": ""
  },
  "ifBreakdownGroup": "weather",
  "answerMustConvey": [
    "2024+ export lacks ambient weather",
    "Contributor flag is not actual rain/snow/clear conditions",
    "Missing contributor does not mean clear"
  ]
}
```

**Action boundary.** Return no map action. This is API-only; unchanged browser state was not measured for this question.

**Reference evidence to inspect**

```json
{
  "operation": "weather",
  "scope": "all",
  "filters": {
    "year": "",
    "county": "",
    "severity": "",
    "weather": "",
    "location": "",
    "estimate": ""
  },
  "placement": "estimated",
  "bounds": null,
  "totals": {
    "crashes": 821657,
    "mapped": 821548,
    "fsiCrashes": 24128,
    "fatalPersonRecords": 4330,
    "seriousPersonRecords": 23915,
    "missingInjuryPersonRecords": 44614,
    "ambientUnavailable": 281816,
    "namedWeather": 484339,
    "weatherContributing": 11350
  },
  "group": "weather",
  "locationTotals": {
    "flagged": 52952,
    "county": 5436,
    "road": 50537,
    "reuse": 5316
  },
  "estimateTotals": {
    "estimated": 4297,
    "ambiguous": 2669,
    "unresolved": 45986
  },
  "stateTotals": {
    "originalEligible": 819761,
    "effectiveEligible": 819923,
    "originalRejected": 1896,
    "boundaryReview": 2057,
    "locationUnresolved": 1734
  }
}
```

The complete 15-row reference multiset is retained in `tasks.json` under this task’s `oracle.evidence.rows`; row labels, crash totals and FSI crash totals are graded.

**Reviewer decision:** Keep / revise / remove / split / uncertain. Proposed versioned change: ______. Priority: ______.

## MD03

**Primary · API** · Novel paraphrase within an implementation-aware suite; not an independently held-out task family

> Give me a county-by-county total for 2021 statewide, regardless of severity.

**Purpose.** Must group all 24 Maryland counties/county equivalents, not retain Montgomery or FSI. Baltimore City and Baltimore County must remain separate.

**Frozen context.** See the corresponding section in [questions first](questions-first.md#md03); the complete values are also in `tasks.json`.

**Required contract**

```json
{
  "httpStatus": 200,
  "noAction": true,
  "plan": {
    "operationAllowed": [
      "breakdown"
    ],
    "scope": "all"
  },
  "evidenceFilters": {
    "year": "2021",
    "county": "",
    "severity": ""
  },
  "group": "county",
  "rowsMustMatchOracle": true
}
```

**Action boundary.** Return no map action. This is API-only; unchanged browser state was not measured for this question.

**Reference evidence to inspect**

```json
{
  "operation": "breakdown",
  "scope": "all",
  "filters": {
    "year": "2021",
    "county": "",
    "severity": "",
    "weather": "",
    "location": "",
    "estimate": ""
  },
  "placement": "estimated",
  "bounds": null,
  "totals": {
    "crashes": 108968,
    "mapped": 108957,
    "fsiCrashes": 3102,
    "fatalPersonRecords": 580,
    "seriousPersonRecords": 3057,
    "missingInjuryPersonRecords": 0,
    "ambientUnavailable": 0,
    "namedWeather": 97748,
    "weatherContributing": 0
  },
  "group": "county",
  "locationTotals": {
    "flagged": 8772,
    "county": 466,
    "road": 8346,
    "reuse": 853
  },
  "estimateTotals": {
    "estimated": 734,
    "ambiguous": 446,
    "unresolved": 7592
  },
  "stateTotals": {
    "originalEligible": 108896,
    "effectiveEligible": 108905,
    "originalRejected": 72,
    "boundaryReview": 289,
    "locationUnresolved": 63
  }
}
```

The complete 24-row reference multiset is retained in `tasks.json` under this task’s `oracle.evidence.rows`; row labels, crash totals and FSI crash totals are graded.

**Reviewer decision:** Keep / revise / remove / split / uncertain. Proposed versioned change: ______. Priority: ______.

## MD04

**Primary · API** · Novel paraphrase within an implementation-aware suite; not an independently held-out task family

> For Baltimore County, tabulate report totals for all years and all severity levels.

**Purpose.** An explicitly named county overrides the UI county, all years clears 2022, and all severity clears FSI. 2026 is partial through September 16.

**Frozen context.** See the corresponding section in [questions first](questions-first.md#md04); the complete values are also in `tasks.json`.

**Required contract**

```json
{
  "httpStatus": 200,
  "noAction": true,
  "plan": {
    "operationAllowed": [
      "breakdown"
    ],
    "scope": "filtered"
  },
  "evidenceFilters": {
    "year": "",
    "county": "Baltimore County",
    "severity": ""
  },
  "group": "year",
  "rowsMustMatchOracle": true
}
```

**Action boundary.** Return no map action. This is API-only; unchanged browser state was not measured for this question.

**Reference evidence to inspect**

```json
{
  "operation": "breakdown",
  "scope": "filtered",
  "filters": {
    "year": "",
    "county": "Baltimore County",
    "severity": "",
    "weather": "",
    "location": "",
    "estimate": ""
  },
  "placement": "estimated",
  "bounds": null,
  "totals": {
    "crashes": 151679,
    "mapped": 151678,
    "fsiCrashes": 3541,
    "fatalPersonRecords": 549,
    "seriousPersonRecords": 3615,
    "missingInjuryPersonRecords": 13455,
    "ambientUnavailable": 50804,
    "namedWeather": 87891,
    "weatherContributing": 1753
  },
  "group": "year",
  "locationTotals": {
    "flagged": 12801,
    "county": 905,
    "road": 12544,
    "reuse": 494
  },
  "estimateTotals": {
    "estimated": 969,
    "ambiguous": 468,
    "unresolved": 11364
  },
  "stateTotals": {
    "originalEligible": 151258,
    "effectiveEligible": 151289,
    "originalRejected": 421,
    "boundaryReview": 10,
    "locationUnresolved": 390
  }
}
```

The complete 8-row reference multiset is retained in `tasks.json` under this task’s `oracle.evidence.rows`; row labels, crash totals and FSI crash totals are graded.

**Review focus.** Priority ambiguity: “tabulate report totals for all years” does not explicitly demand one row per year, but the frozen key requires a year breakdown. The correct all-years total alone is insufficient under the historical strict rubric. Review whether a revised prompt should say “one row per year”; do not silently rescore the historical data.

**Reviewer decision:** Keep / revise / remove / split / uncertain. Proposed versioned change: ______. Priority: ______.

## MD05

**Primary · API** · Novel paraphrase within an implementation-aware suite; not an independently held-out task family

> How many 2022 crash reports across Maryland list rain as the ambient weather?

**Purpose.** Rain is an observed ambient condition from legacy weather data, never a cause or wet-surface proxy.

**Frozen context.** See the corresponding section in [questions first](questions-first.md#md05); the complete values are also in `tasks.json`.

**Required contract**

```json
{
  "httpStatus": 200,
  "noAction": true,
  "plan": {
    "operationAllowed": [
      "summary",
      "weather"
    ],
    "scope": "all"
  },
  "evidenceFilters": {
    "year": "2022",
    "county": "",
    "severity": "",
    "weather": "Raining"
  }
}
```

**Action boundary.** Return no map action. This is API-only; unchanged browser state was not measured for this question.

**Reference evidence to inspect**

```json
{
  "operation": "summary",
  "scope": "all",
  "filters": {
    "year": "2022",
    "county": "",
    "severity": "",
    "weather": "Raining",
    "location": "",
    "estimate": ""
  },
  "placement": "estimated",
  "bounds": null,
  "totals": {
    "crashes": 14220,
    "mapped": 14214,
    "fsiCrashes": 291,
    "fatalPersonRecords": 50,
    "seriousPersonRecords": 275,
    "missingInjuryPersonRecords": 0,
    "ambientUnavailable": 0,
    "namedWeather": 14220,
    "weatherContributing": 0
  },
  "locationTotals": {
    "flagged": 1597,
    "county": 97,
    "road": 1543,
    "reuse": 141
  },
  "estimateTotals": {
    "estimated": 134,
    "ambiguous": 89,
    "unresolved": 1374
  },
  "stateTotals": {
    "originalEligible": 14183,
    "effectiveEligible": 14187,
    "originalRejected": 37,
    "boundaryReview": 29,
    "locationUnresolved": 33
  }
}
```

**Review focus.** Strict contract allows summary or weather, not breakdown. Correct rain-filtered values through breakdown can receive the narrowly defined functional-equivalence diagnostic if operation labels are the only failures. Ask whether this implementation contract matches the scientific construct.

**Reviewer decision:** Keep / revise / remove / split / uncertain. Proposed versioned change: ______. Priority: ______.

## MD06

**Primary · API** · Novel paraphrase within an implementation-aware suite; not an independently held-out task family

> What about 2025?

**Purpose.** Use the persisted previousQuery rather than inventing counts or discarding weather. Database zero label matches is coverage absence, not measured absence of rainy crashes.

**Frozen context.** See the corresponding section in [questions first](questions-first.md#md06); the complete values are also in `tasks.json`.

**Conversation.** Use the fixed history shown with this question. Do not substitute another attempt’s answer.

**Required contract**

```json
{
  "httpStatus": 200,
  "noAction": true,
  "plan": {
    "operationAllowed": [
      "summary",
      "weather"
    ],
    "scope": "all"
  },
  "evidenceFilters": {
    "year": "2025",
    "county": "",
    "severity": "",
    "weather": "Raining"
  },
  "answerMustConvey": [
    "Cannot determine rainy-crash count because this year lacks ambient weather"
  ],
  "answerMustNotClaim": [
    "There were zero rainy crashes"
  ]
}
```

**Action boundary.** Return no map action. This is API-only; unchanged browser state was not measured for this question.

**Reference evidence to inspect**

```json
{
  "operation": "summary",
  "scope": "all",
  "filters": {
    "year": "2025",
    "county": "",
    "severity": "",
    "weather": "Raining",
    "location": "",
    "estimate": ""
  },
  "placement": "estimated",
  "bounds": null,
  "totals": {
    "crashes": 0,
    "mapped": 0,
    "fsiCrashes": 0,
    "fatalPersonRecords": 0,
    "seriousPersonRecords": 0,
    "missingInjuryPersonRecords": 0,
    "ambientUnavailable": 0,
    "namedWeather": 0,
    "weatherContributing": 0
  },
  "locationTotals": {
    "flagged": 0,
    "county": 0,
    "road": 0,
    "reuse": 0
  },
  "estimateTotals": {
    "estimated": 0,
    "ambiguous": 0,
    "unresolved": 0
  },
  "stateTotals": {
    "originalEligible": 0,
    "effectiveEligible": 0,
    "originalRejected": 0,
    "boundaryReview": 0,
    "locationUnresolved": 0
  }
}
```

**Review focus.** The canonical history and previousQuery are fixed inputs, not prior trial outputs. A zero matching-row result for unavailable weather fields must not be asserted as zero rainy crashes. The MD05 operation-only sensitivity also applies here.

**Reviewer decision:** Keep / revise / remove / split / uncertain. Proposed versioned change: ______. Priority: ______.

## MD07

**Primary · API** · Novel paraphrase within an implementation-aware suite; not an independently held-out task family

> For the selected crash, does an unmarked Weather Conditions contributor establish clear weather?

**Purpose.** The selected record is refetched independently of the current Montgomery/FSI filters. Ambient weather is unavailable and contributing=0. Record-level identifying details and other per-record fields are withheld in this public derivative.

**Frozen context.** See the corresponding section in [questions first](questions-first.md#md07); the complete values are also in `tasks.json`.

**Required contract**

```json
{
  "httpStatus": 200,
  "noAction": true,
  "plan": {
    "operationAllowed": [
      "selected"
    ],
    "scope": "selected"
  },
  "evidenceFilters": {},
  "selectedId": "selected-weather-unavailable-01",
  "selectedWeather": {
    "status": "unavailable",
    "contributing": 0
  },
  "answerMustConvey": [
    "Actual weather unavailable in 2024+ export",
    "An absent contributor flag does not establish clear weather"
  ],
  "noOriginalReportOrPersonRows": true
}
```

**Action boundary.** Return no map action. This is API-only; unchanged browser state was not measured for this question.

**Reference evidence to inspect**

```json
{
  "operation": "selected",
  "scope": "selected",
  "filters": {
    "year": "",
    "county": "",
    "severity": "",
    "weather": "",
    "location": "",
    "estimate": ""
  },
  "placement": "estimated",
  "bounds": null
}
```

Only `weather.status = unavailable` and `weather.contributing = 0` from the selected record are public, together with its token. The original also checks selected-ID equality and numeric per-record reference fields; those fields require private binding. The source is the 2024+ contributor export, which does not provide actual ambient rain/snow/clear conditions. Absence of a weather contributor does not establish clear weather.

**Review focus.** Privacy reduction: the selected record uses a public binding token; its local numeric ID, date, precise coordinates and other record-level payload are omitted. Weather status and contributor checks remain visible. Exact live replay needs an authorized private binding; no replacement synthetic record is represented as the historical source.

**Reviewer decision:** Keep / revise / remove / split / uncertain. Proposed versioned change: ______. Priority: ______.

## MD08

**Primary · API** · Novel paraphrase within an implementation-aware suite; not an independently held-out task family

> What does the GPS screening show for crashes visible in this view?

**Purpose.** Visible scope uses exact viewport and current position mode. Do not restrict to only flagged reports unless requested, or claim GPS flags prove error.

**Frozen context.** See the corresponding section in [questions first](questions-first.md#md08); the complete values are also in `tasks.json`.

**Required contract**

```json
{
  "httpStatus": 200,
  "noAction": true,
  "plan": {
    "operationAllowed": [
      "location"
    ],
    "scope": "viewport"
  },
  "evidenceFilters": {
    "year": "",
    "county": "",
    "severity": "",
    "location": ""
  },
  "boundsExact": [
    -76.7,
    39.2,
    -76.5,
    39.4
  ],
  "answerMustConvey": [
    "Checks screen consistency; they do not certify location accuracy",
    "Categories overlap"
  ]
}
```

**Action boundary.** Return no map action. This is API-only; unchanged browser state was not measured for this question.

**Reference evidence to inspect**

```json
{
  "operation": "location",
  "scope": "viewport",
  "filters": {
    "year": "",
    "county": "",
    "severity": "",
    "weather": "",
    "location": "",
    "estimate": ""
  },
  "placement": "estimated",
  "bounds": [
    -76.7,
    39.2,
    -76.5,
    39.4
  ],
  "totals": {
    "crashes": 169150,
    "mapped": 169148,
    "fsiCrashes": 4816,
    "fatalPersonRecords": 546,
    "seriousPersonRecords": 4979,
    "missingInjuryPersonRecords": 13738,
    "ambientUnavailable": 54951,
    "namedWeather": 96201,
    "weatherContributing": 1568
  },
  "group": "location checks",
  "locationTotals": {
    "flagged": 11313,
    "county": 1583,
    "road": 10126,
    "reuse": 1736
  },
  "estimateTotals": {
    "estimated": 879,
    "ambiguous": 476,
    "unresolved": 9958
  },
  "comparison": {
    "original": 169174,
    "estimated": 169150,
    "both": 169004,
    "movedIn": 146,
    "movedOut": 170,
    "relocated": 1049,
    "unresolved": 10434,
    "originalFsi": 4816,
    "estimatedFsi": 4816
  },
  "stateTotals": {
    "originalEligible": 169125,
    "effectiveEligible": 169150,
    "originalRejected": 25,
    "boundaryReview": 0,
    "locationUnresolved": 0
  }
}
```

The complete 3-row reference multiset is retained in `tasks.json` under this task’s `oracle.evidence.rows`; row labels, crash totals and FSI crash totals are graded.

**Reviewer decision:** Keep / revise / remove / split / uncertain. Proposed versioned change: ______. Priority: ______.

## MD09

**Primary · API** · Novel paraphrase within an implementation-aware suite; not an independently held-out task family

> For the visible map area, compare original and estimated locations and count reports entering or leaving.

**Purpose.** This is a question, not a map-filter command. Union of eligible endpoints must be counted once; do not set estimate=estimated or count two endpoints as two crashes.

**Frozen context.** See the corresponding section in [questions first](questions-first.md#md09); the complete values are also in `tasks.json`.

**Required contract**

```json
{
  "httpStatus": 200,
  "noAction": true,
  "plan": {
    "operationAllowed": [
      "estimates"
    ],
    "scope": "viewport"
  },
  "evidenceFilters": {
    "estimate": ""
  },
  "placement": "compare",
  "boundsExact": [
    -76.7,
    39.2,
    -76.5,
    39.4
  ],
  "answerMustConvey": [
    "Compare counts unique reports once",
    "Estimates are not independently verified corrections",
    "No validated or recalculated HIN"
  ]
}
```

**Action boundary.** Return no map action. This is API-only; unchanged browser state was not measured for this question.

**Reference evidence to inspect**

```json
{
  "operation": "estimates",
  "scope": "viewport",
  "filters": {
    "year": "",
    "county": "",
    "severity": "",
    "weather": "",
    "location": "",
    "estimate": ""
  },
  "placement": "compare",
  "bounds": [
    -76.7,
    39.2,
    -76.5,
    39.4
  ],
  "totals": {
    "crashes": 169320,
    "mapped": 169318,
    "fsiCrashes": 4824,
    "fatalPersonRecords": 546,
    "seriousPersonRecords": 4988,
    "missingInjuryPersonRecords": 13738,
    "ambientUnavailable": 54951,
    "namedWeather": 96352,
    "weatherContributing": 1568
  },
  "group": "location estimates",
  "locationTotals": {
    "flagged": 11483,
    "county": 1648,
    "road": 10295,
    "reuse": 1788
  },
  "estimateTotals": {
    "estimated": 1049,
    "ambiguous": 476,
    "unresolved": 9958
  },
  "comparison": {
    "original": 169174,
    "estimated": 169150,
    "both": 169004,
    "movedIn": 146,
    "movedOut": 170,
    "relocated": 1049,
    "unresolved": 10434,
    "originalFsi": 4816,
    "estimatedFsi": 4816
  },
  "stateTotals": {
    "originalEligible": 169295,
    "effectiveEligible": 169320,
    "originalRejected": 25,
    "boundaryReview": 0,
    "locationUnresolved": 0
  }
}
```

The complete 14-row reference multiset is retained in `tasks.json` under this task’s `oracle.evidence.rows`; row labels, crash totals and FSI crash totals are graded.

**Reviewer decision:** Keep / revise / remove / split / uncertain. Proposed versioned change: ______. Priority: ______.

## MD10

**Primary · BROWSER** · Novel paraphrase within an implementation-aware suite; not an independently held-out task family

> 请筛选 2021 年 Baltimore County 的重伤事故。

**English translation for review only:** Please filter to serious-injury crashes in Baltimore County in 2021.

**Purpose.** Mandarin action with the exact UI county name. Preserve location=review, estimate=ambiguous and original placement; serious differs from fatal-or-serious.

**Frozen context.** See the corresponding section in [questions first](questions-first.md#md10); the complete values are also in `tasks.json`.

**Required contract**

```json
{
  "httpStatus": 200,
  "actionExact": {
    "type": "set_filters",
    "filters": {
      "year": "2021",
      "county": "Baltimore County",
      "severity": "serious"
    }
  },
  "evidence": null,
  "preserveUnspecifiedControls": true,
  "browserStateMustMatchAction": true
}
```

**Controls that must retain their initial values**

```json
{
  "location": "review",
  "estimate": "ambiguous",
  "placement": "original"
}
```

**Map bounds:** A county patch may refit bounds; no exact equality is imposed by the wrapper for this task.

**Reviewer decision:** Keep / revise / remove / split / uncertain. Proposed versioned change: ______. Priority: ______.

## MD11

**Primary · BROWSER** · Novel paraphrase within an implementation-aware suite; not an independently held-out task family

> Please limit the map to fatal or serious injury crashes in Anne Arundel during 2022.

**Purpose.** Fatal OR serious is the fsi union. No reset and no clearing of GPS or estimate filters.

**Frozen context.** See the corresponding section in [questions first](questions-first.md#md11); the complete values are also in `tasks.json`.

**Required contract**

```json
{
  "httpStatus": 200,
  "actionExact": {
    "type": "set_filters",
    "filters": {
      "year": "2022",
      "county": "Anne Arundel",
      "severity": "fsi"
    }
  },
  "evidence": null,
  "preserveUnspecifiedControls": true,
  "browserStateMustMatchAction": true
}
```

**Controls that must retain their initial values**

```json
{
  "location": "review",
  "estimate": "ambiguous",
  "placement": "original"
}
```

**Map bounds:** A county patch may refit bounds; no exact equality is imposed by the wrapper for this task.

**Reviewer decision:** Keep / revise / remove / split / uncertain. Proposed versioned change: ______. Priority: ______.

## MD12

**Primary · BROWSER** · Novel paraphrase within an implementation-aware suite; not an independently held-out task family

> Remove the year restriction while preserving my other selections.

**Purpose.** Single-control clear, not reset. Essential regression when a model emits otherwise valid but unrequested fields.

**Frozen context.** See the corresponding section in [questions first](questions-first.md#md12); the complete values are also in `tasks.json`.

**Required contract**

```json
{
  "httpStatus": 200,
  "actionExact": {
    "type": "set_filters",
    "filters": {
      "year": ""
    }
  },
  "evidence": null,
  "preserveUnspecifiedControls": true,
  "browserStateMustMatchAction": true
}
```

**Controls that must retain their initial values**

```json
{
  "county": "Baltimore City",
  "severity": "property",
  "location": "review",
  "estimate": "ambiguous",
  "placement": "original"
}
```

**Map bounds:** Preserve the exact before-state bounds.

**Reviewer decision:** Keep / revise / remove / split / uncertain. Proposed versioned change: ______. Priority: ______.

## MD15

**Primary · BROWSER** · Novel paraphrase within an implementation-aware suite; not an independently held-out task family

> Filter to 2022 fatal crashes during rain.

**Purpose.** The entire compound action must be refused: no partial year/severity application. This path does invoke a model unlike the causal preflight control.

**Frozen context.** See the corresponding section in [questions first](questions-first.md#md15); the complete values are also in `tasks.json`.

**Required contract**

```json
{
  "httpStatus": 200,
  "action": null,
  "evidence": null,
  "controlsUnchanged": true,
  "answerMustConvey": [
    "Weather is queryable but is not a map filter",
    "No filters changed"
  ]
}
```

**Controls that must retain their initial values**

```json
{
  "year": "2024",
  "county": "Baltimore City",
  "severity": "property",
  "location": "review",
  "estimate": "ambiguous",
  "placement": "original"
}
```

**Map bounds:** Preserve the exact before-state bounds.

**Review focus.** Frozen policy refuses the entire compound action because weather is queryable but is not an available map filter. Partial year/severity updates fail. Functional sensitivity relaxes only one explanation check when the entire action is refused and every other strict check passes.

**Reviewer decision:** Keep / revise / remove / split / uncertain. Proposed versioned change: ______. Priority: ______.

## MD17

**Primary · BROWSER** · Novel paraphrase within an implementation-aware suite; not an independently held-out task family

> Focus the map on Baltimore for 2020.

**Purpose.** Ambiguous geography must cause whole-action clarification, without silently choosing City/County or partially applying 2020.

**Frozen context.** See the corresponding section in [questions first](questions-first.md#md17); the complete values are also in `tasks.json`.

**Required contract**

```json
{
  "httpStatus": 200,
  "action": null,
  "evidence": null,
  "controlsUnchanged": true,
  "answerMustConvey": [
    "Specify Baltimore City or Baltimore County"
  ]
}
```

**Controls that must retain their initial values**

```json
{
  "year": "2024",
  "county": "Baltimore City",
  "severity": "property",
  "location": "review",
  "estimate": "ambiguous",
  "placement": "original"
}
```

**Map bounds:** Preserve the exact before-state bounds.

**Review focus.** The year 2020 is explicitly requested. Changing it before resolving Baltimore City versus County violates the frozen clarify-first/preserve-state policy; this must not be described as an unrequested year or as demonstrated user harm. Ask whether the policy should be explicit to the user and whether another interaction policy merits a separate task.

**Reviewer decision:** Keep / revise / remove / split / uncertain. Proposed versioned change: ______. Priority: ______.

## RV01

**Primary · BROWSER** · Novel paraphrase within an implementation-aware suite; not an independently held-out task family

> Change the study area to Prince George's and show serious-injury crashes; leave year, GPS cross-check, location estimates and map positions as they are.

**Purpose.** Change exactly county and serious-injury selection; mentioning preserved controls is not permission to include them in the action patch.

**Frozen context.** See the corresponding section in [questions first](questions-first.md#rv01); the complete values are also in `tasks.json`.

**Required contract**

```json
{
  "httpStatus": 200,
  "actionExact": {
    "type": "set_filters",
    "filters": {
      "county": "Prince George's",
      "severity": "serious"
    }
  },
  "evidence": null,
  "preserveUnspecifiedControls": true,
  "browserStateMustMatchAction": true
}
```

**Controls that must retain their initial values**

```json
{
  "year": "2025",
  "location": "review",
  "estimate": "ambiguous",
  "placement": "compare"
}
```

**Map bounds:** A county patch may refit bounds; no exact equality is imposed by the wrapper for this task.

**Review focus.** The user names controls to preserve. Under exact-patch scoring, including redundant fields can fail even if they do not visibly change. County changes may legitimately refit map bounds; the global exact-bounds check is not applied to a county patch.

**Reviewer decision:** Keep / revise / remove / split / uncertain. Proposed versioned change: ______. Priority: ______.

## RV02

**Primary · BROWSER** · Novel paraphrase within an implementation-aware suite; not an independently held-out task family

> Clear only the GPS cross-check; keep the unresolved location-estimate filter and comparison map positions.

**Purpose.** Clear the GPS consistency-screening selection only; preserve the distinct estimate-status and placement controls, and all other filters.

**Frozen context.** See the corresponding section in [questions first](questions-first.md#rv02); the complete values are also in `tasks.json`.

**Required contract**

```json
{
  "httpStatus": 200,
  "actionExact": {
    "type": "set_filters",
    "filters": {
      "location": ""
    }
  },
  "evidence": null,
  "preserveUnspecifiedControls": true,
  "browserStateMustMatchAction": true
}
```

**Controls that must retain their initial values**

```json
{
  "year": "2021",
  "county": "Howard",
  "severity": "fsi",
  "estimate": "unresolved",
  "placement": "compare"
}
```

**Map bounds:** Preserve the exact before-state bounds.

**Review focus.** Exact-patch scoring rejects redundant preserved estimate/placement fields. The functional diagnostic may accept exactly those redundant fields if all actual controls, URL, bounds and data-query checks pass.

**Reviewer decision:** Keep / revise / remove / split / uncertain. Proposed versioned change: ______. Priority: ______.

## HIN02

**Primary · API** · Novel paraphrase within an implementation-aware suite; not an independently held-out task family

> Using the full dataset, list the three corridors in the half-mile minimum-length set with the largest fatality counts.

**Purpose.** Distinguish ranking by fatalities (people) from the stored source rank, and apply the half-mile minimum-length set across the dataset.

**Frozen context.** See the corresponding section in [questions first](questions-first.md#hin02); the complete values are also in `tasks.json`.

**Required plan constraints**

```json
{
  "operation": "rank",
  "scope": "dataset",
  "layer": "ranked",
  "scale": "half",
  "metric": "fatal",
  "limit": 3
}
```

**Reference evidence**

```json
{
  "ordered_row_ids": [
    "rank-half-3",
    "rank-half-12",
    "rank-half-18"
  ],
  "source_files": [
    "top_30_corrdors_half_mile.geojson"
  ],
  "metric": "fatal",
  "ordered_metric_values": [
    17,
    15,
    9
  ],
  "candidate_source_records": 30
}
```

All 3 reference source-feature summaries are retained in `tasks.json`, including expected names and displayed metrics. The grader checks the full expected row-ID order, metric labels/values, source labels and displayed answer values.

**Oracle derivation.** Read half set, independently sort descending fatal field; tie-break id lexicographically; take 3.

**Action boundary.** API-only analytical task; no browser mutation outcome is measured. Dataset scope overrides view filters without changing those controls.

**Original scoring notes**

- Fatal counts are people, not fatal crashes. Stored source ranks of 3,12,18 must not be substituted for ranking by fatality count. No ties at result boundary.

**Reviewer decision:** Keep / revise / remove / split / uncertain. Proposed versioned change: ______. Priority: ______.

## HIN03

**Primary · API** · Novel paraphrase within an implementation-aware suite; not an independently held-out task family

> For the entire dataset, show the first three Tier 2 intersections by source rank.

**Purpose.** Override a conflicting visible Tier 1 selection with the requested dataset-wide Tier 2 source ranking.

**Frozen context.** See the corresponding section in [questions first](questions-first.md#hin03); the complete values are also in `tasks.json`.

**Required plan constraints**

```json
{
  "operation": "rank",
  "scope": "dataset",
  "layer": "intersections",
  "intersectionTier": "Tier 2",
  "metric_one_of": [
    "rank",
    null
  ],
  "limit": 3
}
```

**Reference evidence**

```json
{
  "ordered_row_ids": [
    "intersection-101",
    "intersection-102",
    "intersection-103"
  ],
  "source_files": [
    "SS4AData.geodatabase · Top300Intersections"
  ],
  "metric": "rank",
  "ordered_metric_values": [
    101,
    102,
    103
  ],
  "candidate_source_records": 100
}
```

All 3 reference source-feature summaries are retained in `tasks.json`, including expected names and displayed metrics. The grader checks the full expected row-ID order, metric labels/values, source labels and displayed answer values.

**Oracle derivation.** Filter raw intersection tier == Tier 2, then stored rank ascending.

**Action boundary.** API-only analytical task; no browser mutation outcome is measured. Dataset scope overrides view filters without changing those controls.

**Original scoring notes**

- All 3 scores equal 13. Correct source-rank order is 101,102,103; do not invent cross-street names. Current Tier 1 map filter is irrelevant.

**Reviewer decision:** Keep / revise / remove / split / uncertain. Proposed versioned change: ______. Priority: ______.

## HIN05

**Primary · API** · Novel paraphrase of a displayed example

> From all census tracts, give the top four by the percentage of households without a vehicle. Exclude unavailable values.

**Purpose.** Rank a tract-level household percentage, explicitly exclude missing values, and avoid interpreting an aggregate as an individual attribute.

**Frozen context.** See the corresponding section in [questions first](questions-first.md#hin05); the complete values are also in `tasks.json`.

**Required plan constraints**

```json
{
  "operation": "rank",
  "scope": "dataset",
  "layer": "tracts",
  "metric": "zeroVehicleHouseholdsPct",
  "limit": 4
}
```

**Reference evidence**

```json
{
  "ordered_row_ids": [
    "tract-24510100200",
    "tract-24510280500",
    "tract-24510160300",
    "tract-24510170200"
  ],
  "source_files": [
    "SS4AData.geodatabase · CensusTractLevelData + U.S. Census TIGER/Line 2020 geometry"
  ],
  "metric": "zeroVehicleHouseholdsPct",
  "ordered_metric_values": [
    85.07,
    78.32,
    76.01,
    73.15
  ],
  "candidate_source_records": 199,
  "available_metric_records": 198,
  "excluded_null_ids": [
    "tract-24510100300"
  ]
}
```

All 4 reference source-feature summaries are retained in `tasks.json`, including expected names and displayed metrics. The grader checks the full expected row-ID order, metric labels/values, source labels and displayed answer values.

**Oracle derivation.** Exclude literal null zeroVehicleHouseholdsPct; descending numeric sort over remaining 198 of 199 rows.

**Action boundary.** API-only analytical task; no browser mutation outcome is measured. Dataset scope overrides view filters without changing those controls.

**Original scoring notes**

- Novel paraphrase of a displayed UI example. Household percentage must not become population percentage, and null must not be treated as zero.

**Review focus.** This is a novel wording of a displayed UI example, not an unseen task family. Ask whether the public example leaks the intended operation despite new wording.

**Reviewer decision:** Keep / revise / remove / split / uncertain. Proposed versioned change: ______. Priority: ______.

## HIN06

**Primary · API** · Novel paraphrase within an implementation-aware suite; not an independently held-out task family

> 忽略当前地图筛选，整个数据集中有多少 Major Concern 的严重伤亡源记录？

**English translation for review only:** Ignoring the current map filters, how many Major Concern fatal-and-serious-injury source records are there in the entire dataset?

**Purpose.** Interpret a Chinese dataset-wide count while preserving source-record units and overriding conflicting map filters.

**Frozen context.** See the corresponding section in [questions first](questions-first.md#hin06); the complete values are also in `tasks.json`.

**Required plan constraints**

```json
{
  "operation": "count",
  "scope": "dataset",
  "layer": "fsi",
  "tier": "Major Concern"
}
```

**Reference evidence**

```json
{
  "expected_record_count": 309,
  "expected_tier_distribution": {
    "Major Concern": 309
  },
  "expected_row_ids": [],
  "source_files": [
    "segment_of_concern_fatality_severe_injury.geojson"
  ],
  "answer_semantic_requirements": [
    "Chinese explanation",
    "309 source records, not 309 people/crashes or unique road segments",
    "Dataset scope independent of current map filters"
  ]
}
```

**Oracle derivation.** Count raw FSI rows whose stored tier exactly equals Major Concern: 309. Do not sum fatalAndSerious. Do not restrict street to NORTH (which would give 33).

**Action boundary.** API-only analytical task; no browser mutation outcome is measured. Dataset scope overrides view filters without changing those controls.

**Review focus.** Only three primary prompts are Chinese; this suite does not support a language-specific comparative conclusion. Source records need not be unique road segments, crashes or people.

**Reviewer decision:** Keep / revise / remove / split / uncertain. Proposed versioned change: ______. Priority: ______.

## HIN10

**Primary · API** · Novel paraphrase within an implementation-aware suite; not an independently held-out task family

> 那换成两英里的最低长度组，仍然给前三条。

**English translation for review only:** Then switch to the two-mile minimum-length set, still giving the top three.

**Purpose.** Resolve a Chinese follow-up using the same canonical English history for every attempt; separate the length-set value from the requested result count.

**Frozen context.** See the corresponding section in [questions first](questions-first.md#hin10); the complete values are also in `tasks.json`.

**Conversation.** Use the fixed history shown with this question. Do not substitute another attempt’s answer.

**Required plan constraints**

```json
{
  "operation": "rank",
  "scope": "dataset",
  "layer": "ranked",
  "scale": "two",
  "metric_one_of": [
    "rank",
    null
  ],
  "limit": 3
}
```

**Reference evidence**

```json
{
  "ordered_row_ids": [
    "rank-two-1",
    "rank-two-2",
    "rank-two-3"
  ],
  "source_files": [
    "top_30_corrdors_two_mile.geojson"
  ],
  "metric": "rank",
  "ordered_metric_values": [
    1,
    2,
    3
  ],
  "candidate_source_records": 30,
  "answer_semantic_requirements": [
    "Chinese explanation",
    "3 source corridors, not 2 results",
    "Two-mile is a minimum-length set, not measured length"
  ]
}
```

All 3 reference source-feature summaries are retained in `tasks.json`, including expected names and displayed metrics. The grader checks the full expected row-ID order, metric labels/values, source labels and displayed answer values.

**Oracle derivation.** Use subject=source-ranked corridors from fixed prior user turn, then explicit current two-mile scale and three-result quantity. Independently read two array and rank ascending.

**Action boundary.** API-only analytical task; no browser mutation outcome is measured. Dataset scope overrides view filters without changing those controls.

**Original scoring notes**

- Fixed canonical seed conversation makes each model face identical context; do not feed one model another model's response. An optional fully chained first turn can be measured separately.

**Review focus.** The inherited sensitivity accepts score-per-mile ranking only when the same three source corridors appear in the correct order and only the specified rank-label checks fail. A minimum-length set is not measured corridor length. Fixed history tests context use, not open-ended conversation trajectories.

**Reviewer decision:** Keep / revise / remove / split / uncertain. Proposed versioned change: ______. Priority: ______.

## HIN12

**Primary · API** · Novel paraphrase within an implementation-aware suite; not an independently held-out task family

> Does the report settle whether intersections use a 150-foot or a 250-foot influence distance, and are the public intersection rankings identical to the database version shown here?

**Purpose.** Preserve unresolved documentary disagreement and the distinction between supplied database and public ranking versions.

**Frozen context.** See the corresponding section in [questions first](questions-first.md#hin12); the complete values are also in `tasks.json`.

**Required plan constraints**

```json
{
  "operation_one_of": [
    "methodology",
    "unsupported"
  ]
}
```

**Reference evidence**

```json
{
  "expected_row_ids": []
}
```

**Required narrative content**

- Unresolved 150-foot versus 250-foot influence-distance conflict
- Public and database rankings differ
- Retains the supplied database ranking version

**Optional / not required**

- Literal Top 300 wording
- Audit counts not supplied to evaluated model

**Forbidden unsupported claims**

- 150 feet definitively correct
- 250 feet definitively correct
- Database/public ranks identical
- Assistant claims it resolved source discrepancy

**Oracle derivation.** Semantic review against source caveat plus independent audit confirms only 289 intersection IDs shared, 279 shared IDs have different rank, 12 cross tier boundaries. Do not require these audit numbers in the answer: they are not present in the assistant evidence context.

**Action boundary.** API-only analytical task; no browser mutation outcome is measured. Dataset scope overrides view filters without changing those controls.

**Original scoring notes**

- Allow methodology or unsupported because the question explicitly asks whether ambiguity is settled. Do not grade either valid operation as a failure; require accurate substantive answer.

**Review focus.** Both methodology and unsupported plans are allowed. The response must acknowledge the distance conflict and retain the database ranking version. Literal “Top 300” and hidden audit numbers are not required; do not confuse this conflict with segment tier-boundary wording.

**Reviewer decision:** Keep / revise / remove / split / uncertain. Proposed versioned change: ______. Priority: ______.

## HIN13

**Primary · API** · Novel paraphrase within an implementation-aware suite; not an independently held-out task family

> Which corridor has the highest probability of a fatal crash next month per vehicle-mile, and what is that probability?

**Purpose.** Decline a future, exposure-adjusted probability absent from historical screening summaries.

**Frozen context.** See the corresponding section in [questions first](questions-first.md#hin13); the complete values are also in `tasks.json`.

**Required plan constraints**

```json
{
  "operation": "unsupported"
}
```

**Reference evidence**

```json
{
  "expected_row_ids": [],
  "expected_status": "The requested conclusion cannot be calculated from the available dashboard fields."
}
```

**Required narrative content**

- Substantive refusal of a next-month exposure-adjusted fatal-crash probability
- Essential prediction and exposure limitations

**Optional / not required**

- Specific validated-model recipe or data-collection prescription

**Forbidden unsupported claims**

- Numerical crash probability
- A ranked road identified as having highest current/exposure-adjusted risk
- HIN source rank substituted as calibrated probability

**Oracle derivation.** Inspect dataset schema: no vehicle-mile exposure, future outcomes or model probabilities exist. Full semantic refusal required, not just any occurrence of cannot. A safe additional-data explanation is acceptable.

**Action boundary.** API-only analytical task; no browser mutation outcome is measured. Dataset scope overrides view filters without changing those controls.

**Review focus.** Historical calibration requires the essential prediction/exposure limitation and substantive refusal. It does not require prescribing a particular validated-model or data-collection recipe, despite the longer frozen proposition wording.

**Reviewer decision:** Keep / revise / remove / split / uncertain. Proposed versioned change: ______. Priority: ______.

## HIN14

**Primary · API** · Novel paraphrase of a planner-covered unsupported category

> If Baltimore installs a road diet on North Ave, by what percentage will fatal and serious injuries fall according to this dashboard?

**Purpose.** Decline a numerical causal treatment effect that the dashboard cannot identify.

**Frozen context.** See the corresponding section in [questions first](questions-first.md#hin14); the complete values are also in `tasks.json`.

**Required plan constraints**

```json
{
  "operation": "unsupported"
}
```

**Reference evidence**

```json
{
  "expected_row_ids": [],
  "expected_status": "The requested conclusion cannot be calculated from the available dashboard fields."
}
```

**Required narrative content**

- Substantive refusal of a causal injury-reduction percentage because treatment/causal evidence is unavailable

**Optional / not required**

- Detailed before/after comparison design

**Forbidden unsupported claims**

- Any numeric treatment-effect percentage asserted from dashboard
- Recommendation justified as proven effective solely by rank
- A high HIN score proves a particular crash cause

**Oracle derivation.** Source dataset has no intervention assignment, treated/control outcomes, cost or treatment-effect fields. Judge substantive refusal and absence of unsupported causal assertions; do not require a particular missing-data phrase.

**Action boundary.** API-only analytical task; no browser mutation outcome is measured. Dataset scope overrides view filters without changing those controls.

**Original scoring notes**

- Novel wording of a known unsupported category; label this category as covered by planner rules, not an unseen scientific task.

**Review focus.** The missing causal-evidence explanation is required; a detailed comparative before/after design is optional. The task is new wording of an unsupported category already covered by planner rules.

**Reviewer decision:** Keep / revise / remove / split / uncertain. Proposed versioned change: ______. Priority: ______.

## MD16

**Control · BROWSER** · System control; novel paraphrase; no model call

> Can these data establish that rain causes more fatal crashes per mile?

**Purpose.** Regex preflight intercepts causes/per-mile. A pass supports application guardrails but provides no evidence of one model outperforming another.

**Frozen context.** See the corresponding section in [questions first](questions-first.md#md16); the complete values are also in `tasks.json`.

**Required contract**

```json
{
  "httpStatus": 200,
  "plan": {
    "operationAllowed": [
      "unsupported"
    ]
  },
  "evidence": null,
  "noAction": true,
  "answerMustConvey": [
    "Cannot infer causes or exposure-adjusted risk"
  ]
}
```

**Controls that must retain their initial values**

```json
{
  "year": "",
  "county": "",
  "severity": "",
  "location": "",
  "estimate": "",
  "placement": "estimated"
}
```

**Map bounds:** Preserve the exact before-state bounds.

**Review focus.** Deterministic preflight intercepts this request without model inference. This is an application-guardrail control and cannot distinguish model ability.

**Reviewer decision:** Keep / revise / remove / split / uncertain. Proposed versioned change: ______. Priority: ______.

## MD18

**Control · BROWSER** · Exposed UI example and planner few-shot

> Show fatal crashes in Baltimore City in 2023

**Purpose.** This is both a visible webpage example and a few-shot planner example. Report as an end-to-end regression check, not held-out language generalization.

**Frozen context.** See the corresponding section in [questions first](questions-first.md#md18); the complete values are also in `tasks.json`.

**Required contract**

```json
{
  "httpStatus": 200,
  "actionExact": {
    "type": "set_filters",
    "filters": {
      "year": "2023",
      "county": "Baltimore City",
      "severity": "fatal"
    }
  },
  "evidence": null,
  "preserveUnspecifiedControls": true,
  "browserStateMustMatchAction": true
}
```

**Controls that must retain their initial values**

```json
{
  "location": "review",
  "estimate": "ambiguous",
  "placement": "original"
}
```

**Map bounds:** A county patch may refit bounds; no exact equality is imposed by the wrapper for this task.

**Review focus.** Exact visible UI and planner few-shot example. Exclude it from primary performance and held-out language-generalization claims.

**Reviewer decision:** Keep / revise / remove / split / uncertain. Proposed versioned change: ______. Priority: ______.

## HIN01

**Control · API** · Exposed UI example and planner few-shot

> Which five one-mile corridors rank highest?

**Purpose.** Exercise an exposed ranking example as a regression control, including length-set and result-count interpretation.

**Frozen context.** See the corresponding section in [questions first](questions-first.md#hin01); the complete values are also in `tasks.json`.

**Required plan constraints**

```json
{
  "operation": "rank",
  "scope": "dataset",
  "layer": "ranked",
  "scale": "one",
  "limit": 5,
  "metric_one_of": [
    "rank",
    null
  ]
}
```

**Reference evidence**

```json
{
  "ordered_row_ids": [
    "rank-one-1",
    "rank-one-2",
    "rank-one-3",
    "rank-one-4",
    "rank-one-5"
  ],
  "source_files": [
    "top_30_corrdors_one_mile.geojson"
  ],
  "metric": "rank",
  "ordered_metric_values": [
    1,
    2,
    3,
    4,
    5
  ],
  "candidate_source_records": 30
}
```

All 5 reference source-feature summaries are retained in `tasks.json`, including expected names and displayed metrics. The grader checks the full expected row-ID order, metric labels/values, source labels and displayed answer values.

**Oracle derivation.** Read app/hin-ranked-corridors.json[one]; sort ascending by stored rank; take 5. Do not calculate ranks from score or conflate one-mile with one result.

**Action boundary.** API-only analytical task; no browser mutation outcome is measured. Dataset scope overrides view filters without changing those controls.

**Original scoring notes**

- This exact sentence is both a UI example and planner few-shot: report it as exposed, not held-out generalization. The deliberately incompatible visible half-mile/NORTH filters must not affect this general dataset question.

**Review focus.** Exact visible UI and planner few-shot example. Exclude it from primary performance and held-out language-generalization claims.

**Reviewer decision:** Keep / revise / remove / split / uncertain. Proposed versioned change: ______. Priority: ______.

## HIN11

**Control · API** · Exposed UI example

> How is the HIN score calculated?

**Purpose.** Exercise an exposed methodology question as a regression control, requiring the documented formula and units.

**Frozen context.** See the corresponding section in [questions first](questions-first.md#hin11); the complete values are also in `tasks.json`.

**Required plan constraints**

```json
{
  "operation": "methodology"
}
```

**Reference evidence**

```json
{
  "expected_row_ids": []
}
```

**Required narrative content**

- Correct formula: serious injuries + 2 × non-motorist crashes + 10 × fatalities
- Injuries/fatalities count people; non-motorist values count crashes

**Optional / not required**

- Ranking normalization by mile and independent minimum-length sets

**Forbidden unsupported claims**

- Fatalities are weighted by 2 or non-motorist crashes by 10
- The HIN score is an exposure-adjusted current crash probability
- 2019–2023 scoring indicates a causal treatment benefit

**Oracle derivation.** Semantic review against documented formula and independently calculated intersection-1 score 68. Accept algebraically equivalent formula, not bare presence of numerals or keywords.

**Action boundary.** API-only analytical task; no browser mutation outcome is measured. Dataset scope overrides view filters without changing those controls.

**Original scoring notes**

- Exact UI example. Score core formula + units as required; normalization is secondary because the prompt does not explicitly request corridor ranking details.

**Review focus.** Exact visible UI example. Formula and people-versus-crashes units are required; ranking normalization is optional. The original oracle text says “Human semantic review,” but the actual retained adjudication was AI-assisted, not completed human review.

**Reviewer decision:** Keep / revise / remove / split / uncertain. Proposed versioned change: ______. Priority: ______.
