# CERRA Assistant Benchmark

A reviewable research artifact for **Beyond Answer Accuracy: Evaluating Source-Grounded Language-Model Assistants in Interactive Transportation Analytics**. Review release **v0.1.0**, 29 September 2026. The manuscript is a working draft; author names/order and venue are unconfirmed. Human expert review is pending.

**Start here:** [Benchmark design review](review/README.md) · [28 original questions, without scores](review/questions-first.md) · [Fillable feedback CSV](review/checklist.csv) · [Paper PDF](paper/CERRA-assistant-evaluation-draft.pdf)

[ARA Hub](https://www.agenticresearch.sh/ara/cnpcshangbo/ara-cerra-assistant-benchmark) · [Interactive research trajectory](https://www.agenticresearch.sh/raw/cnpcshangbo/ara-cerra-assistant-benchmark/trajectory.html) · [Frozen release](https://github.com/cnpcshangbo/ara-cerra-assistant-benchmark/tree/v0.1.0)

## Review the question design

1. Read [questions and starting state](review/questions-first.md) before looking at answers or model scores. Record your interpretation of scope, granularity, actions and necessary caveats.
2. Compare with the [frozen answer key and grading rules](review/task-review.md), including task-specific ambiguity and source limitations.
3. Fill [the CSV](review/checklist.csv) or [Markdown worksheet](review/checklist.md). The [review guide](review/README.md) explains priority questions, how to propose changes and how historical scores are preserved.
4. Inspect [machine-readable tasks](benchmark/tasks.json), [scoring contract](benchmark/scoring-contract.json), [code](src/README.md) and [results](evidence/README.md) after recording design judgments.

An [English handoff note](review/forwarding-note.md) is ready to copy and send to Yaobang. No invitation or message has been sent. A file, commit or pull request is sufficient feedback; opening a public issue is optional.

## Study and interpretation

The frozen suite contains **24 primary tasks and four exposed/application controls**, repeated three times per configuration. Five campaigns cover ten distinct configurations and eleven configuration–campaign observations: **924 application attempts, 792 primary attempts, 132 controls, 297 browser attempts, and 132 AI-assisted narrative reviews**. The unit of evaluation is the configured assistant, including its application pipeline.

The contemporaneous local Qwen pair records 49/72 versus 63/72 strict successes, a 19.4 percentage-point difference (95% task-cluster bootstrap interval 1.4–38.9), with median latency rising from 3.77 to 14.50 seconds. A separate GPT-6.1 Sol extension records 64/72 and a 2.15-second median on its own API route. Shared tasks do not make these distinct campaigns a controlled cross-model comparison.

Known issues include the shared MD01 scope-reconciliation defect, an implicit annual-row requirement in MD04, operation-only sensitivity in MD05/MD06, and MD17's clarify-first policy. A corrected narrative review packet changed 15/24 earlier judgments on unchanged answers. Controls exposed in prompts or UI are excluded from primary accuracy. Read the [review guide](review/README.md) and [bounded ARA claims](PAPER.md) before drawing conclusions.

## Run the public checks

Python 3.10+ and Node.js 20+; no account, API key, network call or third-party Python/Node package is needed:

```sh
python3 src/reproduce.py
python3 src/test_reproduce.py
node src/self-test.mjs
```

These checks recompute published statistics from sanitized scalar outcomes, verify public-file hashes and exercise frozen grading rules. They **do not independently rejudge undisclosed model responses or reproduce the original browser experiments**. See [the implementation and replay boundaries](src/README.md). The optional API collector is an exploratory tool for your own authorized CERRA deployment.

## Public scope and provenance

All 28 original question strings are preserved; 27 task objects match the frozen manifest. MD07's selected crash record has a stable placeholder, with row-level identifier, precise location and other individual fields withheld. Its source and public derivative have distinct hashes in the [redaction ledger](benchmark/derivative-provenance.json). Exact replay needs authorized source data and a private record binding.

The package contains grading/recomputation code, selected prompt/validator snapshots, aggregate and per-attempt scalar outcomes, review worksheets, the paper source/PDF, and a scoped ARA. It excludes raw crash/person/vehicle datasets, database dumps, raw answers and browser traces, credentials, account/session code, and private operational research logs. The production application remains private and access-controlled. Source hashes establish snapshot identity, not independent validation of upstream extraction.

The [exploration trace](trace/exploration_tree.yaml) is explicitly compiled post hoc from retained evidence. Its selected nodes are not a verbatim contemporaneous log or the complete private research history. [Figure and table evidence](evidence/README.md) preserves the scientific source regions and transcriptions. Open `trajectory.html` locally for the same interactive viewer.

## Versioning, citation and rights

Historical prompts, outcomes and strict scores remain frozen. Accepted question/rubric changes require a new suite version, manifest and pre-inference freeze. Corrections must retain prior judgments and describe their effect on every affected configuration. No human review, fresh held-out validation or causal model-generation result is claimed.

Cite the tagged [v0.1.0 release](https://github.com/cnpcshangbo/ara-cerra-assistant-benchmark/tree/v0.1.0); a provisional [BibTeX entry](CITATION.bib) is included without inventing authorship.

Original evaluation code and review/ARA documentation are available under the [MIT License](LICENSE). **The manuscript and scientific figure/table content** in `paper/` and their reproduced evidence regions/transcriptions retain their authors' rights and are made available for reading and review; they are not licensed by this repository's MIT grant. `paper/source/make_figures.py` is code and is MIT-licensed. Third-party assets retain their stated licenses; see [third-party notices](THIRD_PARTY_NOTICES.md). Source datasets and model weights are not redistributed and retain their own terms.
