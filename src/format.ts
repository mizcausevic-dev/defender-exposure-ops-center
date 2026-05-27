import type { ExposureReport, RecommendationSeverity } from "./types.js";

const SEVERITY_LABEL: Record<RecommendationSeverity, string> = {
  high: "🔴 high",
  medium: "🟠 medium",
  low: "🟡 low",
  info: "ℹ️ info"
};

const SEVERITY_RANK: Record<RecommendationSeverity, number> = {
  high: 0,
  medium: 1,
  low: 2,
  info: 3
};

export function toMarkdown(report: ExposureReport): string {
  const lines: string[] = [];
  lines.push(report.ok ? "# Microsoft Defender exposure posture ✅" : "# Microsoft Defender exposure posture ❌");
  lines.push("");
  lines.push(`Generated: \`${report.generatedAt}\``);
  lines.push("");
  lines.push("## Coverage");
  lines.push("");
  lines.push(`- Controls: **${report.controls}**`);
  lines.push(`- Healthy controls: **${report.healthyControls}**`);
  lines.push(`- Recommendations: **${report.recommendations}**`);
  lines.push(`- High-severity recommendations: **${report.highSeverityRecommendations}**`);
  lines.push(`- Attack-path signals: **${report.attackPathSignals}**`);
  lines.push(`- Stale active recommendations: **${report.staleRecommendations}**`);
  lines.push("");
  lines.push("## Recommendations by status");
  lines.push("");
  lines.push("| ACTIVE | RESOLVED |");
  lines.push("|---:|---:|");
  lines.push(`| ${report.recommendationsByStatus.ACTIVE} | ${report.recommendationsByStatus.RESOLVED} |`);

  const ranked = [...report.findingsList].sort((a, b) => SEVERITY_RANK[a.severity] - SEVERITY_RANK[b.severity]);
  if (ranked.length > 0) {
    lines.push("");
    lines.push(`## Findings (${ranked.length})`);
    lines.push("");
    lines.push("| severity | code | subject | message |");
    lines.push("|---|---|---|---|");
    for (const finding of ranked) {
      lines.push(
        `| ${SEVERITY_LABEL[finding.severity]} | \`${finding.code}\` | ${finding.subjectName ?? finding.subject} | ${finding.message} |`
      );
    }
  } else {
    lines.push("");
    lines.push("No findings.");
  }
  return lines.join("\n");
}

export function toSummary(report: ExposureReport): string {
  const counts: Record<RecommendationSeverity, number> = { high: 0, medium: 0, low: 0, info: 0 };
  for (const finding of report.findingsList) counts[finding.severity] += 1;
  return `${report.controls} controls · ${report.recommendations} recommendations · ${counts.high} high · ${counts.medium} medium (${report.ok ? "ok" : "fail"})`;
}
