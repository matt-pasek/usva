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

  it("stains rather than composites on a light ground", () => {
    const absorptive = shader.slice(shader.indexOf("vec3 absorbed ="));
    expect(absorptive).toContain("fragColor = vec4(absorbed * alpha, alpha)");
    expect(absorptive).not.toContain("composite(");
  });

  it("carries the heave on clay as held damp, not as a darker multiply", () => {
    expect(shader).toContain("soak(fissure * SOAK + relief, SIGMA)");
    expect(shader).toContain("(1.0 - field.y) * uRelief");
  });

  it("keeps plate interiors flat, so the medial-axis kink has no slope to bend", () => {
    expect(shader).toContain("const float PLATE_EDGE");
    expect(shader).toContain(
      "smoothstep(uCrackWidth, uCrackWidth + PLATE_EDGE, wall)",
    );
    expect(shader).toContain("dome = dome * dome * (3.0 - 2.0 * dome)");
    expect(shader).not.toContain("smoothstep(uCrackWidth, 0.62, wall)");
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
