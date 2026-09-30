# Figure 1: Evaluation boundary
- **Source**: Working draft Figure 1, page 4, PDF SHA-256 `cbb6d45e6e6dbf9619527b16a530af897a9d0534a6515dd872fb55eaf9460217`; corresponding editable source `paper/source/main.tex`, Figure label `fig:system`.
- **Caption**: Evaluation boundary. The configured assistant includes the model, shared application logic, data operations, and browser effects. The oracle is available to the evaluator, not provided to the evaluated model. Some refusal controls terminate in shared prechecks.
- **Screenshot**: [figure1.png](figure1.png)
- **Figure type**: diagram
- **Extraction method**: visual_description
- **Reading confidence**: high
- **Supports**: C01, C04, C06

## Visual description
A top-row directed pipeline connects Question / UI state + history → Precheck + model planner → Validation / internal repair → Source query / answer / narration → Browser action / final UI state. Below, a Frozen independent oracle (scope, evidence, propositions, state) feeds an External evaluator that compares outcomes with that oracle. Dashed arrows bring validated output and browser state to the evaluator. The oracle is not an input to the evaluated assistant. This diagram locates the evaluated system boundary; it presents no numerical measurements.
