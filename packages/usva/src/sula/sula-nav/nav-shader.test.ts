import { describe, expect, it } from "vitest";
import { fragmentShader, vertexShader } from "./nav-shader.js";

describe("nav shader", () => {
  it("targets WebGL2, which is where fwidth and dFdx live without an extension", () => {
    expect(vertexShader.startsWith("#version 300 es")).toBe(true);
    expect(fragmentShader.startsWith("#version 300 es")).toBe(true);
  });

  it("builds the field from signed distance and a smooth minimum", () => {
    expect(fragmentShader).toContain("sdRoundBox");
    expect(fragmentShader).toContain("sdSegment");
    expect(fragmentShader).toContain("smin");
  });

  it("carries no react-bits metaball lineage", () => {
    expect(fragmentShader).not.toMatch(/r\s*\*\s*r\s*\/\s*dot/);
    expect(fragmentShader).not.toMatch(/-\s*1\.3/);
  });
});
