import type { Metadata } from "next";
import { ChapterHeading as Heading } from "@/components/chapter-heading";
import { ChapterShell } from "@/components/design-language/chapter-shell";
import { DepthStrata } from "@/components/design-language/depth-strata";
import { pageMetadata } from "@/lib/site";
import { buildTokenReference } from "@/lib/token-reference";

export const metadata: Metadata = pageMetadata("/design-language/depth", {
  title: "Depth · Design language",
  description:
    "Elevation is weather, not z-index. Six surface strata told by a lighter surface, a hairline, and a soft shadow; glow is saved for the one thing alive.",
});

export default function DepthChapter() {
  const { radius } = buildTokenReference();

  return (
    <ChapterShell
      slug="depth"
      shapedBy={["personal-website", "sisu-plus"]}
      lede={
        <>
          things do not stack in usva; they sit at depths in the fog. six
          surface roles make the strata, and depth is told three ways at once, a
          lighter surface, a hairline, and a soft dark shadow, never a hard
          edge.
        </>
      }
    >
      <section className="flex flex-col gap-4">
        <div className="flex max-w-2xl flex-col gap-2">
          <Heading>the cross-section</Heading>
          <p className="text-muted text-sm">
            the six strata, each painted with its real surface token. switch the
            theme and watch how each register does depth differently: kajo leans
            on translucency, savi on a wider surface delta and less shadow.
            switch the scrim on to see the layer an overlay dims the world with.
          </p>
        </div>
        <DepthStrata />
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex max-w-2xl flex-col gap-2">
          <Heading>radius follows importance</Heading>
          <p className="text-muted text-sm">
            the corner radius is not a habit applied evenly. the bigger the
            moment, the rounder the corner: a chip is nearly sharp, a hero panel
            is soft.
          </p>
        </div>
        <div className="flex flex-wrap items-end gap-4">
          {radius.map(({ name, value }) => (
            <div key={name} className="flex flex-col items-center gap-2">
              <span
                className="size-16 border border-accent/40 bg-surface"
                style={{ borderRadius: value }}
              />
              <code className="font-mono text-muted text-[0.65rem]">
                {name}
              </code>
            </div>
          ))}
        </div>
      </section>

      <section className="flex max-w-2xl flex-col gap-3">
        <Heading>glow is for the living</Heading>
        <p className="text-muted text-sm">
          a shadow is elevation. a glow is not: it is held back for one thing,
          and that thing is something alive, a live control, a running process,
          the accent doing its one job. spend it on decoration and it stops
          meaning anything the moment it is needed.
        </p>
      </section>
    </ChapterShell>
  );
}
