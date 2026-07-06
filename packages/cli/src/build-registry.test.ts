import { readFileSync } from "node:fs";
import { beforeAll, describe, expect, it } from "vitest";
import { buildRegistry, NAMES, PATTERN_NAMES } from "./build-registry.js";

describe("buildRegistry", () => {
  beforeAll(async () => {
    await buildRegistry();
  });

  it("emits button.json with embedded source", () => {
    const json = JSON.parse(
      readFileSync("../../registry/r/button.json", "utf8"),
    );
    expect(json.name).toBe("button");
    expect(json.files[0].content).toContain("buttonVariants");
  });

  describe.each(NAMES)("%s registry parity", (name) => {
    it("registry source is byte-identical to package source (no drift)", () => {
      const json = JSON.parse(
        readFileSync(`../../registry/r/${name}.json`, "utf8"),
      );
      expect(json.files.length).toBeGreaterThan(0);
      for (const file of json.files as { path: string; content: string }[]) {
        const src = readFileSync(
          `../usva/src/primitives/${name}/${file.path}`,
          "utf8",
        );
        expect(file.content).toBe(src);
      }
    });
  });

  describe.each(PATTERN_NAMES)("%s pattern parity", (name) => {
    it("registry source is byte-identical to package source (no drift)", () => {
      const json = JSON.parse(
        readFileSync(`../../registry/r/${name}.json`, "utf8"),
      );
      expect(json.files.length).toBeGreaterThan(0);
      for (const file of json.files as { path: string; content: string }[]) {
        const src = readFileSync(
          `../usva/src/patterns/${name}/${file.path}`,
          "utf8",
        );
        expect(file.content).toBe(src);
      }
    });
  });
});
