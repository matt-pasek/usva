import { describe, expect, it } from "vitest";
import type { Blob } from "../sula-core/geometry.js";
import { indicatorPhase, pillFromRect } from "./segmented-geometry.js";

const blob = (over: Partial<Blob> = {}): Blob => ({
  cx: 100,
  cy: 40,
  hw: 50,
  hh: 20,
  r: 20,
  ...over,
});

describe("pillFromRect", () => {
  it("centres the pill on the rect and rounds it fully", () => {
    const pill = pillFromRect({ left: 20, top: 8, width: 120, height: 40 });
    expect(pill.cx).toBe(80);
    expect(pill.cy).toBe(28);
    expect(pill.hw).toBe(60);
    expect(pill.hh).toBe(20);
    // A wide pill is fully rounded: r is the short half-extent.
    expect(pill.r).toBe(20);
  });
});

describe("indicatorPhase", () => {
  const source = blob({ cx: 100, cy: 40, hw: 50, hh: 20, r: 20 });
  const target = blob({ cx: 300, cy: 40, hw: 40, hh: 20, r: 20 });

  it("is one pill, starting as exactly the source", () => {
    const { blobs } = indicatorPhase(source, target, 0);
    expect(blobs).toHaveLength(1);
    const pill = blobs[0] as Blob;
    expect(pill.cx).toBeCloseTo(source.cx, 6);
    expect(pill.cy).toBeCloseTo(source.cy, 6);
    expect(pill.hw).toBeCloseTo(source.hw, 6);
    expect(pill.hh).toBeCloseTo(source.hh, 6);
  });

  it("settles to exactly the target pill with no neck", () => {
    const { blobs, neck } = indicatorPhase(source, target, 1);
    expect(neck).toBeNull();
    expect(blobs).toHaveLength(1);
    const settled = blobs[0] as Blob;
    expect(settled.cx).toBeCloseTo(target.cx, 6);
    expect(settled.cy).toBeCloseTo(target.cy, 6);
    expect(settled.hw).toBeCloseTo(target.hw, 6);
    expect(settled.hh).toBeCloseTo(target.hh, 6);
  });

  it("travels monotonically with no stall", () => {
    let previous = source.cx;
    for (let i = 1; i <= 20; i++) {
      const { blobs } = indicatorPhase(source, target, i / 20);
      const pill = blobs[0] as Blob;
      expect(pill.cx).toBeGreaterThan(previous);
      previous = pill.cx;
    }
  });

  it("eases size continuously with no half-scale pulse", () => {
    const minHw = Math.min(source.hw, target.hw);
    const maxHw = Math.max(source.hw, target.hw);
    for (let i = 0; i <= 20; i++) {
      const { blobs } = indicatorPhase(source, target, i / 20);
      const pill = blobs[0] as Blob;
      // The flight stretch may carry hw slightly past the endpoints, never half.
      expect(pill.hw).toBeGreaterThanOrEqual(minHw - 1e-6);
      expect(pill.hw).toBeLessThanOrEqual(maxHw * 1.1 + 1e-6);
      expect(pill.hh).toBeLessThanOrEqual(
        Math.max(source.hh, target.hh) + 1e-6,
      );
    }
  });

  it("squashes a little mid-flight, like liquid in motion", () => {
    const { blobs } = indicatorPhase(source, target, 0.5);
    expect((blobs[0] as Blob).hh).toBeLessThan(source.hh);
  });

  it("melts the source tether via strength while staying fat", () => {
    const early = indicatorPhase(source, target, 0.2).neck;
    expect(early).not.toBeNull();
    expect(early?.r ?? 0).toBeGreaterThan(5);
    const later = indicatorPhase(source, target, 0.4).neck;
    expect(later?.strength ?? 0).toBeLessThan(early?.strength ?? 0);
    // Fully melted well before landing, so nothing can snap out at the end.
    expect(indicatorPhase(source, target, 0.6).neck).toBeNull();
  });

  it("overshoots position past the target while its size stays clamped", () => {
    const { blobs } = indicatorPhase(source, target, 1.1);
    const pill = blobs[0] as Blob;
    expect(pill.cx).toBeGreaterThan(target.cx);
    expect(pill.hw).toBeCloseTo(target.hw, 6);
    expect(pill.hh).toBeCloseTo(target.hh, 6);
  });

  it("never mutates its inputs", () => {
    const s = { ...source };
    const t = { ...target };
    indicatorPhase(source, target, 0.5);
    expect(source).toEqual(s);
    expect(target).toEqual(t);
  });
});
