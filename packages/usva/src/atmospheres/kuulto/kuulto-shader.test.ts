import { describe, expect, it } from "vitest";
import { KUULTO_DEFAULTS, type KuultoColors } from "./kuulto-field.js";
import { kuultoFragmentShader as shader } from "./kuulto-shader.js";
import { kuultoUniforms } from "./kuulto-uniforms.js";

const colors: KuultoColors = {
  key: [1, 0, 0],
  fill: [0, 1, 0],
  rim: [0, 0, 1],
};

describe("kuultoFragmentShader", () => {
  it("declares every uniform the module uploads", () => {
    for (const name of Object.keys(kuultoUniforms(colors, KUULTO_DEFAULTS))) {
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
