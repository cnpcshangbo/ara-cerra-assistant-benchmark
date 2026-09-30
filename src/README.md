# Code and reproducibility

The working offline path uses Python 3.10+ and Node.js 20+. It has no third-party dependencies, makes no network requests and needs no account or API key. Run from the artifact root:

```sh
python3 src/reproduce.py
python3 src/test_reproduce.py
node src/self-test.mjs
node src/test-collector.mjs
```

`reproduce.py` validates the 924 exported outcome records, all five campaign schedules, the structural/narrative conjunction, and the public file hashes. It recomputes every published aggregate: 792 primary attempts, 132 controls, 297 browser attempts, 132 narrative reviews, category/mode success, request and browser timing, functional sensitivity totals, 10,000 task-cluster bootstrap draws per campaign (seed 20260918), and within-campaign paired differences. The deterministic computed values must match `evidence/expected-aggregates.json` within 1e-12. Optional `--output /tmp/recomputed.json` saves the result.

This is **aggregate reproduction from archived scalar outcomes**. It independently checks arithmetic and outcome conjunctions, but it does not independently rejudge undisclosed model answers, validate source ETL, recover a model's raw planner output, or verify the original browser recordings. Checks and review booleans are archived measurements, not independently established truth. Functional sensitivity booleans are likewise archived outcomes; the exact sensitivity code is supplied for inspection and regrading when an original response is available. `test-collector.mjs` uses an in-process loopback stub only, never a model service.

## Files and evidence

- `frozen-grader/<campaign>/grader-mdsp.mjs`, `grader-hin.mjs`, and `sensitivity.mjs` are byte-identical copies of each campaign's modules. All existing comments are retained. Self-tests exercise wrong numerical evidence, scope, model identity, unsupported actions, URL/data-query effects and pending narrative review.
- `grade-response.mjs` ports the common `grade-run.mjs` structural/narrative overlay into an importable function. It does not create narrative ratings. It retains strict conjunction, model-identity validation, actual UI requirements and the original UI-state-violation definition.
- `app-snapshot/` exposes exact prompts, validators, deterministic evidence rendering and reconciliation from the September 29 frozen application. It is an **inspection snapshot**, not a deployable application. See its inventory below.
- `evidence/evaluated-records.json` contains scalar timings, HTTP status, model/task/campaign identity, check booleans, review booleans and final scores. It excludes model answers, private request data, selected crash identifiers, GPS and individual source rows.
- `evidence/campaigns.json` retains per-campaign task order, repetitions, model order, source manifest hashes and run windows. There are ten distinct configurations and eleven model observations because Qwen3 14B appears in two campaigns.
- `evidence/export-provenance.json` distinguishes original private file hashes from public derivative hashes and maps every exact code copy or route excerpt to its original file.

The `unintendedMutation` machine key means a **UI-state violation under the frozen task policy**. It does not imply an observed real-world injury or security incident. For MD17, the explicit year request still required clarification of ambiguous Baltimore geography before changing controls; a partial year change fails that particular policy. `uiChanged` simply records any control-value change and is a different variable.

## Regrading a caller-supplied response

```sh
node src/grade-response.mjs --case MD01 --trial /private/trial.json
node src/grade-response.mjs --case HIN11 --trial /private/trial.json --review /private/review.json
```

A trial needs `status`, `modelId`, `response`, and actual `ui` evidence for browser cases, with the same schema used in the original harness. A semantic review object has `pass`, `supportedClaims`, and `caveatsComplete`; use the provided review instructions to reach those decisions. A missing review cannot produce strict success for a narrative case. Use `--campaign <campaign-folder>` to choose historical core grader versions. Output includes grading details and should remain private until reviewed.

The public MD07 case has a deliberately reduced, de-identified selected-record oracle. `grade-response.mjs` refuses to treat that reduced case as an exact historical regrade. To regrade MD07, provide the restored original private case through `--case-file /private/original-case.json`, with its matching authorized local snapshot. The 27 other task objects are byte-equivalent at the JSON-object level to the frozen manifest. Review proposals must form a new benchmark version; they must not overwrite historical scores.

## New exploratory API requests

`collect-api.mjs` makes one API-only attempt against **your own** authorized CERRA deployment. It defaults to a dry run and loopback `http://127.0.0.1:3000`. Browser cases are rejected because API responses cannot demonstrate browser behavior.

```sh
node src/collect-api.mjs --case MD01 --model qwen3-14b
# With your deployment's session already supplied through environment:
node src/collect-api.mjs --case MD01 --model qwen3-14b --execute --out /private/new-trial.json
```

Set `CERRA_BASE_URL` and `CERRA_SESSION_COOKIE` in your own environment; no credential is included in this package. Remote deployments additionally require `--allow-remote` and HTTPS. MD07 requires a private local `CERRA_SELECTED_WEATHER_ID` binding. The collector never prints the cookie or response, follows no redirects, uses no external retry, reserves a new output file before submission, and stores results with owner-only permissions outside the publication directory. A request may incur charges through your configured provider. New outputs are exploratory and cannot be appended to the frozen published campaign.

An exact end-to-end rerun is **not available from this package alone**. It requires the authorized source SQLite/JSON snapshots, database bindings, the original application environment and versions, the browser harness, model routing/configuration, and private selected-record oracle. The package does not redistribute those databases, account/session code, deployment infrastructure, or raw traces. The available public API collector does not substitute for the original browser harness.

## Application snapshot inventory

The snapshot comes from the frozen September 29 Sol fixture based on application commit `6ed65fc06f525e8bbe8cb800ce80487642f6120a`, with the declared later model routing changes. The accompanying provenance contains the exact frozen file hashes; this is not a claim that every snapshot file is byte-identical to that base commit.

| File | What a reviewer can inspect |
| --- | --- |
| `app/assistant-planner.ts` | HIN structured-query system prompt |
| `app/assistant-data.ts` | Query validation/reconciliation, evidence assembly, deterministic HIN rendering |
| `app/mdsp-assistant-data.ts` | Maryland context/query validation, prompt, postprocessor and deterministic answer rendering |
| `app/mdsp-filter-actions.ts` | UI action prompt, exact field validation and requested-control rules |
| `app/hin-data.ts`, `app/scenarios.ts` | Types, metric semantics and map-state validation dependencies |
| `app/model-catalog.ts` | Tested application model aliases and default configuration |
| `app/dashboard/maryland/{estimated-location,location-check}.tsx` | Source-state types and display semantics imported by the Maryland module |
| `hin-inference-route.excerpt.ts` | Verbatim route slice assembling HIN planner/narrator calls and repair loop |
| `maryland-inference-route.excerpt.ts` | Verbatim route slice showing safeguards, filter flow, planner repair and data-query construction |

The route excerpts are incomplete TypeScript fragments and intentionally do not compile alone. Full modules import local type/render dependencies; the location display modules additionally use React. Source databases, framework runtime and application packaging are not included. Production authentication and access controls remain in the private application, outside this artifact. The snapshot is supplied to expose how benchmark prompts reach planning, validation and scoring, not to deploy an unprotected copy of CERRA.
