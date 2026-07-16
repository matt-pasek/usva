import { describe, expect, it } from "vitest";
import { routaFragmentShader as shader } from "./routa-shader.js";

describe("Routa relief shader", () => {
  it("builds frost heave from the unused craquelure field", () => {
    expect(shader).toContain("float craquelure(vec2 p)");
    expect(shader).toContain("float ditherAlpha(");
    expect(shader).toContain("craquelure(");
    expect(shader).toContain("float heightAt(vec2 p)");
  });

  it("uses explicit finite differences rather than screen derivatives", () => {
    expect(shader).toContain("heightAt(p + vec2(eps, 0.0))");
    expect(shader).toContain("heightAt(p + vec2(0.0, eps))");
    expect(shader).not.toContain("fwidth(");
    expect(shader).not.toContain("dFdx(");
    expect(shader).not.toContain("dFdy(");
  });

  it("stains only from fissure depth on a light ground", () => {
    const absorptive = shader.slice(shader.indexOf("vec3 absorbed ="));
    expect(absorptive).toContain("soak(fissure * SOAK, SIGMA)");
    expect(absorptive).toContain("fragColor = vec4(absorbed * alpha, alpha)");
    expect(absorptive).not.toContain("composite(");
  });

  it("keeps a separate emissive relief reading for dark themes", () => {
    expect(shader).toContain("if (uAbsorb < 0.5)");
    expect(shader).toContain("fragColor = composite(");
  });

  it("propagates the fissures once and then settles", () => {
    expect(shader).toContain("uniform float uGrowthRate");
    expect(shader).toContain(
      "float progress = clamp(0.1 + uTime * uGrowthRate, 0.0, 1.0)",
    );
    expect(shader).toContain(
      "fissure *= smoothstep(arrival - 0.08, arrival + 0.08, progress)",
    );
    expect(shader).not.toContain("sin(uTime * uGrowthRate");
  });
});
