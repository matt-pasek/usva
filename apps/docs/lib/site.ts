import type { Metadata } from "next";
import config from "../../../usva.config.json" with { type: "json" };

export const SITE_ORIGIN: string = config.siteOrigin;
export const PACKAGE_NAME: string = config.packageName;

export const registryUrl = (name: string): string =>
  `${SITE_ORIGIN}/r/${name}.json`;

export const canonicalUrl = (path: string): string =>
  path === "/" || path === "" ? SITE_ORIGIN : `${SITE_ORIGIN}${path}`;

/**
 * The one door every page's metadata goes through. It stamps the canonical and
 * the OpenGraph url from a single path, so no page can ship without them and no
 * two pages can disagree about which url they are.
 */
export function pageMetadata(path: string, meta: Metadata): Metadata {
  const url = canonicalUrl(path);
  return {
    ...meta,
    alternates: { ...meta.alternates, canonical: url },
    openGraph: { ...meta.openGraph, url },
  };
}
