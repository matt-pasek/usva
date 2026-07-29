import Link from "next/link";
import type { ReactNode } from "react";
import { CATALOG, SUB_EXPORTS } from "@/lib/catalog";

const NAME_TO_SLUG: ReadonlyMap<string, string> = new Map(
  [...CATALOG, ...SUB_EXPORTS].map((entry) => [entry.name, entry.slug]),
);

/**
 * Names are matched longest-first so "AvatarGroup" wins over "Avatar" and
 * "PageHeader" over any shorter overlap. The \b boundaries keep it to the exact
 * capitalised word, so "card" the common noun never matches and "Card" never
 * fires inside "Cardinal".
 */
const NAME_PATTERN = new RegExp(
  `\\b(${[...NAME_TO_SLUG.keys()]
    .sort((a, b) => b.length - a.length)
    .map((name) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
    .join("|")})\\b`,
  "g",
);

const linkClass =
  "text-ink underline decoration-border underline-offset-2 hover:decoration-accent";

/**
 * Turns sibling component names in prose into links to their doc pages. A name
 * whose slug is `selfSlug` is left as plain text so a page never links to
 * itself.
 */
export function linkComponentNames(text: string, selfSlug?: string): ReactNode {
  const nodes: ReactNode[] = [];
  let last = 0;
  let key = 0;

  for (const match of text.matchAll(NAME_PATTERN)) {
    const name = match[0];
    const slug = NAME_TO_SLUG.get(name);
    const start = match.index ?? 0;

    if (!slug || slug === selfSlug) {
      continue;
    }

    if (start > last) {
      nodes.push(text.slice(last, start));
    }
    nodes.push(
      <Link key={key++} href={`/docs/components/${slug}`} className={linkClass}>
        {name}
      </Link>,
    );
    last = start + name.length;
  }

  if (last < text.length) {
    nodes.push(text.slice(last));
  }

  return nodes.length > 0 ? nodes : text;
}
