import { describe, expect, it } from "vitest";
import { keyLight, POIMU_DEFAULTS, resolveParams } from "./poimu-field.js";

const length = (v: [number, number, number]) => Math.hypot(v[0], v[1], v[2]);

describe("resolveParams", () => {
  it("falls back to the defaults", () => {
    expect(resolveParams()).toEqual(POIMU_DEFAULTS);
  });

  it("takes overrides without dropping the rest", () => {
    const params = resolveParams({ relief: 3 });
    expect(params.relief).toBe(3);
    expect(params.sheen).toBe(POIMU_DEFAULTS.sheen);
  });
});

describe("keyLight", () => {
  it("is a unit vector across the whole pointer range", () => {
    for (const x of [-1.5, -0.5, 0, 0.5, 1.5]) {
      for (const y of [-1.5, 0, 1.5]) {
        expect(length(keyLight(POIMU_DEFAULTS, [x, y], 1))).toBeCloseTo(1, 6);
      }
    }
  });

  it("rests at the configured direction when the pointer is away", () => {
    const at = keyLight(POIMU_DEFAULTS, [1, 1], 0);
    const rest = keyLight(POIMU_DEFAULTS, [0, 0], 1);
    expect(at).toEqual(rest);
  });

  it("swings toward the pointer", () => {
    const left = keyLight(POIMU_DEFAULTS, [-1, 0], 1);
    const right = keyLight(POIMU_DEFAULTS, [1, 0], 1);
    expect(right[0]).toBeGreaterThan(left[0]);
  });

  it("keeps the lamp in front of the sheet, so folds never invert", () => {
    const params = resolveParams({ key: [0, 0, 0.05], tilt: 5 });
    expect(keyLight(params, [1, 1], 1)[2]).toBeGreaterThan(0);
  });
});
