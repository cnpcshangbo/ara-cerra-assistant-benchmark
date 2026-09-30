# Questions first: independent design review

Read this file before the answer key, result tables, model names or leaderboards. It contains all 28 original prompts, the supplied initial context and any canonical history. No model outputs or performance scores are included.

For each task, first write what you think a reasonable assistant should do, what it must preserve, what data are needed and whether more than one interpretation is reasonable. Then compare your judgment with [the frozen answer key](task-review.md). Use [the checklist](checklist.csv) to record your review.

The English translations of the three Chinese prompts are editorial aids, **not** replacement prompts or inputs used in the experiment. Empty strings mean an unrestricted control; `fsi` means fatal-or-serious injury. HIN `half`, `one`, and `two` identify minimum-length sets, not measured corridor lengths. A context is an API input unless its task is explicitly marked browser.

MD07 uses a public selected-record binding token. Its real local identifier, date, precise coordinates and other single-record details are deliberately omitted. Relevant weather-source evidence is available in the answer key. No live account or dashboard access is required to review question design.

## Jump to a question

[MD01](#md01) · [MD02](#md02) · [MD03](#md03) · [MD04](#md04) · [MD05](#md05) · [MD06](#md06) · [MD07](#md07) · [MD08](#md08) · [MD09](#md09) · [MD10](#md10) · [MD11](#md11) · [MD12](#md12) · [MD15](#md15) · [MD17](#md17) · [RV01](#rv01) · [RV02](#rv02) · [HIN02](#hin02) · [HIN03](#hin03) · [HIN05](#hin05) · [HIN06](#hin06) · [HIN10](#hin10) · [HIN12](#hin12) · [HIN13](#hin13) · [HIN14](#hin14) · [MD16](#md16) · [MD18](#md18) · [HIN01](#hin01) · [HIN11](#hin11)

## MD01

**Primary · API** · Novel paraphrase within an implementation-aware suite; not an independently held-out task family

> How many reports match my current crash selection, including the ones outside the visible map?

**Supplied context / initial controls**

```json
{
  "year": "2022",
  "county": "Montgomery",
  "severity": "fsi",
  "location": "",
  "estimate": "",
  "placement": "estimated",
  "bbox": "-76.7,39.2,-76.5,39.4",
  "selectedId": null
}
```

**First-pass notes:** Intended interpretation: ______ · Ambiguity: ______ · Required evidence: ______ · Allowed state change: ______

## MD02

**Primary · API** · Novel paraphrase within an implementation-aware suite; not an independently held-out task family

> Across Maryland and all years, how complete is the recorded ambient weather information?

**Supplied context / initial controls**

```json
{
  "year": "2022",
  "county": "Montgomery",
  "severity": "fsi",
  "location": "",
  "estimate": "",
  "placement": "estimated",
  "bbox": "-76.7,39.2,-76.5,39.4",
  "selectedId": null
}
```

**First-pass notes:** Intended interpretation: ______ · Ambiguity: ______ · Required evidence: ______ · Allowed state change: ______

## MD03

**Primary · API** · Novel paraphrase within an implementation-aware suite; not an independently held-out task family

> Give me a county-by-county total for 2021 statewide, regardless of severity.

**Supplied context / initial controls**

```json
{
  "year": "2022",
  "county": "Montgomery",
  "severity": "fsi",
  "location": "",
  "estimate": "",
  "placement": "estimated",
  "bbox": "-76.7,39.2,-76.5,39.4",
  "selectedId": null
}
```

**First-pass notes:** Intended interpretation: ______ · Ambiguity: ______ · Required evidence: ______ · Allowed state change: ______

## MD04

**Primary · API** · Novel paraphrase within an implementation-aware suite; not an independently held-out task family

> For Baltimore County, tabulate report totals for all years and all severity levels.

**Supplied context / initial controls**

```json
{
  "year": "2022",
  "county": "Montgomery",
  "severity": "fsi",
  "location": "",
  "estimate": "",
  "placement": "estimated",
  "bbox": "-76.7,39.2,-76.5,39.4",
  "selectedId": null
}
```

**First-pass notes:** Intended interpretation: ______ · Ambiguity: ______ · Required evidence: ______ · Allowed state change: ______

## MD05

**Primary · API** · Novel paraphrase within an implementation-aware suite; not an independently held-out task family

> How many 2022 crash reports across Maryland list rain as the ambient weather?

**Supplied context / initial controls**

```json
{
  "year": "2022",
  "county": "Montgomery",
  "severity": "fsi",
  "location": "",
  "estimate": "",
  "placement": "estimated",
  "bbox": "-76.7,39.2,-76.5,39.4",
  "selectedId": null
}
```

**First-pass notes:** Intended interpretation: ______ · Ambiguity: ______ · Required evidence: ______ · Allowed state change: ______

## MD06

**Primary · API** · Novel paraphrase within an implementation-aware suite; not an independently held-out task family

> What about 2025?

**Supplied context / initial controls**

```json
{
  "year": "2022",
  "county": "Montgomery",
  "severity": "fsi",
  "location": "",
  "estimate": "",
  "placement": "estimated",
  "bbox": "-76.7,39.2,-76.5,39.4",
  "selectedId": null
}
```

**Fixed canonical history**

```json
[
  {
    "role": "user",
    "content": "How many 2022 crash reports across Maryland list rain as the ambient weather?"
  },
  {
    "role": "assistant",
    "content": "The previous query counted 2022 reports with recorded ambient rain across Maryland."
  }
]
```

**Persisted previous query**

```json
{
  "operation": "summary",
  "scope": "all",
  "year": "2022",
  "county": "",
  "severity": "",
  "weather": "Raining",
  "location": "",
  "estimate": "",
  "placement": "estimated"
}
```

**First-pass notes:** Intended interpretation: ______ · Ambiguity: ______ · Required evidence: ______ · Allowed state change: ______

## MD07

**Primary · API** · Novel paraphrase within an implementation-aware suite; not an independently held-out task family

> For the selected crash, does an unmarked Weather Conditions contributor establish clear weather?

**Supplied context / initial controls**

```json
{
  "year": "2022",
  "county": "Montgomery",
  "severity": "fsi",
  "location": "",
  "estimate": "",
  "placement": "estimated",
  "bbox": "-76.7,39.2,-76.5,39.4",
  "selectedId": "selected-weather-unavailable-01"
}
```

**First-pass notes:** Intended interpretation: ______ · Ambiguity: ______ · Required evidence: ______ · Allowed state change: ______

## MD08

**Primary · API** · Novel paraphrase within an implementation-aware suite; not an independently held-out task family

> What does the GPS screening show for crashes visible in this view?

**Supplied context / initial controls**

```json
{
  "year": "",
  "county": "",
  "severity": "",
  "location": "",
  "estimate": "",
  "placement": "estimated",
  "bbox": "-76.7,39.2,-76.5,39.4",
  "selectedId": null
}
```

**First-pass notes:** Intended interpretation: ______ · Ambiguity: ______ · Required evidence: ______ · Allowed state change: ______

## MD09

**Primary · API** · Novel paraphrase within an implementation-aware suite; not an independently held-out task family

> For the visible map area, compare original and estimated locations and count reports entering or leaving.

**Supplied context / initial controls**

```json
{
  "year": "",
  "county": "",
  "severity": "",
  "location": "",
  "estimate": "",
  "placement": "estimated",
  "bbox": "-76.7,39.2,-76.5,39.4",
  "selectedId": null
}
```

**First-pass notes:** Intended interpretation: ______ · Ambiguity: ______ · Required evidence: ______ · Allowed state change: ______

## MD10

**Primary · BROWSER** · Novel paraphrase within an implementation-aware suite; not an independently held-out task family

> 请筛选 2021 年 Baltimore County 的重伤事故。

**English translation for review only:** Please filter to serious-injury crashes in Baltimore County in 2021.

**Supplied context / initial controls**

```json
{
  "year": "2024",
  "county": "Baltimore City",
  "severity": "property",
  "location": "review",
  "estimate": "ambiguous",
  "placement": "original",
  "bbox": "-76.7,39.2,-76.5,39.4",
  "selectedId": null
}
```

**First-pass notes:** Intended interpretation: ______ · Ambiguity: ______ · Required evidence: ______ · Allowed state change: ______

## MD11

**Primary · BROWSER** · Novel paraphrase within an implementation-aware suite; not an independently held-out task family

> Please limit the map to fatal or serious injury crashes in Anne Arundel during 2022.

**Supplied context / initial controls**

```json
{
  "year": "2024",
  "county": "Baltimore City",
  "severity": "property",
  "location": "review",
  "estimate": "ambiguous",
  "placement": "original",
  "bbox": "-76.7,39.2,-76.5,39.4",
  "selectedId": null
}
```

**First-pass notes:** Intended interpretation: ______ · Ambiguity: ______ · Required evidence: ______ · Allowed state change: ______

## MD12

**Primary · BROWSER** · Novel paraphrase within an implementation-aware suite; not an independently held-out task family

> Remove the year restriction while preserving my other selections.

**Supplied context / initial controls**

```json
{
  "year": "2024",
  "county": "Baltimore City",
  "severity": "property",
  "location": "review",
  "estimate": "ambiguous",
  "placement": "original",
  "bbox": "-76.7,39.2,-76.5,39.4",
  "selectedId": null
}
```

**First-pass notes:** Intended interpretation: ______ · Ambiguity: ______ · Required evidence: ______ · Allowed state change: ______

## MD15

**Primary · BROWSER** · Novel paraphrase within an implementation-aware suite; not an independently held-out task family

> Filter to 2022 fatal crashes during rain.

**Supplied context / initial controls**

```json
{
  "year": "2024",
  "county": "Baltimore City",
  "severity": "property",
  "location": "review",
  "estimate": "ambiguous",
  "placement": "original",
  "bbox": "-76.7,39.2,-76.5,39.4",
  "selectedId": null
}
```

**First-pass notes:** Intended interpretation: ______ · Ambiguity: ______ · Required evidence: ______ · Allowed state change: ______

## MD17

**Primary · BROWSER** · Novel paraphrase within an implementation-aware suite; not an independently held-out task family

> Focus the map on Baltimore for 2020.

**Supplied context / initial controls**

```json
{
  "year": "2024",
  "county": "Baltimore City",
  "severity": "property",
  "location": "review",
  "estimate": "ambiguous",
  "placement": "original",
  "bbox": "-76.7,39.2,-76.5,39.4",
  "selectedId": null
}
```

**First-pass notes:** Intended interpretation: ______ · Ambiguity: ______ · Required evidence: ______ · Allowed state change: ______

## RV01

**Primary · BROWSER** · Novel paraphrase within an implementation-aware suite; not an independently held-out task family

> Change the study area to Prince George's and show serious-injury crashes; leave year, GPS cross-check, location estimates and map positions as they are.

**Supplied context / initial controls**

```json
{
  "year": "2025",
  "county": "Montgomery",
  "severity": "property",
  "location": "review",
  "estimate": "ambiguous",
  "placement": "compare",
  "bbox": "-79.6,37.8,-74.8,39.85",
  "selectedId": null
}
```

**First-pass notes:** Intended interpretation: ______ · Ambiguity: ______ · Required evidence: ______ · Allowed state change: ______

## RV02

**Primary · BROWSER** · Novel paraphrase within an implementation-aware suite; not an independently held-out task family

> Clear only the GPS cross-check; keep the unresolved location-estimate filter and comparison map positions.

**Supplied context / initial controls**

```json
{
  "year": "2021",
  "county": "Howard",
  "severity": "fsi",
  "location": "county",
  "estimate": "unresolved",
  "placement": "compare",
  "bbox": "-79.6,37.8,-74.8,39.85",
  "selectedId": null
}
```

**First-pass notes:** Intended interpretation: ______ · Ambiguity: ______ · Required evidence: ______ · Allowed state change: ______

## HIN02

**Primary · API** · Novel paraphrase within an implementation-aware suite; not an independently held-out task family

> Using the full dataset, list the three corridors in the half-mile minimum-length set with the largest fatality counts.

**Supplied context / initial controls**

```json
{
  "layers": {
    "ranked": true,
    "intersections": true,
    "fsi": true,
    "nonMotorist": false,
    "tracts": false
  },
  "scale": "half",
  "rankLimit": 10,
  "tier": "Major Concern",
  "intersectionTier": "Tier 2",
  "tractMetric": "pedestrianActivityLevel",
  "streetQuery": "NORTH"
}
```

**First-pass notes:** Intended interpretation: ______ · Ambiguity: ______ · Required evidence: ______ · Allowed state change: ______

## HIN03

**Primary · API** · Novel paraphrase within an implementation-aware suite; not an independently held-out task family

> For the entire dataset, show the first three Tier 2 intersections by source rank.

**Supplied context / initial controls**

```json
{
  "layers": {
    "ranked": true,
    "intersections": true,
    "fsi": false,
    "nonMotorist": false,
    "tracts": false
  },
  "scale": "one",
  "rankLimit": 10,
  "tier": "all",
  "intersectionTier": "Tier 1",
  "tractMetric": "pedestrianActivityLevel",
  "streetQuery": ""
}
```

**First-pass notes:** Intended interpretation: ______ · Ambiguity: ______ · Required evidence: ______ · Allowed state change: ______

## HIN05

**Primary · API** · Novel paraphrase of a displayed example

> From all census tracts, give the top four by the percentage of households without a vehicle. Exclude unavailable values.

**Supplied context / initial controls**

```json
{
  "layers": {
    "ranked": true,
    "intersections": true,
    "fsi": false,
    "nonMotorist": false,
    "tracts": false
  },
  "scale": "one",
  "rankLimit": 10,
  "tier": "all",
  "intersectionTier": "all",
  "tractMetric": "pedestrianActivityLevel",
  "streetQuery": ""
}
```

**First-pass notes:** Intended interpretation: ______ · Ambiguity: ______ · Required evidence: ______ · Allowed state change: ______

## HIN06

**Primary · API** · Novel paraphrase within an implementation-aware suite; not an independently held-out task family

> 忽略当前地图筛选，整个数据集中有多少 Major Concern 的严重伤亡源记录？

**English translation for review only:** Ignoring the current map filters, how many Major Concern fatal-and-serious-injury source records are there in the entire dataset?

**Supplied context / initial controls**

```json
{
  "layers": {
    "ranked": true,
    "intersections": true,
    "fsi": true,
    "nonMotorist": false,
    "tracts": false
  },
  "scale": "half",
  "rankLimit": 10,
  "tier": "Major Concern",
  "intersectionTier": "Tier 2",
  "tractMetric": "pedestrianActivityLevel",
  "streetQuery": "NORTH"
}
```

**First-pass notes:** Intended interpretation: ______ · Ambiguity: ______ · Required evidence: ______ · Allowed state change: ______

## HIN10

**Primary · API** · Novel paraphrase within an implementation-aware suite; not an independently held-out task family

> 那换成两英里的最低长度组，仍然给前三条。

**English translation for review only:** Then switch to the two-mile minimum-length set, still giving the top three.

**Supplied context / initial controls**

```json
{
  "layers": {
    "ranked": true,
    "intersections": true,
    "fsi": false,
    "nonMotorist": false,
    "tracts": false
  },
  "scale": "one",
  "rankLimit": 10,
  "tier": "all",
  "intersectionTier": "all",
  "tractMetric": "pedestrianActivityLevel",
  "streetQuery": ""
}
```

**Fixed canonical history**

```json
[
  {
    "role": "user",
    "content": "Across the full dataset, list the three best-ranked corridors in the one-mile minimum-length set."
  },
  {
    "role": "assistant",
    "content": "The source ranks are 1 PENNSYLVANIA AVE, 2 E NORTH AVE/ W NORTH AVE, and 3 N MARTIN LUTHER KING JR BLVD. These are the one-mile minimum-length set; each set is ranked independently."
  }
]
```

**First-pass notes:** Intended interpretation: ______ · Ambiguity: ______ · Required evidence: ______ · Allowed state change: ______

## HIN12

**Primary · API** · Novel paraphrase within an implementation-aware suite; not an independently held-out task family

> Does the report settle whether intersections use a 150-foot or a 250-foot influence distance, and are the public intersection rankings identical to the database version shown here?

**Supplied context / initial controls**

```json
{
  "layers": {
    "ranked": true,
    "intersections": true,
    "fsi": false,
    "nonMotorist": false,
    "tracts": false
  },
  "scale": "one",
  "rankLimit": 10,
  "tier": "all",
  "intersectionTier": "all",
  "tractMetric": "pedestrianActivityLevel",
  "streetQuery": ""
}
```

**First-pass notes:** Intended interpretation: ______ · Ambiguity: ______ · Required evidence: ______ · Allowed state change: ______

## HIN13

**Primary · API** · Novel paraphrase within an implementation-aware suite; not an independently held-out task family

> Which corridor has the highest probability of a fatal crash next month per vehicle-mile, and what is that probability?

**Supplied context / initial controls**

```json
{
  "layers": {
    "ranked": true,
    "intersections": true,
    "fsi": false,
    "nonMotorist": false,
    "tracts": false
  },
  "scale": "one",
  "rankLimit": 10,
  "tier": "all",
  "intersectionTier": "all",
  "tractMetric": "pedestrianActivityLevel",
  "streetQuery": ""
}
```

**First-pass notes:** Intended interpretation: ______ · Ambiguity: ______ · Required evidence: ______ · Allowed state change: ______

## HIN14

**Primary · API** · Novel paraphrase of a planner-covered unsupported category

> If Baltimore installs a road diet on North Ave, by what percentage will fatal and serious injuries fall according to this dashboard?

**Supplied context / initial controls**

```json
{
  "layers": {
    "ranked": true,
    "intersections": true,
    "fsi": false,
    "nonMotorist": false,
    "tracts": false
  },
  "scale": "one",
  "rankLimit": 10,
  "tier": "all",
  "intersectionTier": "all",
  "tractMetric": "pedestrianActivityLevel",
  "streetQuery": ""
}
```

**First-pass notes:** Intended interpretation: ______ · Ambiguity: ______ · Required evidence: ______ · Allowed state change: ______

## MD16

**Control · BROWSER** · System control; novel paraphrase; no model call

> Can these data establish that rain causes more fatal crashes per mile?

**Supplied context / initial controls**

```json
{
  "year": "",
  "county": "",
  "severity": "",
  "location": "",
  "estimate": "",
  "placement": "estimated",
  "bbox": "-76.7,39.2,-76.5,39.4",
  "selectedId": null
}
```

**First-pass notes:** Intended interpretation: ______ · Ambiguity: ______ · Required evidence: ______ · Allowed state change: ______

## MD18

**Control · BROWSER** · Exposed UI example and planner few-shot

> Show fatal crashes in Baltimore City in 2023

**Supplied context / initial controls**

```json
{
  "year": "2024",
  "county": "Baltimore City",
  "severity": "property",
  "location": "review",
  "estimate": "ambiguous",
  "placement": "original",
  "bbox": "-76.7,39.2,-76.5,39.4",
  "selectedId": null
}
```

**First-pass notes:** Intended interpretation: ______ · Ambiguity: ______ · Required evidence: ______ · Allowed state change: ______

## HIN01

**Control · API** · Exposed UI example and planner few-shot

> Which five one-mile corridors rank highest?

**Supplied context / initial controls**

```json
{
  "layers": {
    "ranked": true,
    "intersections": true,
    "fsi": true,
    "nonMotorist": false,
    "tracts": false
  },
  "scale": "half",
  "rankLimit": 10,
  "tier": "Major Concern",
  "intersectionTier": "Tier 2",
  "tractMetric": "pedestrianActivityLevel",
  "streetQuery": "NORTH"
}
```

**First-pass notes:** Intended interpretation: ______ · Ambiguity: ______ · Required evidence: ______ · Allowed state change: ______

## HIN11

**Control · API** · Exposed UI example

> How is the HIN score calculated?

**Supplied context / initial controls**

```json
{
  "layers": {
    "ranked": true,
    "intersections": true,
    "fsi": false,
    "nonMotorist": false,
    "tracts": false
  },
  "scale": "one",
  "rankLimit": 10,
  "tier": "all",
  "intersectionTier": "all",
  "tractMetric": "pedestrianActivityLevel",
  "streetQuery": ""
}
```

**First-pass notes:** Intended interpretation: ______ · Ambiguity: ______ · Required evidence: ______ · Allowed state change: ______
