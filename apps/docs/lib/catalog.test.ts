import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import {
  byLayer,
  CATALOG,
  counts,
  DARK_ONLY,
  INTENSITY_BY_LAYER,
  type Layer,
} from "./catalog";

const SRC = join(import.meta.dirname, "../../../packages/usva/src");

const LAYER_DIRS: Record<Layer, string> = {
  primitive: "primitives",
  pattern: "patterns",
  motion: "motion",
  sula: "sula",
  atmosphere: "atmospheres",
};

// shared infrastructure, not components
const INFRASTRUCTURE = new Set([
  "atmospheres-core",
  "overlay-core",
  "sula-core",
  "sula-motion",
]);

const dirsFor = (layer: Layer): string[] =>
  readdirSync(join(SRC, LAYER_DIRS[layer]), { withFileTypes: true })
    .filter((e) => e.isDirectory() && !INFRASTRUCTURE.has(e.name))
    .map((e) => e.name)
    .sort();

describe.each(Object.keys(LAYER_DIRS) as Layer[])("%s parity", (layer) => {
  test("catalog slugs and source directories are the same set", () => {
    const slugs = byLayer(layer)
      .map((e) => e.slug)
      .sort();
    expect(slugs).toEqual(dirsFor(layer));
  });

  test("every entry carries the intensity of its layer", () => {
    for (const entry of byLayer(layer)) {
      expect(entry.intensity).toBe(INTENSITY_BY_LAYER[layer]);
    }
  });
});

test("slugs are unique", () => {
  const slugs = CATALOG.map((e) => e.slug);
  expect(new Set(slugs).size).toBe(slugs.length);
});

describe("dark-only atmospheres", () => {
  /** The renderer's own table, read rather than imported: hiddenOnGround lives
   * in a "use client" chunk and cannot be called from a server page. */
  const groundTable = (): Record<string, string> => {
    const src = readFileSync(
      join(SRC, "atmospheres/atmospheres-core/atmospheres-ground.ts"),
      "utf8",
    );
    const block = src.match(
      /LIGHT_GROUND_SUPPORT = \{([\s\S]*?)\} as const/,
    )?.[1];
    if (!block) throw new Error("LIGHT_GROUND_SUPPORT is no longer parseable");
    return Object.fromEntries(
      [...block.matchAll(/(\w+):\s*"(\w+)"/g)].map(
        (m) => [m[1], m[2]] as const,
      ),
    );
  };

  test("the table still parses and covers every atmosphere", () => {
    const table = groundTable();
    expect(Object.keys(table).sort()).toEqual(
      byLayer("atmosphere")
        .map((e) => e.slug)
        .sort(),
    );
  });

  test("DARK_ONLY matches every atmosphere that refuses a light ground", () => {
    const table = groundTable();
    const refuses = Object.entries(table)
      .filter(([, support]) => support === "forbid" || support === "restrict")
      .map(([name]) => name)
      .sort();
    expect([...DARK_ONLY].sort()).toEqual(refuses);
  });
});

test("every entry has a real summary", () => {
  for (const entry of CATALOG) {
    expect(entry.summary.length).toBeGreaterThan(15);
    expect(entry.summary).not.toMatch(/—|--/);
  }
});

test("counts match the catalog", () => {
  expect(counts.primitives).toBe(byLayer("primitive").length);
  expect(counts.patterns).toBe(byLayer("pattern").length);
  expect(counts.motion).toBe(byLayer("motion").length);
  expect(counts.sula).toBe(byLayer("sula").length);
  expect(counts.atmospheres).toBe(byLayer("atmosphere").length);
  expect(counts.total).toBe(CATALOG.length);
});

test("every sula entry states its composition prohibitions", () => {
  for (const entry of byLayer("sula")) {
    expect(entry.rules?.length).toBeGreaterThan(0);
  }
});

test("nothing is marked new before v1.0.0", () => {
  expect(CATALOG.filter((e) => e.isNew)).toEqual([]);
});
