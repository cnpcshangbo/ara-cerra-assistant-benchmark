# CERRA analytical-assistant evaluation paper

Editable English computer-science manuscript draft, 29 September 2026.

This revision includes the completed, identity-blind reviewed, and verified
GPT-6.1 Sol API extension as a separate fifth campaign. It retains the original
local Qwen paired comparison and adds no cross-campaign paired estimate.

## Build

Set `main.tex` as the main document in Overleaf and compile with pdfLaTeX.
The package uses standard TeX Live packages. The local checked PDF was compiled
with Tectonic 0.15.0. The first-page ARA badge is required by the project and links
to the project-specific ARA at https://www.agenticresearch.sh/ara/cnpcshangbo/ara-cerra-assistant-benchmark.

## Included materials

- `main.tex`: complete draft and six references, using an editable `thebibliography`.
- `results-table.tex`: campaign-separated aggregate results.
- `task-inventory.tex`: 28 task descriptions (paraphrases, not the original prompts).
- `figures/paired-results.pdf`: vector scientific figure used by the manuscript.
- `figures/ara-badge.png`: first-page ARA badge.
- `aggregate-results.csv`, `paired-summary.json`, `provenance.json`, `data-provenance.json`: aggregate
  results and exact retained evidence identifiers; no raw inference traces.
- `make_figures.py`: regenerates the aggregate table and figure with Python,
  NumPy and Matplotlib. Run `python make_figures.py` in an extracted package.
  To rebuild the five-campaign package from the private original archive, use
  the command below, including the explicit API-extension option.

The package is self-contained for manuscript compilation and figure generation.
Full experimental reruns require the separately retained application, source
snapshots, authenticated services, model artifacts, frozen tasks and evaluators;
the manuscript package alone does not reproduce a fresh inference experiment.
The separate public artifact supplies exact question strings, scoring code,
sanitized per-attempt outcomes and offline aggregate reconstruction:
https://github.com/cnpcshangbo/ara-cerra-assistant-benchmark/tree/v0.1.0.
Its questions-first review packet documents the MD07 record redaction and other
replay boundaries. Expert review remains pending.

### Regenerating the five-campaign package

Archive regeneration includes the four original campaigns by default. The
September 29 API extension is complete and verified; retain it explicitly with:

```bash
python make_figures.py --from-archive --archive-root /path/to/research \
  --include-campaign gpt61-sol-benchmark-2026-09-29
```

The extension is opt-in: a pending run is never treated as a zero score or a
completed observation. Every selected campaign must have a complete verified
summary, matching manifest/summary hashes, all scheduled attempts, and no pending
primary or control narrative reviews before aggregate files are refreshed. Use
the same `--include-campaign` option on subsequent archive regenerations that
should retain this extension. Default figure regeneration reads the bundled
aggregates and preserves whichever completed campaigns the package contains.

Campaign folders and manifest hashes identify experiments; calendar dates only
label them. This keeps the September 29 API extension distinct from the September
29 local Qwen comparison. The Qwen figure and paired interval are always selected
by that pair's exact source manifest and summary hashes. Table totals and campaign
groups are derived from included observations, and refreshed provenance records
aggregate counts. Historical schema-v1 aggregate packages remain readable.

## Interpretation

Five completed campaigns contain ten unique configurations in eleven
configuration-campaign observations; Qwen3 14B was evaluated twice. The archive
retains 924 application attempts: 792 primary, 132 controls, 297 browser attempts,
and 627 API attempts, with 132 narrative reviews. The two September 29 campaigns
have distinct manifests and execution conditions. Keep historical production
measurements separate from the contemporaneous local pair and the API extension.
Primary scores use 72 attempts,
controls use 12, supported UI actions use 15, and primary browser state checks use
21 per observation. UI-state violations count actual value changes against the
frozen task policy; an explicitly requested change can violate that policy when
applied before required clarification. No user-harm outcome was measured.

The September 29 API extension uses a frozen local application and an OpenAI API
route, with model settings and timing boundaries documented in its own manifest.
It explicitly selects medium reasoning effort, an 8,192-token combined reasoning
and visible-output budget, a 60-second model-call timeout, disabled storage, and
the regional US Responses endpoint. Temperature is not supplied; planner output
remains a JSON object. The provider model name `gpt-6.1-sol` is an alias, not an
immutable weight snapshot. Existing answer-length prompts remain unchanged.
It is not a contemporaneous pair with historical production configurations or
the local Ollama models. Shared tasks do not establish matched execution
conditions or justify paired superiority or direct latency rankings across
these campaigns. The generator adds no cross-campaign paired effect.

GPT-6.1 Sol records 64/72 strict successes (88.9%; marginal 95% task-cluster
interval 76.4%–100%), 21/24 tasks passing all three repetitions, 15/15 supported
filter actions, and no UI-state violations in 21 primary browser attempts.
Median/P90 request latency is 2.15/4.88 seconds on its own route. All 84 HTTP
responses succeeded; eight primary attempts nevertheless failed the task rubric.
Failures were MD01 (three), MD04 (three), and MD09 (two). All twelve narrative
reviews and twelve controls passed; the functional sensitivity remains 64/72.

MD01 is not a model-only error: the frozen shared scope-reconciliation rule
matches `visible` without negation/exclusion handling and can overwrite filtered
scope with viewport scope for “outside the visible map.” Raw planner intermediates
are absent, so individual model contributions cannot be separated. MD04 retains
the acknowledged prompt/annual-row granularity ambiguity and unchanged scoring.

The original narrative judgments are AI-assisted rather than expert validation.
The draft discloses the review correction and post-freeze enforcement audit.
Author order, affiliations, funding/acknowledgments, and target venue are pending.
This is a public working draft, not a submitted or peer-reviewed paper.
The manuscript and its scientific figures retain author rights; the code and
review materials in the separate artifact are MIT-licensed.

No account credentials, service tokens, account databases, private research logs,
or raw inference answers are included. The public artifact releases sanitized
scalar outcomes, not raw trial traces. Public PDF and scientific evidence images
are versioned in the dedicated artifact repository; private research archives
remain outside its history.
