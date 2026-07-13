import { describe, expect, it } from "vitest";
import { POIMU_DEFAULTS, type PoimuColors } from "./poimu-field.js";
import { poimuFragmentShader as shader } from "./poimu-shader.js";
import { poimuUniforms } from "./poimu-uniforms.js";

const colors: PoimuColors = {
  key: [1, 0, 0],
  fill: [0, 1, 0],
  rim: [0, 0, 1],
};

describe("poimuFragmentShader", () => {
  it("declares every uniform the module uploads", () => {
    for (const name of Object.keys(poimuUniforms(colors, POIMU_DEFAULTS))) {
      expect(shader).toContain(name);
    }
  });

  it("lights a surface normal rather than mixing a palette", () => {
    expect(shader).toContain("surfaceNormal");
    expect(shader).toContain("lambert");
    expect(shader).toContain("sheen");
  });

  it("carries the alpha as the light intensity, tonemapped on luminance", () => {
    expect(shader).toContain("float peak = 1.0 - exp(-lum);");
    expect(shader).toContain("float alpha = peak * uAlpha;");
  });
});
