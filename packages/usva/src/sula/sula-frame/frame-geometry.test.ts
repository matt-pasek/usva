import { describe, expect, it } from "vitest";
import {
  BLOB_RADIUS,
  fixedRadius,
  frameRing,
  introFrame,
  packBlob,
  packRing,
  pointerStrength,
  resolveRadius,
  sdRoundBox,
  WOBBLE_REST,
  wobbleFor,
} from "./frame-geometry.js";

describe("sdRoundBox", () => {
  it("is negative inside, zero on the edge, positive outside", () => {
    expect(sdRoundBox(0, 0, 50, 30, 8)).toBeLessThan(0);
    expect(sdRoundBox(50, 0, 50, 30, 0)).toBeCloseTo(0, 5);
    expect(sdRoundBox(70, 0, 50, 30, 0)).toBeCloseTo(20, 5);
  });

  it("rounds the corner: the corner point sits radius-in from the box corner", () => {
    // A square corner would read 0 at (50,30); the radius pulls the surface in.
    expect(sdRoundBox(50, 30, 50, 30, 10)).toBeCloseTo(
      10 * (Math.SQRT2 - 1),
      4,
    );
  });
});

describe("fixedRadius", () => {
  it("clamps to a floor and a ceiling and scales in between", () => {
    expect(fixedRadius(320)).toBe(38);
    expect(fixedRadius(2000)).toBe(40);
    expect(fixedRadius(5000)).toBe(78);
  });
});

describe("resolveRadius", () => {
  it("prefers an explicit radius", () => {
    expect(
      resolveRadius({ explicit: 24, computed: 8, fixed: false, width: 800 }),
    ).toBe(24);
  });
  it("falls back to the computed border-radius in wrapper mode", () => {
    expect(resolveRadius({ computed: 12, fixed: false, width: 800 })).toBe(12);
  });
  it("uses the width scale in fixed mode when nothing is given", () => {
    expect(resolveRadius({ fixed: true, width: 1600 })).toBe(fixedRadius(1600));
  });
  it("never returns a negative radius", () => {
    expect(resolveRadius({ explicit: -5, fixed: false, width: 800 })).toBe(0);
  });
});

describe("frameRing", () => {
  it("centres the ring and pulls it in by the inset", () => {
    const ring = frameRing({ width: 200, height: 100, inset: 10, radius: 16 });
    expect(ring.cx).toBe(100);
    expect(ring.cy).toBe(50);
    expect(ring.hx).toBe(90);
    expect(ring.hy).toBe(40);
  });
  it("clamps the radius to the shortest half-extent", () => {
    const ring = frameRing({ width: 200, height: 40, inset: 0, radius: 999 });
    expect(ring.r).toBe(20);
  });
});

describe("introFrame", () => {
  const ring = { cx: 100, cy: 50, hx: 90, hy: 40, r: 32 };

  it("flows the shell inward while growing the corner radius", () => {
    expect(introFrame(ring, 0)).toEqual({ progress: 0, radius: 32 * 0.18 });
    expect(introFrame(ring, 1)).toEqual({ progress: 1, radius: 32 });
    expect(introFrame(ring, 0.5).radius).toBeGreaterThan(32 * 0.18);
  });

  it("clamps progress at both ends", () => {
    expect(introFrame(ring, -1).progress).toBe(0);
    expect(introFrame(ring, 2).progress).toBe(1);
  });
});

describe("packRing", () => {
  it("scales by dpr and flips Y", () => {
    const packed = packRing({ cx: 100, cy: 50, hx: 90, hy: 40, r: 16 }, 2, 100);
    expect(packed.center).toEqual([200, 100]);
    expect(packed.half).toEqual([180, 80]);
    expect(packed.radius).toBe(32);
  });
});

describe("pointerStrength", () => {
  const ring = { cx: 100, cy: 50, hx: 90, hy: 40, r: 8 };
  it("is at full strength on the band", () => {
    expect(pointerStrength(190, 50, ring, 1)).toBeCloseTo(1, 5);
  });
  it("fades to zero deep in the interior of a large frame", () => {
    const big = { cx: 600, cy: 400, hx: 560, hy: 360, r: 20 };
    expect(pointerStrength(600, 400, big, 1)).toBeCloseTo(0, 5);
  });
  it("scales with presence", () => {
    expect(pointerStrength(190, 50, ring, 0.5)).toBeCloseTo(0.5, 5);
    expect(pointerStrength(190, 50, ring, 0)).toBe(0);
  });
});

describe("packBlob", () => {
  it("flattens to device px with Y flipped", () => {
    expect(packBlob(50, 20, BLOB_RADIUS, 0.75, 2, 100)).toEqual([
      100,
      160,
      BLOB_RADIUS * 2,
      0.75,
    ]);
  });
});

describe("wobbleFor", () => {
  it("is the idle amount at rest and grows with energy", () => {
    expect(wobbleFor(0)).toBe(WOBBLE_REST);
    expect(wobbleFor(1)).toBeGreaterThan(wobbleFor(0));
    expect(wobbleFor(2)).toBe(wobbleFor(1));
  });
});
