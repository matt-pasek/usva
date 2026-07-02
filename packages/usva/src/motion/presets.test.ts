import { describe, expect, it } from "vitest";
import { springs, variants } from "./presets.js";

describe("motion presets", () => {
  it("exposes a soft spring from tokens", () => {
    expect(springs.soft).toMatchObject({ type: "spring", stiffness: 210 });
  });
  it("fadeUp hides then shows", () => {
    expect(variants.fadeUp.hidden.opacity).toBe(0);
    expect(variants.fadeUp.show.opacity).toBe(1);
  });
});
