import { canonicalUrl, SITE_ORIGIN } from "@/lib/site";

const REPO = "https://github.com/matt-pasek/usva";
const NPM = "https://www.npmjs.com/package/usva";
const AUTHOR_URL = "https://matt-pasek.dev";
const AUTHOR_GITHUB = "https://github.com/matt-pasek";

export const WEBSITE_ID = `${SITE_ORIGIN}/#website`;
export const PERSON_ID = `${SITE_ORIGIN}/#person`;
export const SOFTWARE_ID = `${SITE_ORIGIN}/#software`;

/**
 * The site's root graph: who made this, where the source lives, what it is.
 * SoftwareSourceCode rather than SoftwareApplication because usva is source you
 * install, not something a user runs, which also sidesteps the `offers`
 * requirement SoftwareApplication would fail. softwareVersion and datePublished
 * are held back until first publish rather than invented.
 */
export function rootGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE_ORIGIN,
        name: "usva.",
        description:
          "An open-source React design system, dual-distributed as an npm package and a shadcn-compatible registry.",
        publisher: { "@id": PERSON_ID },
        inLanguage: "en",
      },
      {
        "@type": "Person",
        "@id": PERSON_ID,
        name: "Mateusz Pasek",
        url: AUTHOR_URL,
        sameAs: [AUTHOR_URL, AUTHOR_GITHUB],
      },
      {
        "@type": "SoftwareSourceCode",
        "@id": SOFTWARE_ID,
        name: "usva.",
        description:
          "A React design language, design system and component library, extracted from two live consumer apps.",
        url: SITE_ORIGIN,
        author: { "@id": PERSON_ID },
        codeRepository: REPO,
        programmingLanguage: "TypeScript",
        runtimePlatform: "React",
        license: `${REPO}/blob/main/LICENSE.md`,
        isAccessibleForFree: true,
        targetProduct: {
          "@type": "SoftwareApplication",
          name: "usva.",
          applicationCategory: "DeveloperApplication",
          operatingSystem: "Web",
        },
        sameAs: [REPO, NPM],
      },
    ],
  };
}

export function breadcrumbList(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: canonicalUrl(item.path),
    })),
  };
}

export function techArticle(args: {
  path: string;
  headline: string;
  description?: string;
}) {
  const url = canonicalUrl(args.path);
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "@id": `${url}#article`,
    headline: args.headline,
    ...(args.description ? { description: args.description } : {}),
    url,
    isPartOf: { "@id": WEBSITE_ID },
    author: { "@id": PERSON_ID },
    inLanguage: "en",
  };
}
