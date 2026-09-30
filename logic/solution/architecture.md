# Evaluation architecture

## Request and planner
Inputs are the question, current UI context and canonical history. Shared prechecks can refuse before inference. Otherwise the model chooses constrained operations. The evaluator's task identifiers, scoring notes and oracle are not sent to the model. This is the boundary behind C01 and C06.

## Validation and internal repair
The application validates and reconciles plans; normal internal repair may make multiple model calls. Those calls remain within a single application attempt. The scope reconciliation branch can match a visibility keyword even under negation or exclusion; final scope alone cannot reveal the original model plan. See C04 and the code pointers in `src/artifacts.md`.

## Source query and answer
Deterministic application operations query retained source products and build evidence. HIN tasks may add generated narration. Correct numbers can result from correct routing to deterministic computation and do not prove model arithmetic.

## Browser action and final state
Supported actions update interface controls. Browser cases record resulting controls and compare them with permitted effects, including preservation of unrelated state. A clarification or unsupported action requires the frozen state policy. C02 distinguishes a strict field mismatch from an observed value change.

## External evaluator and independent oracle
The oracle fixes expected operation, scope, evidence, propositions and state independently of each evaluated response. The external grader combines structure and narrative decisions, while browser evidence checks actual effects. Figure 1 preserves the component graph and connections. Public reproduction computes results from sanitized evaluated outcomes; it does not claim to regenerate private raw inference records.
