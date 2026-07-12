import { describe, expect, it } from "vitest";
import {
  approach,
  breathe,
  buildRamp,
  clamp01,
  DAWN,
  DEFAULT_PARAMS,
  mixWhite,
  monoRamp,
  type Rgb,
  resolveParams,
  scaleRgb,
  smoother,
} from "./sphere-geometry.js";

describe("clamp01", () => {
  it("pins to the unit range", () => {
    expect(clamp01(-2)).toBe(0);
    expect(clamp01(0.4)).toBe(0.4);
    expect(clamp01(3)).toBe(1);
  });
});

describe("smoother", () => {
  it("hits the endpoints and the midpoint", () => {
    expect(smoother(0)).toBe(0);
    expect(smoother(1)).toBe(1);
    expect(smoother(0.5)).toBeCloseTo(0.5, 5);
  });
  it("clamps out-of-range input", () => {
    expect(smoother(-1)).toBe(0);
    expect(smoother(2)).toBe(1);
  });
});

describe("approach", () => {
  it("moves a fraction of the way toward the target", () => {
    expect(approach(0, 10, 0.5)).toBe(5);
  });
  it("converges over repeated steps", () => {
    let v = 0;
    for (let i = 0; i < 100; i++) v = approach(v, 1, 0.1);
    expect(v).toBeCloseTo(1, 3);
  });
});

describe("breathe", () => {
  it("returns the base at t=0", () => {
    expect(breathe(0, 10, 0.06, 0.05)).toBe(10);
  });
  it("stays within the amplitude envelope", () => {
    for (let t = 0; t < 40; t += 0.7) {
      const v = breathe(t, 10, 0.06, 0.05);
      expect(v).toBeGreaterThanOrEqual(10 * (1 - 0.06) - 1e-9);
      expect(v).toBeLessThanOrEqual(10 * (1 + 0.06) + 1e-9);
    }
  });
});

describe("resolveParams", () => {
  it("sizes the default core to bleed past the short side and fill the frame", () => {
    expect(DEFAULT_PARAMS.radius).toBeGreaterThan(1);
    expect(DEFAULT_PARAMS.radius).toBeLessThanOrEqual(2);
  });

  it("returns the defaults untouched with no overrides", () => {
    expect(resolveParams()).toEqual(DEFAULT_PARAMS);
  });
  it("layers overrides over the defaults", () => {
    const p = resolveParams({ bands: 12, exposure: 5 });
    expect(p.bands).toBe(12);
    expect(p.exposure).toBe(5);
    expect(p.radius).toBe(DEFAULT_PARAMS.radius);
  });
});

describe("colour ramp", () => {
  const accent: Rgb = [0.8, 0.3, 0.75];

  it("scaleRgb darkens toward black and stays in range", () => {
    const d = scaleRgb(accent, 0.22);
    expect(d[0]).toBeCloseTo(0.8 * 0.22, 6);
    for (const c of d) expect(c).toBeGreaterThanOrEqual(0);
  });

  it("mixWhite lightens toward white and clamps", () => {
    const [hr, hg, hb] = mixWhite(accent, 0.55);
    expect(hr).toBeGreaterThanOrEqual(accent[0]);
    expect(hg).toBeGreaterThanOrEqual(accent[1]);
    expect(hb).toBeGreaterThanOrEqual(accent[2]);
    for (const c of mixWhite([0.9, 0.9, 0.9], 2))
      expect(c).toBeLessThanOrEqual(1);
  });

  it("monoRamp builds a deep < mid < hot ramp from one accent", () => {
    const { deep, mid, hot } = monoRamp(accent);
    const lum = (c: Rgb) => c[0] + c[1] + c[2];
    expect(lum(deep)).toBeLessThan(lum(mid));
    expect(lum(mid)).toBeLessThan(lum(hot));
  });

  it("buildRamp defaults to the dawn gradient", () => {
    expect(buildRamp()).toEqual(DAWN);
  });

  it("dawn is not one hue: deep is cooler than hot", () => {
    // blue channel dominates the violet valley, red the warm core
    expect(DAWN.deep[2]).toBeGreaterThan(DAWN.deep[0]);
    expect(DAWN.hot[0]).toBeGreaterThan(DAWN.hot[2]);
  });

  it("buildRamp honours explicit stop overrides", () => {
    const deep: Rgb = [0.01, 0.02, 0.03];
    const ramp = buildRamp({ deep });
    expect(ramp.deep).toEqual(deep);
    expect(ramp.mid).toEqual(DAWN.mid);
  });
});
