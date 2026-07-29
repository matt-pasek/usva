import { describe, expect, it } from "vitest";
import { emergeDroplet } from "./emerge.js";
import type { Blob } from "./geometry.js";

const blob = (over: Partial<Blob> = {}): Blob => ({
  cx: 100,
  cy: 100,
  hw: 40,
  hh: 20,
  r: 20,
  ...over,
});

describe("emergeDroplet", () => {
  const parent = blob({ cx: 100, cy: 100, hw: 40, hh: 20, r: 20 });
  const right = blob({ cx: 300, cy: 100, hw: 30, hh: 15, r: 15 });
  const above = blob({ cx: 100, cy: 40, hw: 15, hh: 20, r: 15 });

  it("starts absorbed at the parent edge, sized to startScale of the target", () => {
    const { blob: drop } = emergeDroplet(parent, right, 0);
    // The droplet begins just inside the parent's edge along the travel axis.
    const edgeX = parent.cx + parent.hw;
    expect(drop.cx).toBeLessThan(edgeX);
    expect(Math.abs(drop.cx - edgeX)).toBeLessThan(right.hw);
    expect(drop.cy).toBeCloseTo(parent.cy);
    // Default startScale is 0.5 of the target size.
    expect(drop.hw).toBeCloseTo(right.hw * 0.5);
    expect(drop.hh).toBeCloseTo(right.hh * 0.5);
  });

  it("has no neck while still absorbed, but grows one once travel begins", () => {
    expect(emergeDroplet(parent, right, 0).neck).toBeNull();
    expect(emergeDroplet(parent, right, 0.35).neck).not.toBeNull();
    expect(emergeDroplet(parent, right, 0.5).neck).not.toBeNull();
    expect(emergeDroplet(parent, right, 0.9).neck).not.toBeNull();
  });

  it("pinches the neck off before it settles", () => {
    expect(emergeDroplet(parent, right, 0.95).neck).toBeNull();
    expect(emergeDroplet(parent, right, 1).neck).toBeNull();
  });

  it("fades the neck strength smoothly before pinch-off", () => {
    const strengths = [0.84, 0.88, 0.92].map(
      (t) => emergeDroplet(parent, right, t).neck?.strength ?? 0,
    );

    expect(strengths[0]).toBeCloseTo(1, 6);
    expect(strengths[1]).toBeLessThan(strengths[0] as number);
    expect(strengths[2]).toBeLessThan(strengths[1] as number);
    expect(strengths[2]).toBeLessThan(0.15);
  });

  it("settles exactly at the target with no neck", () => {
    const { blob: drop, neck } = emergeDroplet(parent, right, 1);
    expect(drop.cx).toBeCloseTo(right.cx, 6);
    expect(drop.cy).toBeCloseTo(right.cy, 6);
    expect(drop.hw).toBeCloseTo(right.hw, 6);
    expect(drop.hh).toBeCloseTo(right.hh, 6);
    expect(neck).toBeNull();
  });

  it("overshoots position past the target but never its size (horizontal)", () => {
    const { blob: drop } = emergeDroplet(parent, right, 1.1);
    // The settle spring carries the droplet past the target, then pulls it back.
    expect(drop.cx).toBeGreaterThan(right.cx);
    // Size stays clamped: the droplet lands at target size, it never balloons.
    expect(drop.hw).toBeCloseTo(right.hw, 6);
    expect(drop.hh).toBeCloseTo(right.hh, 6);
  });

  it("emerges upward for a target above the parent", () => {
    const start = emergeDroplet(parent, above, 0);
    const edgeY = parent.cy - parent.hh;
    // Absorbed just inside the top edge, on the vertical axis.
    expect(start.blob.cx).toBeCloseTo(parent.cx);
    expect(start.blob.cy).toBeLessThan(parent.cy);
    expect(start.blob.cy).toBeGreaterThan(edgeY);

    const settled = emergeDroplet(parent, above, 1);
    expect(settled.blob.cx).toBeCloseTo(above.cx, 6);
    expect(settled.blob.cy).toBeCloseTo(above.cy, 6);
    expect(settled.neck).toBeNull();

    // Overshoot passes above the target, size stays clamped.
    const over = emergeDroplet(parent, above, 1.1);
    expect(over.blob.cy).toBeLessThan(above.cy);
    expect(over.blob.hh).toBeCloseTo(above.hh, 6);
    expect(over.blob.hw).toBeCloseTo(above.hw, 6);
  });

  it("honours custom phase options", () => {
    const wide = emergeDroplet(parent, right, 0.2, { startScale: 0.8 });
    // A larger startScale means a bigger absorbed droplet.
    expect(wide.blob.hw).toBeGreaterThan(
      emergeDroplet(parent, right, 0.2).blob.hw,
    );
  });

  it("never mutates its inputs", () => {
    const p = { ...parent };
    const t = { ...right };
    emergeDroplet(parent, right, 0.5);
    expect(parent).toEqual(p);
    expect(right).toEqual(t);
  });
});
