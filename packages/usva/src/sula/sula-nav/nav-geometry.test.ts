import { describe, expect, it } from "vitest";
import {
  type Blob,
  bridgeNecks,
  lerpBlob,
  packUniforms,
  springToBlob,
} from "../sula-core/geometry.js";
import {
  loadPhase,
  revealPhase,
  switchFade,
  switchProgress,
} from "./nav-geometry.js";

const blob = (over: Partial<Blob> = {}): Blob => ({
  cx: 100,
  cy: 40,
  hw: 80,
  hh: 24,
  r: 24,
  ...over,
});

const K = 26;

describe("loadPhase", () => {
  const rest = blob({ cx: 400, cy: 60, hw: 200, hh: 24, r: 24 });
  const deepRest = blob({ cx: 400, cy: 180, hw: 200, hh: 24, r: 24 });

  it("ends at the rest blob with nothing left over", () => {
    const load = loadPhase(rest, 1, 0, 1);
    expect(load.bar.cx).toBeCloseTo(rest.cx);
    expect(load.bar.cy).toBeCloseTo(rest.cy);
    expect(load.bar.hw).toBeCloseTo(rest.hw);
    expect(load.bar.hh).toBeCloseTo(rest.hh);
    expect(load.necks).toEqual([]);
    expect(load.extras).toEqual([]);
  });

  it("forms a compact edge bulb, not a wide mouth", () => {
    const { extras } = loadPhase(rest, 0.1, 0, 0);
    expect(extras).toHaveLength(1);
    expect(extras[0]?.hw ?? 0).toBeGreaterThan(0);
    // Sized off the bar height, so it never spans the bar's width.
    expect(extras[0]?.hw ?? 0).toBeLessThan(rest.hw * 0.5);
  });

  it("swells the bulb as it gathers, before releasing", () => {
    const still = loadPhase(rest, 0, 0, 0);
    const gathered = loadPhase(rest, 0.12, 0, 0);
    expect(gathered.extras[0]?.hh ?? 0).toBeGreaterThan(
      still.extras[0]?.hh ?? 0,
    );
    expect(gathered.bar.cy).toBeCloseTo(still.bar.cy, 0);
  });

  it("anchors the neck at the edge while it is attached", () => {
    const { necks } = loadPhase(rest, 0.15, 12, 0);
    expect(necks[0]?.ay).toBe(12);
  });

  it("stays a fat attached neck early, then pinches off with no thread left", () => {
    const attached = loadPhase(deepRest, 0.3, 0, 0).necks[0];
    expect(attached?.strength ?? 0).toBeGreaterThan(0.9);
    // Fat while attached: a gooey funnel, not a thread.
    expect(attached?.r ?? 0).toBeGreaterThan(deepRest.hh * 0.5);
    expect(loadPhase(deepRest, 0.95, 0, 0).necks).toEqual([]);
    expect(loadPhase(deepRest, 1, 0, 0).necks).toEqual([]);
  });

  it("fades the neck strength monotonically to nothing", () => {
    const strengths = [0.5, 0.65, 0.8, 0.9].map(
      (t) => loadPhase(deepRest, t, 0, 0).necks[0]?.strength ?? 0,
    );
    for (let i = 1; i < strengths.length; i++) {
      expect(strengths[i]).toBeLessThanOrEqual(strengths[i - 1] as number);
    }
    expect(strengths[strengths.length - 1]).toBeLessThan(0.05);
  });

  it("recoils the top bulb into the edge as the drop separates", () => {
    const early = loadPhase(deepRest, 0.15, 0, 0);
    const separated = loadPhase(deepRest, 0.7, 0, 0);
    expect(separated.extras[0]?.hh ?? 0).toBeLessThan(early.extras[0]?.hh ?? 0);
    expect(Math.abs(separated.extras[0]?.cy ?? 9)).toBeLessThan(
      Math.abs(early.extras[0]?.cy ?? 0),
    );
  });

  it("carries spring overshoot past the rest line before settling", () => {
    const over = loadPhase(rest, 1.08, 0, 0);
    expect(over.bar.cy).toBeGreaterThan(rest.cy);
    expect(over.bar.hw).toBeCloseTo(rest.hw);
    expect(over.bar.hh).toBeCloseTo(rest.hh);
  });
});

describe("revealPhase", () => {
  const bar = blob({ cx: 400, cy: 40, hw: 200, hh: 24, r: 24 });
  const lead = blob({ cx: 130, cy: 40, hw: 50, hh: 22, r: 22 });
  const trail = blob({ cx: 670, cy: 40, hw: 22, hh: 22, r: 22 });
  const left = blob({ cx: 130, cy: 40, hw: 36, hh: 22, r: 22 });
  const right = blob({ cx: 670, cy: 40, hw: 36, hh: 22, r: 22 });

  it("starts absorbed inside the bar's ends, with no neck", () => {
    const { lead: l, trail: t, necks } = revealPhase(bar, lead, trail, 0, K);
    expect(l.hw).toBeCloseTo(lead.hw * 0.5);
    expect(t.hw).toBeCloseTo(trail.hw * 0.5);
    // The blob sits inside the bar so smin swallows it: nothing pokes out.
    expect(l.cx).toBeLessThan(bar.cx);
    expect(t.cx).toBeGreaterThan(bar.cx);
    expect(l.cx + l.hw).toBeLessThan(bar.cx + bar.hw);
    expect(t.cx - t.hw).toBeGreaterThan(bar.cx - bar.hw);
    expect(necks).toHaveLength(0);
  });

  it("ends at the rest blobs with no necks left", () => {
    const result = revealPhase(bar, lead, trail, 1, K);
    expect(result.lead).toEqual(lead);
    expect(result.trail).toEqual(trail);
    expect(result.necks).toEqual([]);
  });

  it("trails a neck from each side while it is still emerging", () => {
    expect(revealPhase(bar, lead, trail, 0.5, K).necks).toHaveLength(2);
  });

  it("swells inside the bar before travelling outward", () => {
    const start = revealPhase(bar, left, right, 0, K);
    const swell = revealPhase(bar, left, right, 0.2, K);

    expect(swell.lead.hw).toBeGreaterThan(start.lead.hw);
    expect(swell.trail.hw).toBeGreaterThan(start.trail.hw);
    expect(Math.abs(swell.lead.cx - start.lead.cx)).toBeLessThan(left.hw * 0.2);
    expect(Math.abs(swell.trail.cx - start.trail.cx)).toBeLessThan(
      right.hw * 0.2,
    );
  });

  it("mirrors both sides from one emergence progress", () => {
    const result = revealPhase(bar, left, right, 0.65, K);

    expect(bar.cx - result.lead.cx).toBeCloseTo(result.trail.cx - bar.cx);
    expect(result.lead.hw).toBeCloseTo(result.trail.hw);
    expect(result.lead.hh).toBeCloseTo(result.trail.hh);
    expect(result.necks[0]?.r).toBeCloseTo(result.necks[1]?.r ?? 0);
  });

  it("keeps both liquid necks attached until the late pinch", () => {
    expect(revealPhase(bar, left, right, 0.9, K).necks).toHaveLength(2);
    expect(revealPhase(bar, left, right, 0.96, K).necks).toHaveLength(0);
  });

  it("fades both side necks before handing off to the rest bridge", () => {
    const early = revealPhase(bar, left, right, 0.84, K).necks;
    const late = revealPhase(bar, left, right, 0.92, K).necks;

    expect(early[0]?.strength).toBeCloseTo(1, 6);
    expect(late[0]?.strength ?? 1).toBeLessThan(0.15);
    expect(late[1]?.strength ?? 1).toBeLessThan(0.15);
  });

  it("keeps settled side pills within bridge reach through overshoot", () => {
    const restK = 14;
    const connectedLeft = blob({ cx: 150, cy: 40, hw: 36, hh: 22, r: 22 });
    const connectedRight = blob({ cx: 650, cy: 40, hw: 36, hh: 22, r: 22 });
    const settled = revealPhase(bar, connectedLeft, connectedRight, 1, restK);
    const overshot = revealPhase(
      bar,
      connectedLeft,
      connectedRight,
      1.2,
      restK,
    );
    const bridges = (lead: Blob, trail: Blob) =>
      bridgeNecks([lead, bar, trail], restK * 1.15, 0.32);

    expect(bridges(settled.lead, settled.trail)).toHaveLength(2);
    expect(bridges(overshot.lead, overshot.trail)).toHaveLength(2);
  });

  it("carries position past the rest line for a settle wobble, size stays put", () => {
    const result = revealPhase(bar, left, right, 1.2, K);
    // Each side overshoots outward past its rest centre, then the spring pulls back.
    expect(result.lead.cx).toBeLessThan(left.cx);
    expect(result.trail.cx).toBeGreaterThan(right.cx);
    // Half-extents do not overshoot: the pill settles in place, it never grows.
    expect(result.lead.hw).toBeCloseTo(left.hw);
    expect(result.lead.hh).toBeCloseTo(left.hh);
    expect(result.necks).toEqual([]);
  });
});

describe("switchProgress", () => {
  const wide = blob({ hw: 200 });
  const narrow = blob({ hw: 22 });
  const samples = Array.from({ length: 41 }, (_, i) => i / 40);

  it("hits both endpoints for every role", () => {
    for (const role of ["hide", "show", "keep"] as const) {
      expect(switchProgress(0, role)).toBe(0);
      expect(switchProgress(1, role)).toBe(1);
    }
  });

  it("shrinks a hiding pill monotonically, never overshooting wide", () => {
    let previous = Number.POSITIVE_INFINITY;
    for (const t of samples) {
      const hw = lerpBlob(wide, narrow, switchProgress(t, "hide")).hw;
      expect(hw).toBeLessThanOrEqual(previous);
      expect(hw).toBeLessThanOrEqual(wide.hw);
      expect(hw).toBeGreaterThanOrEqual(narrow.hw);
      previous = hw;
    }
  });

  it("grows a showing pill monotonically", () => {
    let previous = Number.NEGATIVE_INFINITY;
    for (const t of samples) {
      const hw = lerpBlob(narrow, wide, switchProgress(t, "show")).hw;
      expect(hw).toBeGreaterThanOrEqual(previous);
      expect(hw).toBeLessThanOrEqual(wide.hw);
      previous = hw;
    }
  });

  it("drains the hiding pill before the showing pill fills", () => {
    expect(switchProgress(0.2, "show")).toBe(0);
    expect(switchProgress(0.5, "hide")).toBeGreaterThan(0.9);
    expect(switchProgress(0.5, "show")).toBeLessThan(0.3);
    expect(switchProgress(0.62, "hide")).toBe(1);
  });
});

describe("switchFade", () => {
  it("never dims an unchanged part", () => {
    for (const t of [0, 0.3, 0.7, 1]) {
      expect(switchFade(t, "keep")).toBe(1);
    }
  });

  it("materialises each changing label monotonically, without a mid-switch dip", () => {
    for (const role of ["hide", "show"] as const) {
      expect(switchFade(0, role)).toBe(0);
      expect(switchFade(1, role)).toBeCloseTo(1);
      let previous = Number.NEGATIVE_INFINITY;
      for (let i = 0; i <= 40; i++) {
        const value = switchFade(i / 40, role);
        expect(value).toBeGreaterThanOrEqual(previous);
        previous = value;
      }
    }
    expect(switchFade(0.2, "show")).toBe(0);
  });
});

describe("purity", () => {
  it("never mutates its inputs", () => {
    const a = blob();
    const b = blob({ cx: 300 });
    const snapshot = [{ ...a }, { ...b }];
    lerpBlob(a, b, 0.5);
    springToBlob(a, b, 1.2);
    loadPhase(a, 0.5, 0, 0);
    revealPhase(a, b, b, 0.5, K);
    packUniforms({ blobs: [a, b], necks: [], k: K }, 2, 120);
    expect([a, b]).toEqual(snapshot);
  });
});
