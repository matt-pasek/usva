import type { MetadataRoute } from "next";
import { CATALOG, THEMES } from "@/lib/catalog";
import { SITE_ORIGIN } from "@/lib/site";

const pages = [
  "",
  "/design-language",
  "/docs/get-started",
  "/docs/get-started/installation",
  "/docs/get-started/theming",
  "/docs/get-started/for-agents",
  "/docs/get-started/index",
  "/tokens",
  "/recipes",
  "/composer",
];

const routes = [
  ...pages,
  ...THEMES.map((theme) => `/themes/${theme}`),
  ...CATALOG.map((entry) => `/docs/components/${entry.slug}`),
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${SITE_ORIGIN}${route}`,
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
