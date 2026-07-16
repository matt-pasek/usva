import { describe, expect, it } from "vitest";
import { vareFragmentShader as shader } from "./vare-shader.js";

describe("vare absorptive field", () => {
  it("derives literal troughs from the inverse cosine phase", () => {
    expect(shader).toContain("vec2 waves(vec2 p, vec2 source)");
    expect(shader).toContain("float trough = pow(1.0 - wave, exponent)");
    expect(shader).toContain("return vec2(emission, basin)");
  });

  it("recomputes the pointer lens for each height sample", () => {
    expect(shader).toContain("float phaseLens(vec2 p)");
    expect(shader).toContain("float lens = phaseLens(p)");
    expect(shader).not.toContain("waves(p, lens, source)");
  });

  it("keeps relief evaluation out of the emissive path", () => {
    const emissiveReturn = shader.indexOf("if (uAbsorb < 0.5)");
    const reliefSample = shader.indexOf("float heightX = waves(");

    expect(emissiveReturn).toBeGreaterThan(-1);
    expect(reliefSample).toBeGreaterThan(emissiveReturn);
  });

  it("writes undithered premultiplied coverage for absorptive clay", () => {
    const absorptive = shader.slice(shader.indexOf("float heightX = waves("));

    expect(absorptive).toContain("fragColor = vec4(absorbed * alpha, alpha)");
    expect(absorptive).not.toContain("ditherAlpha(");
    expect(absorptive).not.toContain("composite(");
  });
});
