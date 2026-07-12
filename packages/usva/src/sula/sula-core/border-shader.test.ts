import { describe, expect, it } from "vitest";
import { borderFragmentShader } from "./border-shader.js";

describe("border shader", () => {
  it("flows a filled outer shell inward instead of fading a stroked ring", () => {
    expect(borderFragmentShader).toContain("uniform float uIntro");
    expect(borderFragmentShader).toContain("float d = front - win");
    expect(borderFragmentShader).not.toContain("abs(win) - uThickness");
    expect(borderFragmentShader).not.toContain("uAlpha");
  });

  it("antialiases the shell in CSS-pixel space", () => {
    expect(borderFragmentShader).toContain("float dCss = d / max(uDpr, 1.0)");
    expect(borderFragmentShader).toContain("max(fwidth(d), 0.75 * uDpr)");
  });

  it("keeps the shell body at the exact theme background and limits glass to the edge", () => {
    expect(borderFragmentShader).toContain("vec3 glass = uBackdrop");
    expect(borderFragmentShader).toContain("float glassMask");
    expect(borderFragmentShader).toContain(
      "glass = mix(glass, edgeGlass, glassMask)",
    );
    expect(borderFragmentShader).toContain("sweep * glassMask");
    expect(borderFragmentShader).not.toContain(
      "vec3 glass = mix(uBackdrop, uTint, 0.92)",
    );
  });
});
