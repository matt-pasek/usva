import { readdirSync, readFileSync } from "node:fs";
import { beforeAll, describe, expect, it } from "vitest";
import {
  buildRegistry,
  NAMES,
  PATTERN_NAMES,
  PATTERNS,
  PRIMITIVES,
  SULA,
  SULA_NAMES,
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

  it("ships every sula component through the registry", () => {
    expect([...SULA_NAMES].sort()).toEqual(dirsIn(SULA));
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

  describe.each(SULA_NAMES)("%s sula parity", (name) => {
    it("registry source matches package source once imports are flattened", () => {
      const json = JSON.parse(
        readFileSync(`../../registry/r/${name}.json`, "utf8"),
      );
      expect(json.files.length).toBeGreaterThan(0);
      for (const file of json.files as { path: string; content: string }[]) {
        const src = readFileSync(
          `../usva/src/sula/${name}/${file.path}`,
          "utf8",
        );
        expect(file.content).toBe(rewriteImports(src));
      }
    });
  });

  describe.each([
    ...NAMES,
    ...PATTERN_NAMES,
    ...SULA_NAMES,
  ])("%s is self-contained", (name) => {
    it("emits no import that escapes components/ui", () => {
      const json = JSON.parse(
        readFileSync(`../../registry/r/${name}.json`, "utf8"),
      );
      for (const file of json.files as { content: string }[])
        expect(file.content).not.toMatch(/from "\.\.\//);
    });
  });

  it("declares a registryDependency for every sibling it imports", () => {
    const allNames = [...NAMES, ...PATTERN_NAMES, ...SULA_NAMES];
    const read = (name: string) =>
      JSON.parse(readFileSync(`../../registry/r/${name}.json`, "utf8"));
    const provides = new Map<string, Set<string>>();
    for (const name of allNames) {
      const json = read(name);
      provides.set(
        name,
        new Set(
          (json.files as { path: string }[]).map((f) =>
            f.path.replace(/\.tsx?$/, ""),
          ),
        ),
      );
    }
    const missing: string[] = [];
    for (const name of allNames) {
      const json = read(name);
      const declared: string[] = json.registryDependencies;
      const own = provides.get(name) ?? new Set<string>();
      // A dependency resolves as either a direct basename (old convention) or an
      // item name whose emitted files provide the basename (new convention).
      const fromDeps = new Set<string>();
      for (const dep of declared) {
        fromDeps.add(dep);
        for (const basename of provides.get(dep) ?? []) fromDeps.add(basename);
      }
      for (const file of json.files as { content: string }[])
        for (const match of file.content.matchAll(/from "\.\/([^"]+)"/g)) {
          const imported = match[1];
          if (imported && !own.has(imported) && !fromDeps.has(imported))
            missing.push(`${name} -> ${imported}`);
        }
    }
    expect(missing).toEqual([]);
  });
});
