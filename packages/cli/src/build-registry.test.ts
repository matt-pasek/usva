import { readdirSync, readFileSync } from "node:fs";
import { beforeAll, describe, expect, it } from "vitest";
import {
  buildRegistry,
  NAMES,
  PATTERN_NAMES,
  PATTERNS,
  PRIMITIVES,
} from "./build-registry.js";
import { rewriteImports } from "./rewrite-imports.js";

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
    it("registry source matches package source once imports are flattened", () => {
      const json = JSON.parse(
        readFileSync(`../../registry/r/${name}.json`, "utf8"),
      );
      expect(json.files.length).toBeGreaterThan(0);
      for (const file of json.files as { path: string; content: string }[]) {
        const src = readFileSync(
          `../usva/src/primitives/${name}/${file.path}`,
          "utf8",
        );
        expect(file.content).toBe(rewriteImports(src));
      }
    });
  });

  describe.each(PATTERN_NAMES)("%s pattern parity", (name) => {
    it("registry source matches package source once imports are flattened", () => {
      const json = JSON.parse(
        readFileSync(`../../registry/r/${name}.json`, "utf8"),
      );
      expect(json.files.length).toBeGreaterThan(0);
      for (const file of json.files as { path: string; content: string }[]) {
        const src = readFileSync(
          `../usva/src/patterns/${name}/${file.path}`,
          "utf8",
        );
        expect(file.content).toBe(rewriteImports(src));
      }
    });
  });

  describe.each([
    ...NAMES,
    ...PATTERN_NAMES,
  ])("%s is self-contained", (name) => {
    it("emits no import that escapes components/ui", () => {
      const json = JSON.parse(
        readFileSync(`../../registry/r/${name}.json`, "utf8"),
      );
      for (const file of json.files as { content: string }[])
        expect(file.content).not.toMatch(/from "\.\.\//);
    });
  });

  it("declares a registryDependency for every sibling component it imports", () => {
    const missing: string[] = [];
    for (const name of [...NAMES, ...PATTERN_NAMES]) {
      const json = JSON.parse(
        readFileSync(`../../registry/r/${name}.json`, "utf8"),
      );
      const declared: string[] = json.registryDependencies;
      // A registry item may ship a plain .ts helper alongside its .tsx, so both
      // extensions have to normalize to the specifier the source imports.
      const own = (json.files as { path: string }[]).map((f) =>
        f.path.replace(/\.tsx?$/, ""),
      );
      for (const file of json.files as { content: string }[])
        for (const match of file.content.matchAll(/from "\.\/([^"]+)"/g)) {
          const imported = match[1];
          if (
            imported &&
            !own.includes(imported) &&
            !declared.includes(imported)
          )
            missing.push(`${name} -> ${imported}`);
        }
    }
    expect(missing).toEqual([]);
  });
});
