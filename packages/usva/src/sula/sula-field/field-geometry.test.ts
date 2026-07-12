import { describe, expect, it } from "vitest";
import { MAX_BLOBS, MAX_NECKS } from "../sula-core/geometry.js";
import { fieldFrame, LOOP_T, nearestBlob } from "./field-geometry.js";

const box = { width: 800, height: 400 };

describe("fieldFrame", () => {
  it("splits the field into two dark anchors and five lit actors", () => {
    const { back, front } = fieldFrame(0, { ...box, seed: 0 });
    expect(back).toHaveLength(2);
    expect(front).toHaveLength(5);
    expect(back.length + front.length).toBeLessThanOrEqual(MAX_BLOBS);
  });

  it("lets the back anchors sit part-way off the canvas", () => {
    const { back } = fieldFrame(0, { ...box, seed: 0 });
    const anyShoulderOff = back.some(
      (b) => b.cx - b.r < 0 || b.cx + b.r > box.width,
    );
    expect(anyShoulderOff).toBe(true);
  });

  it("keeps the front actors within the canvas", () => {
    for (const t of [0, 3.2, 41, 88]) {
      for (const b of fieldFrame(t, { ...box, seed: 2 }).front) {
        expect(b.cx + b.r).toBeLessThanOrEqual(box.width + 0.5);
        expect(b.cx - b.r).toBeGreaterThanOrEqual(-0.5);
      }
    }
  });

  it("orders the front actors from anchor down to glint", () => {
    const { front } = fieldFrame(0, { ...box, seed: 2 });
    expect(front[0]?.r ?? 0).toBeGreaterThan(front[1]?.r ?? 0);
    expect(front[2]?.r ?? 0).toBeGreaterThan(front[3]?.r ?? 0);
  });

  it("stages kisses: bridges appear during a window and part outside it", () => {
    const atCalm = fieldFrame(LOOP_T * 0.45, { ...box, seed: 0 }).necks.length;
    const atKiss = fieldFrame(LOOP_T * 0.22, { ...box, seed: 0 }).necks.length;
    expect(atKiss).toBeGreaterThan(atCalm);
    expect(atKiss).toBeLessThanOrEqual(MAX_NECKS);
  });

  it("closes the loop seamlessly at LOOP_T", () => {
    const a = fieldFrame(3, { ...box, seed: 5 });
    const b = fieldFrame(3 + LOOP_T, { ...box, seed: 5 });
    expect(b.front[0]?.cx).toBeCloseTo(a.front[0]?.cx ?? 0, 4);
    expect(b.back[0]?.cy).toBeCloseTo(a.back[0]?.cy ?? 0, 4);
  });

  it("is deterministic for a given seed and time", () => {
    expect(fieldFrame(5, { ...box, seed: 7 })).toEqual(
      fieldFrame(5, { ...box, seed: 7 }),
    );
  });

  it("wanders a different path for a different seed", () => {
    expect(fieldFrame(5, { ...box, seed: 1 })).not.toEqual(
      fieldFrame(5, { ...box, seed: 2 }),
    );
  });

  it("moves as time advances", () => {
    expect(fieldFrame(0, { ...box, seed: 3 })).not.toEqual(
      fieldFrame(4, { ...box, seed: 3 }),
    );
  });

  it("targets pointer pressure at the nearest surface", () => {
    const blobs = [
      { cx: 100, cy: 100, hw: 40, hh: 40, r: 40 },
      { cx: 300, cy: 100, hw: 20, hh: 20, r: 20 },
    ];
    expect(nearestBlob(blobs, { x: 292, y: 104 })).toBe(blobs[1]);
  });
});
