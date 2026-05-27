import type {
  DefenderExposureExport,
  ExposureControl,
  ExposureOptions,
  ExposureRecommendation,
  ExposureReport,
  Finding,
  RecommendationStatus
} from "./types.js";

const HOUR_MS = 3_600_000;

function emptyStatusCounts(): Record<RecommendationStatus, number> {
  return {
    ACTIVE: 0,
    RESOLVED: 0
  };
}

function lastUpdatedAt(recommendation: ExposureRecommendation): Date {
  return new Date(recommendation.updatedAt ?? recommendation.createdAt);
}

function controlHasPlan(control: ExposureControl, plan: string): boolean {
  return control.plans.includes(plan);
}

export function analyze(input: DefenderExposureExport, opts: ExposureOptions = {}): ExposureReport {
  const now = opts.now ? new Date(opts.now) : new Date();
  const staleAfter = (opts.staleRecommendationAfterHours ?? 48) * HOUR_MS;

  const controls = input.controls ?? [];
  const recommendations = input.recommendations ?? [];
  const findingsList: Finding[] = [];
  const recommendationsByStatus = emptyStatusCounts();

  const healthyControls = controls.filter((control) => control.status === "HEALTHY");
  const activeRecommendations = recommendations.filter((recommendation) => recommendation.status === "ACTIVE");
  const highSeverityRecommendations = activeRecommendations.filter((recommendation) => recommendation.severity === "high");
  const attackPathSignals = activeRecommendations.filter((recommendation) => recommendation.source === "ATTACK_PATH");

  if (healthyControls.length === 0) {
    findingsList.push({
      code: "no-healthy-control",
      severity: "high",
      message: "No healthy exposure-management control is active for the captured Defender scope.",
      subject: "controls"
    });
  }

  for (const control of controls) {
    if (control.status === "DEGRADED") {
      findingsList.push({
        code: "control-plan-missing",
        severity: "medium",
        message: `Exposure control in ${control.scope} is degraded and does not provide a healthy remediation lane.`,
        subject: control.id,
        subjectName: control.owner,
        scope: control.scope,
        owner: control.owner
      });
    }

    if (control.status === "HEALTHY" && !controlHasPlan(control, "ATTACK_PATH")) {
      findingsList.push({
        code: "attack-path-open",
        severity: "medium",
        message: `Exposure control in ${control.scope} is missing attack-path coverage for chained-risk analysis.`,
        subject: control.id,
        subjectName: control.owner,
        scope: control.scope,
        owner: control.owner
      });
    }

    if (control.status === "HEALTHY" && !controlHasPlan(control, "EMAIL")) {
      findingsList.push({
        code: "email-posture-gap",
        severity: "medium",
        message: `Exposure control in ${control.scope} is missing email posture coverage for collaboration and phishing attack paths.`,
        subject: control.id,
        subjectName: control.owner,
        scope: control.scope,
        owner: control.owner
      });
    }
  }

  for (const recommendation of recommendations) {
    recommendationsByStatus[recommendation.status] += 1;

    if (recommendation.status !== "ACTIVE") {
      continue;
    }

    if (recommendation.source === "ATTACK_PATH") {
      findingsList.push({
        code: "attack-path-open",
        severity: "high",
        message: `Attack-path exposure on "${recommendation.asset}" stays open and can chain identity, device, and app risk together.`,
        subject: recommendation.id,
        subjectName: recommendation.asset,
        scope: recommendation.scope,
        owner: recommendation.owner
      });
    }

    if (recommendation.source === "IDENTITY" || recommendation.principal) {
      findingsList.push({
        code: "privileged-identity-exposed",
        severity: recommendation.severity,
        message: `Privileged identity "${recommendation.principal ?? recommendation.asset}" still carries unresolved exposure posture.`,
        subject: recommendation.id,
        subjectName: recommendation.asset,
        scope: recommendation.scope,
        principal: recommendation.principal,
        owner: recommendation.owner
      });
    }

    if (recommendation.source === "DEVICE") {
      findingsList.push({
        code: "device-risk-uncontained",
        severity: recommendation.severity,
        message: `Device or server exposure on "${recommendation.asset}" needs containment before broader tenant trust degrades.`,
        subject: recommendation.id,
        subjectName: recommendation.asset,
        scope: recommendation.scope,
        owner: recommendation.owner
      });
    }

    if (recommendation.source === "EMAIL") {
      findingsList.push({
        code: "email-posture-gap",
        severity: recommendation.severity,
        message: `Email and collaboration posture for "${recommendation.asset}" is still missing the needed Defender remediation proof.`,
        subject: recommendation.id,
        subjectName: recommendation.asset,
        scope: recommendation.scope,
        owner: recommendation.owner
      });
    }

    if (recommendation.source === "VULNERABILITY") {
      findingsList.push({
        code: "critical-vulnerability-open",
        severity: recommendation.severity,
        message: `Critical vulnerability exposure on "${recommendation.asset}" remains active and needs a tighter remediation window.`,
        subject: recommendation.id,
        subjectName: recommendation.asset,
        scope: recommendation.scope,
        owner: recommendation.owner
      });
    }

    if (!recommendation.owner && recommendation.severity === "high") {
      findingsList.push({
        code: "high-severity-unassigned",
        severity: "medium",
        message: `High-severity recommendation "${recommendation.title}" still has no assigned owner.`,
        subject: recommendation.id,
        subjectName: recommendation.asset,
        scope: recommendation.scope
      });
    }

    if (now.getTime() - lastUpdatedAt(recommendation).getTime() > staleAfter) {
      findingsList.push({
        code: "stale-active-recommendation",
        severity: "medium",
        message: `Recommendation "${recommendation.title}" has remained active since ${lastUpdatedAt(recommendation).toISOString().slice(0, 16)}Z.`,
        subject: recommendation.id,
        subjectName: recommendation.asset,
        scope: recommendation.scope,
        owner: recommendation.owner
      });
    }
  }

  const staleRecommendations = activeRecommendations.filter(
    (recommendation) => now.getTime() - lastUpdatedAt(recommendation).getTime() > staleAfter
  ).length;

  return {
    generatedAt: now.toISOString(),
    controls: controls.length,
    healthyControls: healthyControls.length,
    recommendations: recommendations.length,
    recommendationsByStatus,
    highSeverityRecommendations: highSeverityRecommendations.length,
    attackPathSignals: attackPathSignals.length,
    staleRecommendations,
    findingsList,
    ok: !findingsList.some((finding) => finding.severity === "high")
  };
}
