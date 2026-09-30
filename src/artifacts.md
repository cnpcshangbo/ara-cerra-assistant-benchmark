# Code artifact index

This index covers the executable public tooling, frozen grader modules and application inspection snapshot. Outcome files are indexed separately through `evidence/export-provenance.json` and the evidence manifest. Claims listed below identify the method or evidence interpretation a module supports; source availability alone does not establish a claim's empirical truth.

## Aggregate reproduction

- **File(s) in repo:** `src/reproduce.py`
- **Nature:** New portable offline analysis tool adapted from the frozen aggregation method.
- **What it does / contains:** Validates complete schedules and strict-review conjunctions; recomputes all five campaign aggregates, category/mode scores, timings, functional sensitivity totals and 10,000 task-cluster bootstrap draws per campaign. Checks distinct public derivative hashes against export provenance.
- **How to use / run:** `PYTHONDONTWRITEBYTECODE=1 python3 src/reproduce.py`. Optional `--output /tmp/recomputed.json` saves the validated aggregate output. No private archive or network required.
- **Claims supported:** C01, C02, C03, C06. Reproduces arithmetic from archived outcomes, not source validity or semantic ratings.

## Portable grading overlay

- **File(s) in repo:** `src/grade-response.mjs`
- **Nature:** Portable adaptation of the original `grade-run.mjs` scoring overlay.
- **What it does / contains:** Dispatches campaign-specific core graders; checks selected model identity and real UI evidence; preserves original strict/narrative conjunction and UI-state-violation definition. Computes functional sensitivity using the exact campaign module. The private-archive replay matched all 924 archived outcomes; receipt: `evidence/grader-export-parity.json`.
- **How to use / run:** `node src/grade-response.mjs --help`; provide a private trial and optional independent narrative review. Redacted MD07 requires its original private case through `--case-file`.
- **Claims supported:** C01, C02, C05. It applies ratings supplied by a reviewer and does not replace semantic review.

## Exact frozen Maryland graders

- **File(s) in repo:**
  - `src/frozen-grader/transportation-model-benchmark-2026-09-18/grader-mdsp.mjs`
  - `src/frozen-grader/transportation-gpt-benchmark-2026-09-23/grader-mdsp.mjs`
  - `src/frozen-grader/local-model-benchmark-2026-09-24/grader-mdsp.mjs`
  - `src/frozen-grader/qwen-newer-benchmark-2026-09-29/grader-mdsp.mjs`
  - `src/frozen-grader/gpt61-sol-benchmark-2026-09-29/grader-mdsp.mjs`
- **Nature:** Byte-identical historical source modules; source/public SHA-256 mappings in export provenance.
- **What it does / contains:** Structural, numerical, operation/scope, caveat, action, actual control/URL/data-query and forbidden raw-record checks, plus 12 adversarial synthetic fixtures per module.
- **How to use / run:** Import `gradeMaryland(caseSpec, trial)` or run any listed module with `--self-test`. The portable overlay adds cross-cutting protocol checks after core grading.
- **Claims supported:** C01, C02, C04, C07. Required case constraints determine what each check means; no source ETL validation is performed here.

## Exact frozen HIN graders

- **File(s) in repo:**
  - `src/frozen-grader/transportation-model-benchmark-2026-09-18/grader-hin.mjs`
  - `src/frozen-grader/transportation-gpt-benchmark-2026-09-23/grader-hin.mjs`
  - `src/frozen-grader/local-model-benchmark-2026-09-24/grader-hin.mjs`
  - `src/frozen-grader/qwen-newer-benchmark-2026-09-29/grader-hin.mjs`
  - `src/frozen-grader/gpt61-sol-benchmark-2026-09-29/grader-hin.mjs`
- **Nature:** Byte-identical historical source modules, including each campaign's known model-ID set.
- **What it does / contains:** Validates query constraints, ordered source evidence, supported numeric answer claims, units, scope and identity. Marks generated narrative cases for later semantic review; includes nine synthetic adversarial fixtures per module.
- **How to use / run:** Import `gradeHin(caseSpec, trial)` or run a listed module with `--self-test`. Use the exact campaign version when comparing historical grading.
- **Claims supported:** C01, C05, C06. A core structural pass is not a completed narrative judgment.

## Exact functional sensitivity rules

- **File(s) in repo:**
  - `src/frozen-grader/transportation-model-benchmark-2026-09-18/sensitivity.mjs`
  - `src/frozen-grader/transportation-gpt-benchmark-2026-09-23/sensitivity.mjs`
  - `src/frozen-grader/local-model-benchmark-2026-09-24/sensitivity.mjs`
  - `src/frozen-grader/qwen-newer-benchmark-2026-09-29/sensitivity.mjs`
  - `src/frozen-grader/gpt61-sol-benchmark-2026-09-29/sensitivity.mjs`
- **Nature:** Byte-identical historical diagnostic modules; the sensitivity analysis originated post hoc and was inherited by subsequent campaigns.
- **What it does / contains:** Explicit constrained relaxations for equivalent operations/ranking metric, redundant preserved action fields, an underspecified refusal caveat and a scope-equivalent annual breakdown. The primary strict rubric remains unchanged. Each module has 11 fixtures, including wrong-evidence counterexamples that must still fail.
- **How to use / run:** Import `sensitivityGrade(caseSpec, trial, protocolGrade, narrativeReview)` or run a listed module with `--self-test`.
- **Claims supported:** C02, C07. Sensitivity is secondary, not a replacement primary score.

## HIN application planning and evidence semantics

- **File(s) in repo:** `src/app-snapshot/app/assistant-planner.ts`, `src/app-snapshot/app/assistant-data.ts`, `src/app-snapshot/app/hin-data.ts`, `src/app-snapshot/app/scenarios.ts`
- **Nature:** Byte-identical frozen application modules provided for inspection.
- **What it does / contains:** The HIN query prompt; query validation and postprocessing; deterministic evidence queries and factual rendering; source metric/types and map-state validation. The code exposes where model decisions end and shared application behavior begins.
- **How to use / run:** Read alongside HIN tasks and the HIN grader. This is not a deployable app; source data and framework packaging are absent. Use the public offline tools for supported executable workflows.
- **Claims supported:** C01, C04, C06, C07.

## Maryland planning, reconciliation and actions

- **File(s) in repo:** `src/app-snapshot/app/mdsp-assistant-data.ts`, `src/app-snapshot/app/mdsp-filter-actions.ts`, `src/app-snapshot/app/dashboard/maryland/estimated-location.tsx`, `src/app-snapshot/app/dashboard/maryland/location-check.tsx`
- **Nature:** Byte-identical frozen application modules and their imported source-state type/display definitions.
- **What it does / contains:** Maryland prompt/schema, scope reconciliation including the shared visible-map keyword behavior, deterministic answer rendering, UI filter prompt and explicit requested-control validation. The two TSX modules describe source-location estimates/screening rather than independent verified corrections.
- **How to use / run:** Inspect with MD01, MD04, MD05 and MD17 task/rubric discussions. These source modules do not include the authorized source database or application runtime and are not standalone CLI programs.
- **Claims supported:** C01, C02, C04, C07.

## Inference assembly excerpts and model aliases

- **File(s) in repo:** `src/app-snapshot/hin-inference-route.excerpt.ts`, `src/app-snapshot/maryland-inference-route.excerpt.ts`, `src/app-snapshot/app/model-catalog.ts`
- **Nature:** Two verbatim contiguous source excerpts and one byte-identical catalog. Original file hashes and precise excerpt line ranges are in export provenance.
- **What it does / contains:** Planner/narrator message assembly, internal validation repairs, safeguards, deterministic response alternatives, requested model aliases and frozen default. Account/authentication and feedback-signing implementations are excluded. Excerpts deliberately reference surrounding variables and are not valid complete modules.
- **How to use / run:** Read to understand system boundaries; do not compile excerpts as a standalone server. Cross-campaign configuration differences are described in benchmark/paper documentation.
- **Claims supported:** C01, C05, C06.

## Exploratory collector

- **File(s) in repo:** `src/collect-api.mjs`
- **Nature:** New minimal caller-owned deployment adapter; not the historical browser/API harness.
- **What it does / contains:** One API-only task attempt, default dry-run/loopback, explicit execution, environment-only caller session, no redirects, no external retries, owner-only output outside the publication tree and response metadata redaction. Browser tasks are refused. MD07 requires a private local record binding and remains exploratory.
- **How to use / run:** `node src/collect-api.mjs --help`; `node src/collect-api.mjs --case MD01 --model qwen3-14b` is dry-run. Follow the environment documentation before any real request.
- **Claims supported:** C06 as a reproducibility boundary illustration; new exploratory trials do not support historical numerical claims.

## Verification tests

- **File(s) in repo:** `src/self-test.mjs`, `src/test_reproduce.py`, `src/test-collector.mjs`
- **Nature:** Offline tests of the released analysis/adapter code and exact frozen synthetic grader suites.
- **What it does / contains:** 160 historical synthetic fixtures across the five grader sets and eight identity/review/browser overlay checks; six incomplete/duplicate/tampered/control-exclusion aggregation tests; loopback-stub collector checks for dry-run, private paths including symlinks, credential requirements, no overwrite/extra submission, output permissions and browser refusal. No model inference is involved.
- **How to use / run:** Commands in `src/environment.md`. Tests clean temporary directories; use `PYTHONDONTWRITEBYTECODE=1` for Python to keep bytecode out of redistribution.
- **Claims supported:** C01, C02, C05, C06 as implementation regression checks, not independent research outcome validation.

## Reproduction documentation

- **File(s) in repo:** `src/README.md`, `src/environment.md`, `src/artifacts.md`
- **Nature:** Release documentation and pointer index.
- **What it does / contains:** Setup, exact source inventory, aggregate-vs-end-to-end boundary, data/credential exclusions, and all supported code entry points.
- **How to use / run:** Read `src/README.md` first for executable scope, then `src/environment.md` for commands and dependencies. This index maps reviewer questions to actual source files.
- **Claims supported:** C01–C07 as audit navigation, not additional empirical evidence.
