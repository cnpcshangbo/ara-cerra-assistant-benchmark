# Benchmark design review for Yaobang

This packet invites a domain and methods review of **how the 28 CERRA benchmark questions were designed and scored**. It is not a request to endorse the reported ranking. Human expert review has not yet been completed, and no message has been sent on the reviewer's behalf.

药邦您好：这里整理了原始问题、固定上下文、评分标准和逐题反馈表。建议先不看模型分数，独立判断问题应如何理解，再核对答案和判分边界。请把建议写入反馈表；已有历史结果保持冻结，后续修订单独形成新版测试。

## Suggested reading sequence

1. [Questions first](questions-first.md): all original prompts, starting context and fixed histories, without model outputs, scores or gold answers. Record your first-pass interpretation.
2. [Frozen task design and answer key](task-review.md): intended behavior, required evidence, exact actions, preserved controls, required versus optional caveats, and known ambiguities.
3. [Fillable CSV](checklist.csv) or [Markdown checklist](checklist.md): one row/card for each of the 28 tasks, plus suite-level comments. A first pass can prioritize MD01, MD04, MD05/MD06, MD15, MD17, RV02 and HIN11–HIN14.
4. [Machine-readable tasks](../benchmark/tasks.json), [scoring contract](../benchmark/scoring-contract.json), [source provenance](../benchmark/source-provenance.json), and the public code package: inspect exact constraints and implementation where needed. Read result tables only after recording design judgments.

## Questions we need your judgment on

- **Construct validity:** Does each question test an important transportation workflow, a model capability, an application rule, or a mixture? Are these distinctions explicit enough for a computer-science paper?
- **Clarity and reasonable alternatives:** Would an informed user naturally infer the frozen operation, granularity, scope and units? Which alternatives deserve acceptance?
- **Scientific evidence:** Are the expected values, source provenance, missingness caveats and limits on risk/causal claims appropriate? What cannot be verified without the retained private source snapshot?
- **State preservation:** Is exact partial-patch scoring reasonable? Should an ambiguous compound request cause whole-action clarification, or is a partial action sometimes acceptable? A different policy should be tested explicitly in a new version.
- **Coverage and exposure:** Are known examples and novel paraphrases correctly distinguished? Which important tasks, languages, contexts or failure modes are absent?
- **Adjudication:** Are required caveats truly required by the question? Which are optional? Would independent human raters agree?

## Decisions and audit issues to review

**MD01 — shared application defect.** The scope-reconciliation code reacts to “visible” without handling “outside the visible map.” A correct model plan can be overwritten. Final outputs cannot establish the original model plan, which was not retained. This is a system-level task and must not be interpreted as isolated model ability.

**MD04 — question/key granularity.** The frozen key expects annual rows, but “tabulate report totals for all years” permits a plausible all-years aggregate reading. A future question could explicitly request one row per year. Preserve the historical prompt and strict scores; label any new evaluation version separately.

**MD05/MD06 — operation contract.** Correct complete weather evidence routed through `breakdown` can fail the strict accepted-operation list. The secondary functional diagnostic allows a narrow operation-only exception; it is not the primary score and was not prospectively preregistered in the original campaign.

**MD17 — requested partial action versus policy.** The year is expressly requested; applying it before geographical clarification violates the chosen clarify-first policy. Do not describe the year value as unrequested or claim measured user harm.

**Exposed controls.** MD18 and HIN01 are exact UI/planner examples, HIN11 is an exact UI example, and MD16 is intercepted by an application preflight without a model call. All four are excluded from primary accuracy. HIN05 is a paraphrase of a displayed example, and HIN14 belongs to a planner-covered unsupported category; “novel wording” does not imply an unseen task family.

**Narrative review correction.** A September 24 review packet omitted original scoring notes. Reviewing unchanged answers with complete notes and anonymous historical calibration changed 15 of 24 judgments. Prior and corrected judgments are retained in the private audit archive. Later campaigns used the complete rubric. The work is identity-blind AI-assisted adjudication, not independent human validation, and not an inter-rater reliability study. Original campaigns lack exact reviewer-model metadata. This is a reason to review the rubric and answers independently, not to assume the corrected process proves correctness.

**Implementation limits.** Structural checks do not exhaustively verify every possible extra prose assertion. Some HIN deterministic-answer checks require exact template phrases, and the language check detects Chinese characters rather than judging fluency. Supplemental enforcement code was added after the first written freeze to enforce already-written identity/browser rules. Do not describe every implementation and review packet as externally preregistered without amendment.

## What is public, and what can be reproduced

All original question strings are preserved. Twenty-seven case objects are unchanged; MD07 is a documented privacy-reduced derivative. Its public token stands in for a selected crash record; local numeric ID, date, exact coordinates and other record-level fields are withheld. Weather-source semantics and graded `status`/`contributing` fields remain visible. The complete original manifest is identified by its own SHA-256; the public JSON has a different hash. See [the redaction ledger](../benchmark/derivative-provenance.json).

No raw crash/person/vehicle reports, database dumps, credentials or account sessions are included. Public source hashes establish snapshot identity, not independent source correctness. The retained HIN aggregates came from a separate calculation over application exports; this is computational independence from the evaluated path, not independent collection or validation of upstream extraction. Exact live inference replay requires the frozen application/data and, for MD07, an authorized private record binding. Public aggregate reconstruction and grader self-tests must not be presented as a full fresh inference rerun.

## How to return changes

Fill the checklist and provide a short suite-level recommendation. A file, commit or pull request is sufficient; a public issue is optional. Please avoid putting raw record details or credentials in feedback. For each proposed change, distinguish (a) wording, (b) expected behavior, (c) oracle correction, (d) grading implementation and (e) a new task. Identify the evidence and whether it affects interpretation of historical results.

The historical suite remains frozen. Accepted future changes require a version increment, new manifest/hash, explicit change log and a new pre-inference freeze. Do not retroactively tune the old key to improve a favored model's score. If a genuine historical adjudication error is corrected, retain prior grades and publish an additive correction with its effect on all affected configurations. A fresh held-out suite should be designed before inspecting outputs from the models it will compare.
