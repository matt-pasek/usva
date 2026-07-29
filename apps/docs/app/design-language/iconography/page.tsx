import type { Metadata } from "next";
import Link from "next/link";
import { ChapterHeading as Heading } from "@/components/chapter-heading";
import { ChapterShell } from "@/components/design-language/chapter-shell";
import {
  ArrowPunctuation,
  IconSpecimens,
} from "@/components/design-language/icon-specimens";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata("/design-language/iconography", {
  title: "Iconography · Design language",
  description:
    "Glyphs inherit and arrows are punctuation. 24×24, stroke 1.8, drawn in currentColor so an icon takes the size and colour of the text it sits in.",
});

export default function IconographyChapter() {
  return (
    <ChapterShell
      slug="iconography"
      shapedBy={["personal-website", "sisu-plus"]}
      lede={
        <>
          icons are set, not placed. every glyph is drawn on a 24×24 grid at
          stroke 1.8 in{" "}
          <code className="font-mono text-base text-ink">currentColor</code>, so
          it inherits the size and the colour of the text around it and never
          becomes a separate thing to theme.
        </>
      }
    >
      <section className="flex flex-col gap-4">
        <div className="flex max-w-2xl flex-col gap-2">
          <Heading>the glyph rules</Heading>
          <p className="text-muted text-sm">
            one grid, one stroke, no fills. a filled icon reads as a state, so
            fills are spent deliberately, never for weight. everything else is a
            line.
          </p>
        </div>
        <IconSpecimens />
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex max-w-2xl flex-col gap-2">
          <Heading>glyphs are punctuation</Heading>
          <p className="text-muted text-sm">
            there are no emoji in usva. the affordance an emoji would carry is
            carried by a small set of typographic glyphs instead: arrows point,
            a dot separates. each has one fixed meaning, so a → always says
            forward and never decoration.
          </p>
        </div>
        <ArrowPunctuation />
      </section>

      <section className="flex max-w-2xl flex-col gap-3">
        <Heading>where the glyphs come from</Heading>
        <p className="text-muted text-sm">
          the set is{" "}
          <a
            href="https://lucide.dev"
            target="_blank"
            rel="noreferrer"
            className="text-accent underline decoration-accent/40 underline-offset-2 transition-colors hover:decoration-accent"
          >
            Lucide ↗
          </a>
          , taken at the usva grid: 24×24, stroke 1.8,{" "}
          <code className="font-mono text-ink text-xs">currentColor</code>.
          every glyph on this page is a live component off that set, so it
          inherits the theme and there is no icon to redraw per brand.
        </p>
        <p className="max-w-2xl text-muted text-sm">
          the two brand marks sit outside all of this. the wordmark is set in
          type, four letters and an accent-alt period, never a path; railo is
          the one shape in the system that is drawn, and it is still not an
          icon. neither takes an icon slot, sits in a glyph row, or inherits the
          24×24 stroke-1.8 grid. they answer to{" "}
          <Link
            href="/design-language/identity"
            className="text-ink underline decoration-accent/40 underline-offset-2 transition-colors hover:decoration-accent"
          >
            identity
          </Link>
          , not to this page.
        </p>
      </section>
    </ChapterShell>
  );
}
