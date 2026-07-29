import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

/**
 * Internal cores are deliberately barrel-only: consumers reach them through the
 * components that use them, so they carry no compatibility promise.
 */
const INTERNAL = new Set(["atmospheres-core", "sula-core", "sula-motion"]);
const LAYERS = ["primitives", "patterns", "atmospheres", "sula", "motion"];

const pkgRoot = path.resolve(__dirname, "..");
const pkg = JSON.parse(
  fs.readFileSync(path.join(pkgRoot, "package.json"), "utf8"),
) as {
  exports: Record<string, { types: string; import: string } | string>;
  typesVersions: Record<string, Record<string, string[]>>;
};

const componentSubpaths = LAYERS.flatMap((layer) =>
  fs
    .readdirSync(path.join(pkgRoot, "src", layer), { withFileTypes: true })
    .filter(
      (entry) =>
        entry.isDirectory() &&
        !INTERNAL.has(entry.name) &&
        fs.existsSync(path.join(pkgRoot, "src", layer, entry.name, "index.ts")),
    )
    .map((entry) => `${layer}/${entry.name}`),
).sort();

describe("subpath exports", () => {
  it("covers every component directory", () => {
    const declared = Object.keys(pkg.exports)
      .filter((key) => LAYERS.some((layer) => key.startsWith(`./${layer}/`)))
      .map((key) => key.slice(2))
      .sort();
    expect(declared).toEqual(componentSubpaths);
  });

  it("points every subpath at a built entry named after it", () => {
    for (const subpath of componentSubpaths) {
      const entry = pkg.exports[`./${subpath}`];
      expect(entry, subpath).toEqual({
        types: `./dist/${subpath}.d.ts`,
        import: `./dist/${subpath}.js`,
      });
    }
  });

  it("mirrors each subpath in typesVersions for non-exports resolvers", () => {
    const wildcard = pkg.typesVersions["*"];
    expect(wildcard).toBeDefined();
    for (const subpath of componentSubpaths) {
      expect(wildcard?.[subpath], subpath).toEqual([`./dist/${subpath}.d.ts`]);
    }
  });
});
