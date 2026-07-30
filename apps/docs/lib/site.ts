import type { Metadata } from "next";
import config from "../../../usva.config.json" with { type: "json" };
import { OG_SIZE } from "./og-plate";

export const SITE_ORIGIN: string = config.siteOrigin;
export const PACKAGE_NAME: string = config.packageName;
export const TOKENS_PACKAGE: string = config.tokensPackageName;

export const NPM_PENDING = false;

export const SITE_DESCRIPTION =
  "A source-available React design system: dual-distributed as an npm package and a shadcn-compatible registry.";

export const registryUrl = (name: string): string =>
  `${SITE_ORIGIN}/r/${name}.json`;

export const canonicalUrl = (path: string): string =>
  path === "/" || path === "" ? SITE_ORIGIN : `${SITE_ORIGIN}${path}`;

export const ogImageUrl = (path: string): string =>
  path === "/" || path === ""
    ? `${SITE_ORIGIN}/og`
    : `${SITE_ORIGIN}/og${path}`;

const ogAlt = (meta: Metadata): string =>
  typeof meta.title === "string" ? `${meta.title} · usva.` : "usva.";

/**
 * The one door every page's metadata goes through. It stamps the canonical, the
 * OpenGraph url and the card from a single path, so no page can ship without
 * them and no two pages can disagree about which url they are.
 */
export function pageMetadata(path: string, meta: Metadata): Metadata {
  const url = canonicalUrl(path);
  const images = [
    {
      url: ogImageUrl(path),
      width: OG_SIZE.width,
      height: OG_SIZE.height,
      alt: ogAlt(meta),
      type: "image/png",
    },
  ];
  return {
    ...meta,
    alternates: { ...meta.alternates, canonical: url },
    openGraph: {
      ...meta.openGraph,
      url,
      images: meta.openGraph?.images ?? images,
    },
    twitter: { ...meta.twitter, images: meta.twitter?.images ?? images },
  };
}
