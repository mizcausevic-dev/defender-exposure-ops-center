// SPDX-License-Identifier: AGPL-3.0-or-later

import { describe, expect, test } from "vitest";

import { renderControlGaps, renderDocs, renderOverview } from "./render.js";

describe("render", () => {
  test("overview includes Defender framing", () => {
    expect(renderOverview()).toContain("Defender Exposure Ops Center");
    expect(renderOverview()).toContain("attack paths");
  });

  test("docs and gap routes use the new route names", () => {
    expect(renderDocs()).toContain("/exposure-lane");
    expect(renderDocs()).toContain("defender-exposure-ops");
    expect(renderControlGaps()).toContain("Control Gaps");
  });
});
