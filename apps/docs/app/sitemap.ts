import type { MetadataRoute } from "next";
import { CATALOG, THEMES } from "@/lib/catalog";
import { SITE_ORIGIN } from "@/lib/site";

const pages = [
  "",
  "/design-language",
  "/design-language/color",
  "/design-language/type",
  "/design-language/space",
  "/design-language/depth",
  "/design-language/motion",
  "/design-language/iconography",
  "/design-language/intensity",
  "/design-language/voice",
  "/design-language/wordmark",
  "/design-language/accessibility",
  "/design-language/tokens",
  "/docs/get-started",
  "/docs/get-started/installation",
  "/docs/get-started/theming",
  "/docs/get-started/for-agents",
  "/docs/get-started/index",
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
