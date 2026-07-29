import { describe, expect, it } from "vitest";
import {
  c1Settle,
  clamp01,
  easeOutCubic,
  mix,
  smoother,
  smoothstep,
} from "./curves.js";

const oldSettle = (t: number, start: number): number => {
  const f = Math.max(0, (t - start) / (1 - start));
  return f < 1 ? f * f * (2 - f) : f;
};

describe("clamp01", () => {
  it("bounds to [0, 1]", () => {
    expect(clamp01(-2)).toBe(0);
    expect(clamp01(0.4)).toBe(0.4);
    expect(clamp01(3)).toBe(1);
  });
});

describe("mix", () => {
  it("linearly interpolates", () => {
    expect(mix(0, 10, 0.5)).toBe(5);
    expect(mix(2, 4, 0)).toBe(2);
    expect(mix(2, 4, 1)).toBe(4);
  });
});

describe("smoothstep", () => {
  it("ramps between edges and pins outside them", () => {
    expect(smoothstep(0, 1, -1)).toBe(0);
    expect(smoothstep(0, 1, 2)).toBe(1);
    expect(smoothstep(0, 1, 0.5)).toBeCloseTo(0.5, 10);
  });

  it("degenerates cleanly when the edges collapse", () => {
    expect(smoothstep(0.5, 0.5, 0.4)).toBe(0);
    expect(smoothstep(0.5, 0.5, 0.6)).toBe(1);
  });
});

describe("smoother", () => {
  it("pins the quintic ends", () => {
    expect(smoother(0)).toBe(0);
    expect(smoother(1)).toBe(1);
  });

  it("is symmetric about the midpoint", () => {
    expect(smoother(0.5)).toBeCloseTo(0.5, 10);
    expect(smoother(0.25) + smoother(0.75)).toBeCloseTo(1, 10);
  });
});

describe("easeOutCubic", () => {
  it("pins its ends and decelerates", () => {
    expect(easeOutCubic(0)).toBe(0);
    expect(easeOutCubic(1)).toBe(1);
    expect(easeOutCubic(0.5)).toBeGreaterThan(0.5);
  });
});

describe("c1Settle", () => {
  it("matches the old inline mapping across the fall", () => {
    for (const t of [0, 0.1, 0.25, 0.5, 0.75, 1, 1.05, 1.2]) {
      expect(c1Settle(t, 0.1)).toBeCloseTo(oldSettle(t, 0.1), 12);
    }
  });

  it("carries a spring overshoot straight past the rest line", () => {
    expect(c1Settle(1.05, 0.1)).toBeGreaterThan(1);
  });

  it("lands at 1 with slope 1 at t=1", () => {
    expect(c1Settle(1, 0.1)).toBeCloseTo(1, 10);
  });

  it("stays parked before the start delay", () => {
    expect(c1Settle(0.05, 0.1)).toBe(0);
  });
});
