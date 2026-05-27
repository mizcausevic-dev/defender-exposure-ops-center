// SPDX-License-Identifier: AGPL-3.0-or-later

import { describe, expect, test } from "vitest";

import {
  controlGaps,
  exposureLane,
  payload,
  remediationPosture,
  summary,
  verification
} from "./defenderExposureOpsCenterService.js";

describe("defenderExposureOpsCenterService", () => {
  test("summary reflects the sample Defender posture", () => {
    expect(summary()).toMatchObject({
      controls: 2,
      healthyControls: 1,
      recommendations: 6,
      highSeverityRecommendations: 3
    });
    expect(summary().attackPathSignals).toBeGreaterThanOrEqual(1);
  });

  test("exposure lane stays mapped to owners", () => {
    const lanes = exposureLane();
    expect(lanes).toHaveLength(4);
    expect(lanes.some((lane) => lane.lane === "Attack path lane" && lane.owner === "Exposure Operations")).toBe(true);
  });

  test("control gaps sort high severity first", () => {
    const gaps = controlGaps();
    expect(gaps[0]?.severity).toBe("high");
    expect(gaps.some((gap) => gap.code === "privileged-identity-exposed")).toBe(true);
  });

  test("remediation posture and verification stay populated", () => {
    expect(remediationPosture()).toHaveLength(4);
    expect(verification()).toHaveLength(5);
    expect(payload().sample).toBeDefined();
  });
});
