import { describe, expect, it } from "vitest";
import {
  KYNNOS_DEFAULTS,
  MAX_WARP_TURNS,
  MIN_WARP_TURNS,
  resolveParams,
  ridge,
} from "./kynnos-field.js";

const SAMPLES = 2000;

function fractionWhere(shape: number, test: (h: number) => boolean): number {
  let hits = 0;
  for (let i = 0; i < SAMPLES; i++) {
    if (test(ridge(i / SAMPLES, shape))) hits++;
  }
  return hits / SAMPLES;
}

describe("ridge", () => {
  it("runs from a floor at 0 to a crest at 1", () => {
    expect(ridge(0, KYNNOS_DEFAULTS.ridgeShape)).toBeCloseTo(0);
    expect(ridge(0.5, KYNNOS_DEFAULTS.ridgeShape)).toBeCloseTo(1);
    expect(ridge(1, KYNNOS_DEFAULTS.ridgeShape)).toBeCloseTo(0);
  });

  it("is periodic", () => {
    expect(ridge(3.31, 1.9)).toBeCloseTo(ridge(0.31, 1.9));
  });

  it("keeps the floor flatter than the crest, because clay compresses", () => {
    const shape = KYNNOS_DEFAULTS.ridgeShape;
    const floor = fractionWhere(shape, (h) => h < 0.25);
    const crest = fractionWhere(shape, (h) => h > 0.75);
    expect(floor).toBeGreaterThan(crest * 1.5);
  });
});

describe("resolveParams", () => {
  it("floors the warp at several furrow spacings, so the rings cannot read as rings", () => {
    expect(resolveParams({ warpAmt: 0 }).warpAmt).toBe(MIN_WARP_TURNS);
    expect(KYNNOS_DEFAULTS.warpAmt).toBeGreaterThanOrEqual(MIN_WARP_TURNS);
  });

  it("caps the warp before the grooves fold into mush", () => {
    expect(resolveParams({ warpAmt: 40 }).warpAmt).toBe(MAX_WARP_TURNS);
  });

  it("keeps the wheel origin off-frame at every aspect ratio", () => {
    const { origin } = resolveParams({ origin: [0.1, -0.05] });
    expect(Math.abs(origin[0])).toBeGreaterThan(0.5);
    expect(Math.abs(origin[1])).toBeGreaterThan(0.5);
    expect(origin[1]).toBeLessThan(0);
  });
});
