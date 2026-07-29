import { describe, expect, it } from "vitest";
import { registryUrl, SITE_ORIGIN } from "./config.js";

describe("config", () => {
  it("reads the origin from usva.config.json", () => {
    expect(SITE_ORIGIN).toBe("https://usva.build");
  });

  it("has no trailing slash, so callers can concatenate safely", () => {
    expect(SITE_ORIGIN.endsWith("/")).toBe(false);
  });

  it("builds a registry url for a component", () => {
    expect(registryUrl("button")).toBe("https://usva.build/r/button.json");
  });
});
