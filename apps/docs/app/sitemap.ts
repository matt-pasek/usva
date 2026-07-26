import { execSync } from "node:child_process";
import { readdirSync, statSync } from "node:fs";
import { join, relative, resolve } from "node:path";
import type { MetadataRoute } from "next";
import { THEMES } from "@/lib/catalog";
import { SITE_ORIGIN } from "@/lib/site";

const APP = resolve(process.cwd(), "app");

interface Entry {
  route: string;
  file: string;
}

/**
 * Every static `page.tsx` is a route, so the sitemap can never fall behind the
 * app. Dynamic segments (`[theme]`) are skipped here and expanded below; route
 * groups are transparent to the url.
 */
function walk(dir: string): Entry[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((item) => {
    const full = join(dir, item.name);
    if (item.isDirectory()) {
      if (item.name === ".next" || item.name.startsWith("[")) return [];
      return walk(full);
    }
    if (item.name !== "page.tsx") return [];
    const segments = relative(APP, dir)
      .split("/")
      .filter((s) => s && !s.startsWith("("));
    return [
      { route: `/${segments.join("/")}`.replace(/\/$/, "") || "/", file: full },
    ];
  });
}

/** The last commit that touched the backing file, the one field google reads. */
function lastModified(file: string): Date {
  try {
    const iso = execSync(`git log -1 --format=%cI -- "${file}"`, {
      cwd: APP,
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
    if (iso) return new Date(iso);
  } catch {
    // git is not always present at build; fall through to the filesystem.
  }
  try {
    return statSync(file).mtime;
  } catch {
    return new Date();
  }
}

export function sitemapEntries(): Entry[] {
  const staticPages = walk(APP).filter((entry) => entry.route !== "/docs");
  const themePage = resolve(APP, "themes/[theme]/page.tsx");
  const themes = THEMES.map((theme) => ({
    route: `/themes/${theme}`,
    file: themePage,
  }));
  const llms: Entry = {
    route: "/llms.txt",
    file: resolve(APP, "llms.txt/route.ts"),
  };
  const skill: Entry = {
    route: "/skill.md",
    file: resolve(APP, "skill.md/route.ts"),
  };
  return [...staticPages, ...themes, llms, skill];
}

export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapEntries().map(({ route, file }) => ({
    url: route === "/" ? SITE_ORIGIN : `${SITE_ORIGIN}${route}`,
    lastModified: lastModified(file),
  }));
}
