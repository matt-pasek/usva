import { describe, expect, it } from "vitest";
import { blendModeFor, type Rgb, relativeLuminance } from "./effects-color.js";

const SAVI_BG: Rgb = [0xe7 / 255, 0xdc / 255, 0xc8 / 255];
const KAJO_BG: Rgb = [0x0d / 255, 0x0d / 255, 0x11 / 255];

describe("relativeLuminance", () => {
  it("anchors at black and white", () => {
    expect(relativeLuminance([0, 0, 0])).toBeCloseTo(0, 6);
    expect(relativeLuminance([1, 1, 1])).toBeCloseTo(1, 6);
  });

  it("weights green above red above blue", () => {
    const [r, g, b] = [
      relativeLuminance([1, 0, 0]),
      relativeLuminance([0, 1, 0]),
      relativeLuminance([0, 0, 1]),
    ];
    expect(g).toBeGreaterThan(r);
    expect(r).toBeGreaterThan(b);
  });
});

describe("blendModeFor", () => {
  it("stains a light ground and emits on a dark one", () => {
    expect(blendModeFor(SAVI_BG)).toBe("absorptive");
    expect(blendModeFor(KAJO_BG)).toBe("emissive");
  });
});
