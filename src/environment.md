# Execution environment and reproduction boundary

The offline reproduction and tests require Python 3.10 or newer and Node.js 20 or newer. They use only the standard libraries. No package installation, model credential, browser, source database, or network access is required for aggregate reproduction and grader tests. The collector test starts its own temporary loopback HTTP stub; it does not call a model or use an existing account.

The release validation ran with Python 3.12.3 and Node.js v20.20.2. Exact observed versions and test outcomes are recorded in `evidence/code-validation.json`.

From the artifact root:

```sh
PYTHONDONTWRITEBYTECODE=1 python3 src/reproduce.py
PYTHONDONTWRITEBYTECODE=1 python3 src/test_reproduce.py
node src/self-test.mjs
node src/test-collector.mjs
```

Do not bundle `__pycache__`, test temporary files, new responses or local session credentials when redistributing the artifact. The frozen core graders can also be checked individually with `node src/frozen-grader/<campaign>/grader-mdsp.mjs --self-test`, `grader-hin.mjs --self-test`, or `sensitivity.mjs --self-test`.

`src/reproduce.py` validates public export hashes and recomputes aggregates from sanitized scalar outcomes. It requires the accompanying `evidence/campaigns.json`, `evaluated-records.json`, `expected-aggregates.json`, and `export-provenance.json`; it does not use the private research archive. `src/grade-response.mjs` uses `benchmark/tasks.json` and caller-supplied private response/review files. MD07 additionally requires its restored full private oracle for exact regrading.

The TypeScript/TSX files in `src/app-snapshot/` are supplied for inspection. They are not a standalone application build. Their local dependencies are included where needed to inspect prompts, validators, types and deterministic data semantics; route excerpts are incomplete by design. JSX display files require a React transform/runtime (the frozen application declared React and React DOM 19.2.6, with Next 16.2.6). Framework packages, source databases, authentication code, private data-service bindings and deployment infrastructure are excluded. Do not treat installing these package versions as sufficient for an end-to-end rerun.

For an explicitly requested new exploratory API call, `src/collect-api.mjs` uses Node's built-in `fetch`. It defaults to loopback and dry-run. A real request requires the caller's own authorized CERRA session via environment, an existing deployment with its own model configuration, and an output path outside the publication directory. Remote execution requires HTTPS and explicit `--allow-remote`. API-only results cannot reproduce browser correctness, and a live provider alias or updated source snapshot may differ from the historical campaign.

The historical trial environment is distinct from this offline release environment. In particular, the paired local Qwen campaign and the Sol API extension used separate execution paths; the published results retain those contexts. No timing recorded by the offline reproduction script is benchmark inference latency.
