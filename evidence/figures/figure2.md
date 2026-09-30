# Figure 2: Contemporaneous local comparison
- **Source**: Working draft Figure 2, page 8, PDF SHA-256 `cbb6d45e6e6dbf9619527b16a530af897a9d0534a6515dd872fb55eaf9460217`; `paper/source/figures/paired-results.pdf`, `paper/source/aggregate-results.csv` and `paper/source/paired-summary.json`.
- **Caption**: September 29 contemporaneous local comparison. Left: strict primary success with 95% task-cluster bootstrap intervals. Right: median and P90 request latency over all 72 primary attempts per configuration. The paired success difference is 19.4 points [1.4, 38.9]. Historical production latency is not included in this figure.
- **Screenshot**: [figure2.png](figure2.png)
- **Figure type**: quantitative_plot
- **Extraction method**: exact_from_labels
- **Reading confidence**: high
- **Axes**: Left: categorical model on X; primary attempts passed (%) on Y, linear. Right: categorical model on X; request time in seconds on Y, linear. Accuracy error bars are 95% task-cluster intervals. Latency bars distinguish median and P90.
- **Supports**: C02, C03

| Configuration | Primary passes | Strict success | CI from aggregate source (%) | Median (s) | P90 (s) | UI-state violations |
|---|---:|---:|---:|---:|---:|---:|
| Qwen3 14B | 49/72 | 68.1% | 50.0–84.7 | 3.77 | 7.20 | 3/21 |
| Qwen3.8 27B Q4_K_M | 63/72 | 87.5% | 75.0–100.0 | 14.50 | 29.81 | 0/21 |

## Trend summary
The newer, larger configuration increases strict success and has no observed state violations on this small browser subset; request latency also increases. Plot subtitle: “Qwen3.8 − Qwen3: +19.44 pp; paired 95% task-cluster CI [+1.39, +38.89]”. Values above preserve the displayed rounding; exact machine values remain in the CSV and paired-summary JSON. The figure explicitly retains failed primary attempts, excludes controls, includes loading and retries, and notes shared GPU use and observed CPU offload. Historical production and the separate API extension are absent from this paired figure.
