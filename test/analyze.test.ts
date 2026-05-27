import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { analyze } from "../src/analyze.js";
import { toMarkdown, toSummary } from "../src/format.js";
import type { DefenderExposureExport } from "../src/types.js";

const here = fileURLToPath(new URL(".", import.meta.url));
const fixture = (name: string): DefenderExposureExport =>
  JSON.parse(readFileSync(`${here}/../fixtures/${name}`, "utf8")) as DefenderExposureExport;

const NOW = "2026-05-30T00:00:00Z";

describe("analyze", () => {
  it("counts controls and recommendations", () => {
    const report = analyze(fixture("defender-exposure.json"), { now: NOW });
    expect(report.controls).toBe(2);
    expect(report.healthyControls).toBe(1);
    expect(report.recommendations).toBe(6);
  });

  it("flags missing healthy controls as high", () => {
    const report = analyze({ controls: [], recommendations: [] }, { now: NOW });
    expect(report.findingsList.find((finding) => finding.code === "no-healthy-control")?.severity).toBe("high");
  });

  it("flags degraded controls", () => {
    const report = analyze(fixture("defender-exposure.json"), { now: NOW });
    expect(report.findingsList.find((finding) => finding.code === "control-plan-missing")?.scope).toBe("EMEA collaboration tenant");
  });

  it("flags attack-path, identity, device, and email gaps", () => {
    const report = analyze(fixture("defender-exposure.json"), { now: NOW });
    expect(report.findingsList.find((finding) => finding.code === "attack-path-open")).toBeDefined();
    expect(report.findingsList.find((finding) => finding.code === "privileged-identity-exposed")).toBeDefined();
    expect(report.findingsList.find((finding) => finding.code === "device-risk-uncontained")).toBeDefined();
    expect(report.findingsList.find((finding) => finding.code === "email-posture-gap")).toBeDefined();
  });

  it("flags critical vulnerability exposure", () => {
    const report = analyze(fixture("defender-exposure.json"), { now: NOW });
    expect(report.findingsList.find((finding) => finding.code === "critical-vulnerability-open")).toBeDefined();
  });

  it("flags stale active recommendations", () => {
    const report = analyze(fixture("defender-exposure.json"), { now: NOW, staleRecommendationAfterHours: 24 });
    expect(report.findingsList.find((finding) => finding.code === "stale-active-recommendation")).toBeDefined();
  });

  it("ok=true on a clean fixture", () => {
    const report = analyze(fixture("defender-exposure-clean.json"), { now: NOW });
    expect(report.ok).toBe(true);
    expect(report.findingsList.filter((finding) => finding.severity === "high")).toEqual([]);
  });
});

describe("formatters", () => {
  it("toMarkdown ranks high findings first", () => {
    const markdown = toMarkdown(analyze(fixture("defender-exposure.json"), { now: NOW }));
    expect(markdown).toContain("❌");
    expect(markdown.indexOf("🔴")).toBeLessThan(markdown.indexOf("🟠"));
  });

  it("toSummary emits a one-liner", () => {
    const summary = toSummary(analyze(fixture("defender-exposure.json"), { now: NOW }));
    expect(summary).toMatch(/controls/);
    expect(summary).toMatch(/recommendations/);
  });
});
