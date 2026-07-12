import { describe, expect, it } from "vitest";
import { filamentKnots, resolveFilamentParams } from "./filament-curve.js";

const params = resolveFilamentParams();

function knotAt(knots: readonly number[], index: number): number[] {
  return knots.slice(index * 3, index * 3 + 3);
}

describe("filamentKnots", () => {
  it("emits segments + 1 knots", () => {
    expect(filamentKnots(3.2, params)).toHaveLength((params.segments + 1) * 3);
  });

  it("closes the loop, so the filament has no ends", () => {
    for (const time of [0, 7.5, 61.25]) {
      const knots = filamentKnots(time, params);
      expect(knotAt(knots, 0)).toEqual(knotAt(knots, params.segments));
    }
  });

  it("moves over time", () => {
    expect(filamentKnots(0, params)).not.toEqual(filamentKnots(9, params));
  });
});
