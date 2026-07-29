import { existsSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";
import { describe, expect, test } from "vitest";
import { CATALOG, SUB_EXPORTS } from "@/lib/catalog";

const COMPONENTS = resolve(process.cwd(), "app/docs/components");

const pageSlugs = readdirSync(COMPONENTS, { withFileTypes: true })
  .filter(
    (entry) =>
      entry.isDirectory() &&
      existsSync(join(COMPONENTS, entry.name, "page.tsx")),
  )
  .map((entry) => entry.name)
  .sort();

/**
 * Every page under /docs/components has to be reachable from data, because the
 * sitemap and llms.txt are both built from it. A page that is in neither list
 * renders fine and is invisible to every crawler and agent.
 */
describe("component pages", () => {
  test("every page is either a catalog entry or a declared sub-export", () => {
    const known = new Set([
      ...CATALOG.map((entry) => entry.slug),
      ...SUB_EXPORTS.map((entry) => entry.slug),
    ]);
    expect(pageSlugs.filter((slug) => !known.has(slug))).toEqual([]);
  });

  test("every catalog entry and sub-export has a page", () => {
    const pages = new Set(pageSlugs);
    const missing = [
      ...CATALOG.map((e) => e.slug),
      ...SUB_EXPORTS.map((e) => e.slug),
    ].filter((slug) => !pages.has(slug));
    expect(missing).toEqual([]);
  });

  test("a sub-export names a real parent, and is not itself in the catalog", () => {
    const catalogSlugs = new Set(CATALOG.map((entry) => entry.slug));
    for (const sub of SUB_EXPORTS) {
      expect(catalogSlugs.has(sub.parent)).toBe(true);
      expect(catalogSlugs.has(sub.slug)).toBe(false);
    }
  });
});
