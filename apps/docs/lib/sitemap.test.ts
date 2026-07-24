import { readdirSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import { describe, expect, test } from "vitest";
import sitemap, { sitemapEntries } from "../app/sitemap";
import { THEMES } from "./catalog";
import { SITE_ORIGIN } from "./site";

const APP = resolve(process.cwd(), "app");

/** An independent walk, so the sitemap and this test must agree on the routes. */
function staticRoutes(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((item) => {
    const full = join(dir, item.name);
    if (item.isDirectory()) {
      if (item.name === ".next" || item.name.startsWith("[")) return [];
      return staticRoutes(full);
    }
    if (item.name !== "page.tsx") return [];
    const segments = relative(APP, dir)
      .split("/")
      .filter((s) => s && !s.startsWith("("));
    return [`/${segments.join("/")}`.replace(/\/$/, "") || "/"];
  });
}

describe("sitemap", () => {
  const routes = new Set(sitemapEntries().map((entry) => entry.route));

  test("covers every static page except the /docs redirect", () => {
    const expected = new Set([
      ...staticRoutes(APP).filter((route) => route !== "/docs"),
      ...THEMES.map((theme) => `/themes/${theme}`),
      "/llms.txt",
    ]);
    expect(routes).toEqual(expected);
  });

  test("drops /docs and includes /llms.txt and home", () => {
    expect(routes.has("/docs")).toBe(false);
    expect(routes.has("/llms.txt")).toBe(true);
    expect(routes.has("/")).toBe(true);
  });

  test("every url is absolute under the site origin and carries a lastmod", () => {
    for (const entry of sitemap()) {
      expect(entry.url.startsWith(SITE_ORIGIN)).toBe(true);
      expect(entry.url).not.toMatch(/(?<!:)\/\//);
      expect(entry.lastModified).toBeInstanceOf(Date);
    }
  });
});
