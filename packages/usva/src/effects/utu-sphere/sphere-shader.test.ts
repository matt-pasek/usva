import { describe, expect, it } from "vitest";
import { sphereFragmentShader } from "./sphere-shader.js";

describe("UtuSphere fragment compositing", () => {
  it("normalizes emitted color before using its peak as alpha", () => {
    expect(sphereFragmentShader).toContain(
      "vec3 display = col / max(peak, 1e-4)",
    );
    expect(sphereFragmentShader).toContain(
      "fragColor = vec4(display, peak * uAlpha)",
    );
    expect(sphereFragmentShader).not.toContain("fragColor = vec4(col, a)");
  });

  it("defines the inward wisp falloff with ordered smoothstep edges", () => {
    expect(sphereFragmentShader).toContain(
      "1.0 - smoothstep(uRadius * 0.4, Rout, length(uv))",
    );
  });
});
