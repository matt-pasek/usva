import { describe, expect, it } from "vitest";
import { ROLE_NAMES, Z_LAYERS } from "./roles.js";

describe("roles", () => {
  it("includes scrim as a surface/backdrop color role", () => {
    expect(ROLE_NAMES).toContain("scrim");
  });

  it("exposes a z-index layer scale", () => {
    expect(Z_LAYERS).toMatchObject({
      base: expect.any(Number),
      dropdown: expect.any(Number),
      overlay: expect.any(Number),
      toast: expect.any(Number),
    });
  });
});
