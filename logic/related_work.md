# Related work and dependencies

Full citation footprint of the manuscript. These role descriptions reproduce its stated technical relationship, not a claim of re-running the referenced benchmarks.

## RW01: Liang et al., Holistic Evaluation of Language Models (2023)
- **DOI**: https://openreview.net/forum?id=iO4LZibEqW
- **Type**: extends
- **Delta**: Multi-dimensional evaluation is applied to a bounded dashboard workflow, adding source scope and observed interface effects rather than reproducing HELM coverage.
- **Claims affected**: [C01, C02, C03]
- **Adopted elements**: Accuracy should be interpreted alongside other relevant dimensions.
- **Source**: `paper/source/main.tex`, Related Work and References.

## RW02: Liu et al., AgentBench (2024)
- **DOI**: https://arxiv.org/abs/2308.03688
- **Type**: extends
- **Delta**: Executable-environment evaluation is narrowed to application-defined operations and shared validation.
- **Claims affected**: [C01, C04]
- **Adopted elements**: Outcomes are assessed in a working environment.
- **Source**: `paper/source/main.tex`, Related Work and References.

## RW03: Zhou et al., WebArena (2024)
- **DOI**: https://arxiv.org/abs/2307.13854
- **Type**: extends
- **Delta**: Functional web outcomes motivate observed browser effects, but CERRA does not evaluate arbitrary autonomous navigation.
- **Claims affected**: [C01, C02]
- **Adopted elements**: Inspect resulting application state.
- **Source**: `paper/source/main.tex`, Related Work and References.

## RW04: Yao et al., τ-bench (2025)
- **DOI**: https://arxiv.org/abs/2406.12045
- **Type**: extends
- **Delta**: Domain constraints and repeated outcomes are retained using a fixed suite and directly observed all-repetition passes.
- **Claims affected**: [C02, C03]
- **Adopted elements**: Evaluate state and repeated task behavior; do not equate the reported count with a separately estimated reliability metric.
- **Source**: `paper/source/main.tex`, Related Work and References.

## RW05: Kapoor et al., AI Agents That Matter (2025)
- **DOI**: https://openreview.net/forum?id=Zy4uFzMviZ
- **Type**: imports
- **Delta**: The study separates practical configurations and reports latency without claiming measured monetary cost or broader causal agent-quality effects.
- **Claims affected**: [C03, C06]
- **Adopted elements**: Application-relevant comparisons and explicit evaluation conditions.
- **Source**: `paper/source/main.tex`, Related Work and References.

## RW06: Maryland Department of State Police, Interactive Data Dashboards
- **DOI**: https://mdsp.maryland.gov/safety-prevention/interactive-data-dashboards
- **Type**: imports
- **Delta**: Data-source background contextualizes retained snapshots; this study does not equate later live dashboard totals with frozen oracles.
- **Claims affected**: [C01, C04, C07]
- **Adopted elements**: Source provenance and reporting-system caveats.
- **Source**: `paper/source/main.tex`, Related Work and References.
