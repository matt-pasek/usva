import { readdirSync, readFileSync } from "node:fs";
import { beforeAll, describe, expect, it } from "vitest";
import {
  buildRegistry,
  NAMES,
  PATTERN_NAMES,
  PATTERNS,
  PRIMITIVES,
} from "./build-registry.js";

const dirsIn = (root: string): string[] =>
  readdirSync(root, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .sort();

describe("buildRegistry", () => {
  beforeAll(async () => {
    await buildRegistry();
  });

  it("ships every primitive through the registry", () => {
    expect([...NAMES].sort()).toEqual(dirsIn(PRIMITIVES));
  });

  it("ships every pattern through the registry", () => {
    expect([...PATTERN_NAMES].sort()).toEqual(dirsIn(PATTERNS));
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
