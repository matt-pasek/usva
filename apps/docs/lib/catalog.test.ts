import { readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import {
  byLayer,
  CATALOG,
  counts,
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

// shared infrastructure, not components: they have no docs page and no registry entry of their own
const INFRASTRUCTURE = new Set([
  "atmospheres-core",
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
