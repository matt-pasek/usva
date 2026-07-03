import type { MetadataRoute } from "next";

const routes = [
  "",
  "/design-language",
  "/docs/installation",
  "/docs/theming",
  "/docs/components/button",
  "/docs/components/badge",
  "/docs/components/card",
  "/docs/components/input",
  "/docs/components/tooltip",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((r) => ({
    url: `https://usva.dev${r}`,
    changeFrequency: "weekly",
    priority: r === "" ? 1 : 0.7,
  }));
}
