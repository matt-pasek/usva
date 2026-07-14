import { describe, expect, it } from "vitest";
import { utuFragmentShader } from "./utu-shader.js";

describe("Utu fragment compositing", () => {
  it("normalizes emitted color before using its peak as alpha", () => {
    expect(utuFragmentShader).toContain("vec3 display = col / max(peak, 1e-4)");
    expect(utuFragmentShader).toContain(
      "fragColor = vec4(display, peak * uAlpha)",
    );
    expect(utuFragmentShader).not.toContain("fragColor = vec4(col, a)");
  });

  it("defines the inward wisp falloff with ordered smoothstep edges", () => {
    expect(utuFragmentShader).toContain(
      "1.0 - smoothstep(uRadius * 0.4, Rout, length(uv))",
    );
  });
});
