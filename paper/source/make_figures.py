#!/usr/bin/env python3
"""Generate paper figures/table from the self-contained aggregate package.

Default: python make_figures.py (requires matplotlib and numpy).
Archive regeneration: python make_figures.py --from-archive --archive-root DIR
The optional archive mode validates completed campaign summaries and refreshes
the safe CSV/JSON package. No trial logs or model credentials are read.
"""
from __future__ import annotations

import argparse
import csv
import hashlib
import json
import re
from datetime import date as calendar_date
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np

HERE = Path(__file__).resolve().parent
RESEARCH = HERE.parent.parent
CAMPAIGNS = [
    ("2026-09-18", "Production site", "transportation-model-benchmark-2026-09-18"),
    ("2026-09-23", "Production site", "transportation-gpt-benchmark-2026-09-23"),
    ("2026-09-24", "Production site", "local-model-benchmark-2026-09-24"),
    ("2026-09-29", "Paired local", "qwen-newer-benchmark-2026-09-29"),
]
PAIRED_CAMPAIGN_ID = "qwen-newer-benchmark-2026-09-29"
OPTIONAL_CAMPAIGNS = {
    "gpt61-sol-benchmark-2026-09-29": (
        "2026-09-29", "Frozen local app / API", "gpt61-sol-benchmark-2026-09-29"
    ),
}
CAMPAIGN_LABELS = {
    "gpt61-sol-benchmark-2026-09-29": "September 29 API extension",
}
LABELS = {
    "qwen3-8b": "Qwen3 8B",
    "llama3.1-8b": "Llama 3.1 8B",
    "gemma3-4b": "Gemma 3 4B",
    "openai-gpt-4.1-mini": "GPT-4.1 mini",
    "openai-gpt-5.4-mini": "GPT-5.4 mini",
    "openai-gpt-5.4": "GPT-5.4",
    "openai-gpt-6.1-sol": "GPT-6.1 Sol",
    "qwen3-14b": "Qwen3 14B",
    "gemma4-12b": "Gemma 4 12B",
    "qwen3.8-27b": "Qwen3.8 27B Q4_K_M",
}


def sha256(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def load_archive_results(archive_root, include_campaigns=()):
    rows, summaries, campaigns = [], {}, []
    selected = CAMPAIGNS + [OPTIONAL_CAMPAIGNS[name] for name in dict.fromkeys(include_campaigns)]
    for date, execution, folder in selected:
        root = archive_root / folder
        summary_bytes = (root / "summary.json").read_bytes()
        summary = json.loads(summary_bytes)
        verify = json.loads((root / "verification.json").read_text())
        manifest_bytes = (root / "manifest.json").read_bytes()
        manifest = json.loads(manifest_bytes)
        manifest_hash = hashlib.sha256(manifest_bytes).hexdigest()
        assert summary["complete"] is True, f"Incomplete summary: {folder}"
        assert verify.get("complete", verify.get("allPassed")) is True, folder
        assert not verify.get("problems", []), f"Verification problems: {folder}"
        assert summary["manifestSha256"] == manifest_hash, folder
        expected_hash = verify.get("inputSha256", {}).get("summary.json")
        if expected_hash:
            assert hashlib.sha256(summary_bytes).hexdigest() == expected_hash, folder
        assert summary["trialCount"] == summary["expectedTrials"] == len(manifest["models"]) * 84
        assert summary["primaryCaseCount"] == 24 and summary["caseCount"] == 28
        assert manifest["repetitions"] == 3, folder
        assert len(set(manifest["models"])) == len(manifest["models"]), folder
        assert set(manifest["models"]) == set(summary["models"]), folder
        summaries[folder] = summary
        audit_files = ["verification.json", "grader-audit.md", "audit-rules.md", "grader-parity.json", "review-method.md", "review-correction.json", "deployment-provenance.json", "failure-audit.md", "runtime-default-audit.md", "oracle-parity.json", "application-parity.json", "freeze-receipt.json", "model-resolution.json", "structural-failure-audit.json"]
        campaigns.append({
            "campaign_id": folder,
            "campaign_label": CAMPAIGN_LABELS.get(folder, f"{date} / {execution}"),
            "local_date": date,
            "execution_path": execution,
            "manifest_sha256": manifest_hash,
            "summary_sha256": hashlib.sha256(summary_bytes).hexdigest(),
            "summary_complete": True,
            "verification_passed": True,
            "scheduled_application_attempts": summary["trialCount"],
            "primary_attempts": len(manifest["models"]) * 72,
            "control_attempts": len(manifest["models"]) * 12,
            "browser_attempts": len(manifest["models"]) * 27,
            "api_attempts": len(manifest["models"]) * 57,
            "narrative_review_records": len(manifest["models"]) * 12,
            "run_window_utc": summary["runWindow"],
            "model_ids": manifest["models"],
            "final_audit_inventory": [{"record": name, "sha256": sha256(root / name)} for name in audit_files if (root / name).is_file()],
        })
        for model_id in manifest["models"]:
            model = summary["models"][model_id]
            primary = model["primary"]
            controls = model["controls"]
            filters = model["byCategory"]["UI filter changes"]
            assert primary["attempts"] == 72 and controls["attempts"] == 12
            assert primary["pendingNarrative"] == 0
            assert controls["pendingNarrative"] == 0
            assert model["byMode"]["browser"]["attempts"] == 21
            rows.append({
                "campaign_id": folder,
                "campaign_local_date": date,
                "execution_path": execution,
                "model_id": model_id,
                "configuration": LABELS[model_id],
                "primary_passed": primary["passed"],
                "primary_attempts": primary["attempts"],
                "strict_success_fraction": primary["score"],
                "task_cluster_95ci_low_fraction": model["taskCluster95CI"][0],
                "task_cluster_95ci_high_fraction": model["taskCluster95CI"][1],
                "request_median_seconds": primary["medianSeconds"],
                "request_p90_seconds": primary["p90Seconds"],
                "supported_filter_passed": filters["passed"],
                "supported_filter_attempts": filters["attempts"],
                "unintended_ui_mutations": primary["unintendedMutations"],
                "primary_browser_attempts": model["byMode"]["browser"]["attempts"],
                "functional_sensitivity_passed": summary["sensitivity"][model_id]["passed"],
                "control_passed": controls["passed"],
                "control_attempts": controls["attempts"],
                "tasks_passing_all_three": model["allThreePassedCases"],
                "primary_http_200": primary["http200"],
                "manifest_sha256": manifest_hash,
            })
    validate_campaign_rows(rows, campaigns)
    return rows, summaries, campaigns


def campaign_for_row(row, campaigns):
    """A date is display metadata, never an experiment identifier."""
    matches = [item for item in campaigns if item["manifest_sha256"] == row["manifest_sha256"]]
    assert len(matches) == 1, f"Missing or ambiguous campaign manifest: {row['manifest_sha256']}"
    campaign = matches[0]
    if "campaign_id" in row:
        assert row["campaign_id"] == campaign["campaign_id"]
    assert row["campaign_local_date"] == campaign["local_date"]
    assert row["execution_path"] == campaign["execution_path"]
    return campaign


def aggregate_counts(rows, campaigns):
    return {
        "campaigns": len(campaigns),
        "configuration_campaign_observations": len(rows),
        "unique_configurations": len({row["model_id"] for row in rows}),
        **{
            key: sum(campaign[key] for campaign in campaigns)
            for key in ["scheduled_application_attempts", "primary_attempts", "control_attempts", "browser_attempts", "api_attempts", "narrative_review_records"]
        },
    }


def validate_campaign_rows(rows, campaigns):
    assert rows and campaigns, "No completed campaign results"
    manifests = [campaign["manifest_sha256"] for campaign in campaigns]
    assert len(manifests) == len(set(manifests)), "Duplicate campaign manifest"
    identifiers = [campaign.get("campaign_id", campaign["manifest_sha256"]) for campaign in campaigns]
    assert len(identifiers) == len(set(identifiers)), "Duplicate campaign identifier"
    observations = [(row["manifest_sha256"], row["model_id"]) for row in rows]
    assert len(observations) == len(set(observations)), "Duplicate configuration-campaign observation"
    for row in rows:
        campaign_for_row(row, campaigns)
        assert row["primary_attempts"] == 72 and row["control_attempts"] == 12
        assert row["primary_browser_attempts"] == 21 and row["supported_filter_attempts"] == 15
        assert abs(row["strict_success_fraction"] - row["primary_passed"] / row["primary_attempts"]) < 1e-12
    for campaign in campaigns:
        members = [row for row in rows if row["manifest_sha256"] == campaign["manifest_sha256"]]
        assert set(campaign["model_ids"]) == {row["model_id"] for row in members}
        count = len(members)
        for field, per_model in {"scheduled_application_attempts": 84, "primary_attempts": 72, "control_attempts": 12, "browser_attempts": 27, "api_attempts": 57, "narrative_review_records": 12}.items():
            assert campaign[field] == count * per_model, f"Campaign count mismatch: {field}"


def rows_for_pair(rows, paired):
    """Select the frozen Qwen pair by source manifest, including for old v1 packages."""
    matches = [row for row in rows if row["manifest_sha256"] == paired["source_manifest_sha256"]]
    expected_ids = [paired["baseline_model_id"], paired["newer_model_id"]]
    assert len(matches) == 2 and {row["model_id"] for row in matches} == set(expected_ids)
    if "campaign_id" in paired:
        assert all(row["campaign_id"] == paired["campaign_id"] for row in matches)
    assert all(row["campaign_local_date"] == paired["campaign_local_date"] for row in matches)
    return {row["model_id"]: row for row in matches}


def package_model_inventory(archive_root, rows):
    """Allowlist artifact metadata; never copy source paths or raw inventories."""
    original = json.loads((archive_root / "transportation-model-benchmark-2026-09-18" / "metadata.json").read_text())
    extension = json.loads((archive_root / "local-model-benchmark-2026-09-24" / "model-artifacts.json").read_text())
    paired = json.loads((archive_root / PAIRED_CAMPAIGN_ID / "model-artifacts-before.json").read_text())
    packages = {item["name"]: item for item in original["models"]["ollama"] + extension["models"] + paired["models"]}
    tags = {"llama3.1-8b": "llama3.1:8b", "gemma3-4b": "gemma3:4b", "qwen3-14b": "qwen3:14b", "gemma4-12b": "gemma4:12b", "qwen3.8-27b": "qwen3.8:27b-q4_K_M"}
    output = []
    for model_id in dict.fromkeys(row["model_id"] for row in rows):
        observations = [row for row in rows if row["model_id"] == model_id]
        record = {"model_id": model_id, "configuration": LABELS[model_id], "campaign_local_dates": list(dict.fromkeys(row["campaign_local_date"] for row in observations)), "campaign_ids": [row["campaign_id"] for row in observations], "campaign_manifest_sha256": [row["manifest_sha256"] for row in observations]}
        if model_id in tags:
            item = packages[tags[model_id]]
            assert re.fullmatch(r"[0-9a-f]{64}", item["digest"])
            record.update({"engine": "Ollama", "tested_tag": tags[model_id], "package_manifest_digest_sha256": item["digest"], "reported_parameter_size": item["details"]["parameter_size"], "quantization": item["details"]["quantization_level"]})
        elif model_id == "qwen3-8b":
            item = original["models"]["qwen"]
            revisions = sorted(set(re.findall(r"(?<![a-f0-9])[a-f0-9]{40}(?![a-f0-9])", json.dumps(item["qwenSnapshot"]))))
            assert len(revisions) == 1
            record.update({"engine": "Transformers", "repository": "Qwen/Qwen3-8B", "recorded_snapshot_revision": revisions[0], "precision": item["precision"], "package_manifest_digest_sha256": None, "identity_note": "Recorded source snapshot revision, not an Ollama package digest."})
        elif model_id.startswith("openai-"):
            record.update({"engine": "OpenAI Responses API", "tested_alias": model_id.removeprefix("openai-"), "package_manifest_digest_sha256": None, "identity_note": "Provider alias; no immutable weight snapshot or package digest was recorded."})
            if model_id == "openai-gpt-6.1-sol":
                manifest = json.loads((archive_root / "gpt61-sol-benchmark-2026-09-29" / "manifest.json").read_text())
                config = manifest["modelConfiguration"][model_id]
                record["frozen_runtime_settings"] = {
                    "reasoning_effort": config["reasoningEffort"],
                    "combined_reasoning_output_token_budget": config["maxOutputTokens"],
                    "model_call_timeout_seconds": config["modelTimeoutSeconds"],
                    "store": config["store"],
                    "temperature_parameter": config["temperature"],
                    "json_object_planner": config["jsonPlanner"],
                    "provider_endpoint": config["providerEndpoint"],
                }
        else:
            raise ValueError(f"No allowlisted model artifact metadata for {model_id}")
        output.append(record)
    return output


def write_safe_package(rows, summaries, campaigns, archive_root):
    paired = summaries[PAIRED_CAMPAIGN_ID]
    paired_campaign = next(item for item in campaigns if item["campaign_id"] == PAIRED_CAMPAIGN_ID)
    safe_pair = {
        "schema_version": 2, "complete": True,
        "campaign_id": PAIRED_CAMPAIGN_ID,
        "campaign_local_date": paired_campaign["local_date"],
        "baseline_model_id": "qwen3-14b", "newer_model_id": "qwen3.8-27b",
        "primary_tasks": 24, "repetitions": 3, "primary_attempts_per_model": 72,
        "control_attempts_per_model": 12, "primary_browser_attempts_per_model": 21,
        "pairedDifferences": paired["pairedDifferences"],
        "bootstrap": {"method": "paired task-cluster percentile", "resamples": 10000, "seed": 20260918, "confidence": 0.95},
        "difference_convention": "Each record is model a minus model b; the plot reverses baseline-minus-newer to newer-minus-baseline.",
        "source_manifest_sha256": paired_campaign["manifest_sha256"],
        "source_summary_sha256": paired_campaign["summary_sha256"],
    }
    rows_for_pair(rows, safe_pair)
    provenance = {
        "schema_version": 2,
        "scope": "Publication-safe aggregate provenance. Original audit records are retained separately; their contents are not bundled here.",
        "campaigns": campaigns,
        "aggregate_counts": aggregate_counts(rows, campaigns),
        "tested_model_artifacts": package_model_inventory(archive_root, rows),
        "metric_definition": {
            "ui_state_violations": "Actual UI value changes violating the frozen task policy, among 21 primary browser attempts per observation; redundant unchanged fields are excluded. A requested partial change applied before required clarification can violate this policy.",
            "csv_historical_field_name": "unintended_ui_mutations",
            "field_name_note": "The historical CSV key is preserved for traceability; the manuscript reports this metric as UI-state violations, without inferring user harm or claiming that every changed value was unrequested in isolation.",
        },
        "audit_notes": [
            "The September 18 written rubric was frozen before inference. Later aggregation enforces its existing identity and browser requirements; original and protocol grades were retained.",
            "Functional equivalence was a post-hoc diagnostic in the initial campaign and inherited by subsequent campaigns.",
            "The September 24 final review restored omitted original scoring notes and historical anonymous calibration; 15 of 24 decisions changed without changing answers or oracles. Initial records were retained.",
            "September 24 deployment provenance corrects an initial v50 lookup to v51/v52 using the same deployment archive and environment revision.",
            "The September 24 machine-readable source receipt was captured approximately 2.3 seconds after the first attempt; an independent pre-run source audit also exists.",
            "The September 29 failure audit preserves strict scoring and identifies MD04 grouping ambiguity. Frozen scope-reconciliation code matches 'visible' without negation or exclusion handling and forces viewport for plans reaching that branch, including the MD01 'outside the visible map' question. Raw planner intermediates were not retained, so each model's additional contribution is not isolated; MD01 is not a model-only failure.",
            "September 29 runtime audit infers speculative decoding was disabled; it was not explicitly configured or measured per trial.",
            "Narrative assessments are identity-blind, AI-assisted single-reviewer judgments, not human expert validation.",
        ],
        "generator_sha256": sha256(Path(__file__)),
    }
    if any(item["campaign_id"] == "gpt61-sol-benchmark-2026-09-29" for item in campaigns):
        provenance["audit_notes"].append("The September 29 API extension evaluates GPT-6.1 Sol through a frozen local application and regional API route. It is a separate campaign, not a contemporaneous paired comparison with earlier production or local Ollama configurations.")
    # Validate every selected campaign and allowlisted metadata before refreshing any aggregate file.
    write_csv(rows)
    (HERE / "paired-summary.json").write_text(json.dumps(safe_pair, indent=2) + "\n")
    provenance["package_inputs_sha256"] = {name: sha256(HERE / name) for name in ["aggregate-results.csv", "paired-summary.json"]}
    (HERE / "provenance.json").write_text(json.dumps(provenance, indent=2) + "\n")
    return safe_pair


def load_package_results():
    """Default path reads only allowlisted aggregate files beside this script."""
    provenance = json.loads((HERE / "provenance.json").read_text())
    for name in ["aggregate-results.csv", "paired-summary.json"]:
        assert sha256(HERE / name) == provenance["package_inputs_sha256"][name], f"Package input hash mismatch: {name}"
    paired = json.loads((HERE / "paired-summary.json").read_text())
    assert paired["complete"] is True
    int_fields = {"primary_passed", "primary_attempts", "supported_filter_passed", "supported_filter_attempts", "unintended_ui_mutations", "primary_browser_attempts", "functional_sensitivity_passed", "control_passed", "control_attempts", "tasks_passing_all_three", "primary_http_200"}
    float_fields = {"strict_success_fraction", "task_cluster_95ci_low_fraction", "task_cluster_95ci_high_fraction", "request_median_seconds", "request_p90_seconds"}
    with (HERE / "aggregate-results.csv").open(newline="") as stream:
        rows = [{key: int(value) if key in int_fields else float(value) if key in float_fields else value for key, value in row.items()} for row in csv.DictReader(stream)]
    validate_campaign_rows(rows, provenance["campaigns"])
    if "aggregate_counts" in provenance:
        assert provenance["aggregate_counts"] == aggregate_counts(rows, provenance["campaigns"])
    pair_rows = rows_for_pair(rows, paired)
    for effect in paired["pairedDifferences"]:
        expected = pair_rows[effect["a"]]["strict_success_fraction"] - pair_rows[effect["b"]]["strict_success_fraction"]
        assert abs(effect["difference"] - expected) < 1e-12
    pair_campaign = next(item for item in provenance["campaigns"] if item["manifest_sha256"] == paired["source_manifest_sha256"])
    assert paired["source_summary_sha256"] == pair_campaign["summary_sha256"]
    if "campaign_id" in paired:
        assert paired["campaign_id"] == pair_campaign["campaign_id"]
    return rows, paired


def write_csv(rows):
    with (HERE / "aggregate-results.csv").open("w", newline="") as stream:
        writer = csv.DictWriter(stream, fieldnames=list(rows[0]))
        writer.writeheader()
        writer.writerows(rows)


def write_table(rows):
    campaign_count = len({row["manifest_sha256"] for row in rows})
    configuration_count = len({row["model_id"] for row in rows})
    extension_note = ""
    if any(row.get("campaign_id") == "gpt61-sol-benchmark-2026-09-29" for row in rows):
        extension_note = " Campaigns that share a date remain separate experiments; the API extension is not part of this Qwen pair."
    lines = [
        f"% Generated by make_figures.py from {campaign_count} verified campaign summaries.",
        "% Requires graphicx and booktabs; intended for a two-column manuscript.",
        r"\begin{table*}[t]",
        r"\centering",
        r"\caption{" + f"{len(rows)} observations from {configuration_count} CERRA assistant configurations across {campaign_count} campaigns. " + r"Strict and functional scores use 72 primary attempts per observation; controls are excluded. Intervals are 95\% task-cluster bootstrap intervals. Request latency retains failed primary attempts. Runtime paths and dates differ between campaigns.}",
        r"\label{tab:all-results}",
        r"\small",
        r"\setlength{\tabcolsep}{5pt}",
        r"\resizebox{\textwidth}{!}{%",
        r"\begin{tabular}{@{}lrrrrrrr@{}}",
        r"\toprule",
        r"Configuration & Strict success & 95\% CI & Median (s) & P90 (s) & UI actions & UI-state violations & Functional \\",
        r"\midrule",
    ]
    last_campaign = None
    for row in rows:
        campaign_key = (row["manifest_sha256"], row["campaign_local_date"], row["execution_path"])
        if campaign_key != last_campaign:
            if last_campaign is not None:
                lines.append(r"\addlinespace[4pt]")
            last_campaign = campaign_key
            date = calendar_date.fromisoformat(row["campaign_local_date"])
            date_label = f"{date:%B} {date.day}, {date.year}"
            campaign_label = CAMPAIGN_LABELS.get(row.get("campaign_id"), date_label)
            lines.append(r"\multicolumn{8}{@{}l}{\textit{" + campaign_label + " --- " + row["execution_path"] + r"}} \\")
        label = row["configuration"].replace("_", r"\_")
        low, high = 100 * row["task_cluster_95ci_low_fraction"], 100 * row["task_cluster_95ci_high_fraction"]
        fields = [
            label,
            f"{row['primary_passed']}/72 ({100 * row['strict_success_fraction']:.1f}\\%)",
            f"{low:.1f}--{high:.1f}",
            f"{row['request_median_seconds']:.2f}",
            f"{row['request_p90_seconds']:.2f}",
            f"{row['supported_filter_passed']}/15",
            f"{row['unintended_ui_mutations']}/21",
            f"{row['functional_sensitivity_passed']}/72",
        ]
        lines.append(" & ".join(fields) + r" \\")
    lines += [
        r"\bottomrule",
        r"\end{tabular}}",
        r"\par\vspace{3pt}",
        r"\begin{minipage}{\textwidth}\footnotesize",
        r"UI actions: supported filter changes. UI-state violations: actual value changes violating the frozen task policy among 21 primary browser attempts; redundant unchanged fields are excluded. Functional equivalence was a post-hoc diagnostic in the initial campaign, inherited by later campaigns; it does not replace strict success. The September 29 paired-local baseline is the contemporaneous Qwen3 14B rerun." + extension_note,
        r"\end{minipage}",
        r"\end{table*}",
        "",
    ]
    (HERE / "results-table.tex").write_text("\n".join(lines))


def plot_paired(rows, summary):
    ordered_ids = [summary["baseline_model_id"], summary["newer_model_id"]]
    pair_by_model = rows_for_pair(rows, summary)
    pair_rows = [pair_by_model[model_id] for model_id in ordered_ids]
    pair = next(item for item in summary["pairedDifferences"] if {item["a"], item["b"]} == set(ordered_ids))
    if pair["a"] == summary["newer_model_id"]:
        difference, interval = pair["difference"], pair["taskCluster95CI"]
    else:
        difference = -pair["difference"]
        interval = [-pair["taskCluster95CI"][1], -pair["taskCluster95CI"][0]]
    plt.rcParams.update({
        "font.family": "DejaVu Sans", "font.size": 9,
        "axes.titlesize": 10, "axes.labelsize": 9,
        "xtick.labelsize": 9, "ytick.labelsize": 8,
        "pdf.fonttype": 42, "ps.fonttype": 42,
        "axes.spines.top": False, "axes.spines.right": False,
        "savefig.facecolor": "white",
    })
    fig, axes = plt.subplots(1, 2, figsize=(7.2, 4.0))
    fig.subplots_adjust(left=.075, right=.985, bottom=.27, top=.78, wspace=.35)
    x = np.arange(2)
    labels = ["Qwen3 14B", "Qwen3.8 27B\nQ4_K_M"]
    colors = ["#687882", "#0072B2"]
    score = np.array([100 * row["strict_success_fraction"] for row in pair_rows])
    lower = np.array([100 * row["task_cluster_95ci_low_fraction"] for row in pair_rows])
    upper = np.array([100 * row["task_cluster_95ci_high_fraction"] for row in pair_rows])
    axes[0].bar(x, score, width=.55, color=colors, edgecolor="white", zorder=3)
    axes[0].errorbar(x, score, yerr=[score-lower, upper-score], fmt="none", ecolor="#222222", elinewidth=1.3, capsize=5, zorder=4)
    for pos, row, value in zip(x, pair_rows, score):
        axes[0].text(pos, 28, f"{row['primary_passed']}/72\n{value:.1f}%", ha="center", va="center", color="white", fontsize=10, fontweight="bold")
    axes[0].set(title="(a) Strict success", ylabel="Primary attempts passed (%)", ylim=(0, 105), xticks=x, xticklabels=labels)
    axes[0].set_yticks(np.arange(0, 101, 20))
    medians = [row["request_median_seconds"] for row in pair_rows]
    p90s = [row["request_p90_seconds"] for row in pair_rows]
    width = .31
    median_bars = axes[1].bar(x-width/2, medians, width=width, label="Median", color="#0072B2", zorder=3)
    p90_bars = axes[1].bar(x+width/2, p90s, width=width, label="P90", color="#A7CCDF", edgecolor="#37677F", linewidth=.6, hatch="//", zorder=3)
    for bars in [median_bars, p90_bars]:
        axes[1].bar_label(bars, fmt="%.2f", padding=3, fontsize=8)
    axes[1].set(title="(b) Request latency", ylabel="Seconds", ylim=(0, 36), xticks=x, xticklabels=labels)
    axes[1].legend(loc="upper left", frameon=False, fontsize=8)
    for ax in axes:
        ax.grid(axis="y", color="#DDDDDD", linewidth=.6, zorder=0)
        ax.set_axisbelow(True)
        ax.tick_params(axis="x", length=0, pad=6)
        ax.set_xlim(-.65, 1.65)
    fig.text(.5, .96, "Contemporaneous local comparison · 29 September 2026", ha="center", va="top", fontsize=11, fontweight="bold")
    fig.text(.5, .885, f"Qwen3.8 − Qwen3: +{100*difference:.2f} pp; paired 95% task-cluster CI [+{100*interval[0]:.2f}, +{100*interval[1]:.2f}]", ha="center", fontsize=9)
    fig.text(.5, .14, "Primary browser trials: UI-state violations 3/21 vs 0/21 (Qwen3 vs Qwen3.8).", ha="center", fontsize=8)
    fig.text(.5, .10, "Violations: actual value changes against the frozen task policy; redundant unchanged fields excluded.", ha="center", fontsize=7.6)
    fig.text(.5, .06, "72 primary attempts per model; failures retained, controls excluded. Accuracy whiskers: 95% task-cluster CI.", ha="center", fontsize=7.6)
    fig.text(.5, .02, "Latency includes loading and retries; shared GPU and Qwen3.8 CPU offload limit runtime generalization.", ha="center", fontsize=7.6)
    out = HERE / "figures"
    out.mkdir(exist_ok=True)
    fig.savefig(out / "paired-results.pdf", metadata={"Title": "CERRA paired local Qwen evaluation, 29 September 2026", "Author": "CERRA", "CreationDate": None, "ModDate": None})
    fig.savefig(out / "paired-results.png", dpi=240, metadata={"Title": "CERRA paired local Qwen evaluation, 29 September 2026"})
    plt.close(fig)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--from-archive", action="store_true", help="Rebuild aggregate CSV/JSON and verify original campaign archives.")
    parser.add_argument("--archive-root", type=Path, default=RESEARCH, help="Research archive directory containing the selected campaign folders; used only with --from-archive.")
    parser.add_argument("--include-campaign", action="append", default=[], choices=sorted(OPTIONAL_CAMPAIGNS), help="Explicitly include a completed additional campaign; requires --from-archive and fully verified results.")
    args = parser.parse_args()
    if args.include_campaign and not args.from_archive:
        parser.error("--include-campaign requires --from-archive")
    if args.from_archive:
        rows, summaries, campaigns = load_archive_results(args.archive_root, args.include_campaign)
        paired = write_safe_package(rows, summaries, campaigns, args.archive_root)
    else:
        rows, paired = load_package_results()
    write_table(rows)
    plot_paired(rows, paired)
    for name in ["aggregate-results.csv", "paired-summary.json", "provenance.json", "results-table.tex", "figures/paired-results.pdf", "figures/paired-results.png"]:
        print(HERE / name)


if __name__ == "__main__":
    main()
