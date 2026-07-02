import { readFileSync } from "node:fs";
import { describe, expect, it, beforeAll } from "vitest";
import { buildRegistry } from "./build-registry.js";

describe("buildRegistry", () => {
  beforeAll(async () => { await buildRegistry(); });
  it("emits button.json with embedded source", () => {
    const json = JSON.parse(readFileSync("../../registry/r/button.json", "utf8"));
    expect(json.name).toBe("button");
    expect(json.files[0].content).toContain("buttonVariants");
  });
  it("registry source is byte-identical to package source (no drift)", () => {
    const json = JSON.parse(readFileSync("../../registry/r/button.json", "utf8"));
    const src = readFileSync("../usva/src/primitives/button/button.tsx", "utf8");
    expect(json.files[0].content).toBe(src);
  });
});
