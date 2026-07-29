import { describe, expect, it } from "vitest";
import { utuFragmentShader } from "./utu-shader.js";

describe("Utu fragment compositing", () => {
  it("normalizes emitted color before using its peak as alpha", () => {
    expect(utuFragmentShader).toContain("vec3 display = col / max(peak, 1e-4)");
    expect(utuFragmentShader).toContain(
      "fragColor = composite(display, peak * uAlpha)",
    );
    expect(utuFragmentShader).not.toContain("fragColor = vec4(col, a)");
  });

  it("defines the inward wisp falloff with ordered smoothstep edges", () => {
    expect(utuFragmentShader).toContain(
      "1.0 - smoothstep(uRadius * 0.4, Rout, length(uv))",
    );
  });

  it("keeps physical extinction separate from the ground blend", () => {
    expect(utuFragmentShader).toContain("uniform float uExtinction");
    expect(utuFragmentShader).toContain(
      "T *= exp(-density * uExtinction * stepLen)",
    );
    expect(utuFragmentShader).toContain("if (uAbsorb < 0.5)");
  });

  it("accumulates literal optical depth from zero", () => {
    expect(utuFragmentShader).toContain("float depth = 0.0");
    expect(utuFragmentShader).toContain("depth += density * stepLen");
  });

  it("turns optical depth into premultiplied pigment on clay", () => {
    const absorptive = utuFragmentShader.slice(
      utuFragmentShader.indexOf("vec3 absorbed ="),
    );

    expect(absorptive).toContain("vec3 absorbed = hold(uPigment, uStainFloor)");
    expect(absorptive).toContain("soak(depth * SOAK, SIGMA)");
    expect(absorptive).toContain("fragColor = vec4(absorbed * alpha, alpha)");
    expect(absorptive).not.toContain("composite(");
  });
});
