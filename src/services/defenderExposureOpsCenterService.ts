// SPDX-License-Identifier: AGPL-3.0-or-later

import { analyze } from "../analyze.js";
import { exposureLanePackets, remediationPackets, sampleDefenderExposurePayload } from "../data/sampleDefenderExposure.js";
import type { Finding } from "../types.js";

const NOW = "2026-05-30T00:00:00Z";
const report = analyze(sampleDefenderExposurePayload, {
  now: NOW,
  staleRecommendationAfterHours: 36
});

function severityRank(finding: Finding): number {
  return finding.severity === "high"
    ? 0
    : finding.severity === "medium"
      ? 1
      : finding.severity === "low"
        ? 2
        : 3;
}

export function summary() {
  return {
    controls: report.controls,
    healthyControls: report.healthyControls,
    recommendations: report.recommendations,
    highSeverityRecommendations: report.highSeverityRecommendations,
    attackPathSignals: report.attackPathSignals,
    staleRecommendations: report.staleRecommendations,
    recommendation:
      "Break the open attack path, review privileged standing access, restore endpoint coverage, and close collaboration exposure proof before calling Defender posture healthy."
  };
}

export function exposureLane() {
  return exposureLanePackets.map((lane) => ({
    ...lane,
    relatedFindings: report.findingsList.filter((finding) => {
      if (lane.id === "attack-path-lane") {
        return finding.code === "attack-path-open" || finding.code === "critical-vulnerability-open";
      }
      if (lane.id === "identity-lane") {
        return finding.code === "privileged-identity-exposed" || finding.code === "high-severity-unassigned";
      }
      if (lane.id === "device-lane") {
        return finding.code === "device-risk-uncontained" || finding.code === "stale-active-recommendation";
      }
      if (lane.id === "collab-lane") {
        return finding.code === "email-posture-gap" || finding.code === "control-plan-missing";
      }
      return false;
    }).length
  }));
}

export function controlGaps() {
  return [...report.findingsList]
    .sort((left, right) => severityRank(left) - severityRank(right))
    .map((finding) => ({
      ...finding,
      owner:
        finding.owner ??
        (finding.code === "privileged-identity-exposed"
          ? "Identity Operations"
          : finding.code === "device-risk-uncontained"
            ? "Endpoint Engineering"
            : finding.code === "email-posture-gap"
              ? "Collaboration Security"
              : "Exposure Operations")
    }));
}

export function remediationPosture() {
  return remediationPackets;
}

export function verification() {
  return [
    "The dashboard is backed by a real offline exposure analyzer and CLI, not static copy alone.",
    "Controls and recommendations are synthetic sample data only; no live Defender tenant tokens, Microsoft 365 content, or production telemetry are published.",
    "The control plane keeps attack-path, identity, device, collaboration, and remediation posture visible for Microsoft security stakeholders.",
    "This surface demonstrates Microsoft Defender exposure operations, not a generic cloud keyword page.",
    "It complements Entra, Intune, M365 retention, AWS security, and GCP proof with a concrete Defender posture lane."
  ];
}

export function payload() {
  return {
    summary: summary(),
    exposureLane: exposureLane(),
    controlGaps: controlGaps(),
    remediationPosture: remediationPosture(),
    verification: verification(),
    sample: sampleDefenderExposurePayload
  };
}
