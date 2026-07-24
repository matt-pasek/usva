import type { Metadata } from "next";
import { ChapterHeading as Heading } from "@/components/chapter-heading";
import { ChapterShell } from "@/components/design-language/chapter-shell";
import { SpaceScale } from "@/components/design-language/space-scale";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata("/design-language/space", {
  title: "Space · Design language",
  description:
    "Rhythm is fluid, and it is measured against the container, not the viewport. One spacing scale, single-column layouts, and clamp for the gutters.",
});

export default function SpaceChapter() {
  return (
    <ChapterShell
      slug="space"
      shapedBy={["personal-website", "sisu-plus"]}
      lede={
        <>
          spacing is one scale, used everywhere, and it is fluid: a component is
          measured against the box it sits in, not the window it happens to be
          shown through. that one decision is why a card looks the same nested
          in a sidebar as it does full width.
        </>
      }
    >
      <section className="flex flex-col gap-4">
        <div className="flex max-w-2xl flex-col gap-2">
          <Heading>the scale</Heading>
          <p className="text-muted text-sm">
            one geometric-ish ramp. you reach for a step, never a number, and
            the steps are far enough apart that two adjacent ones never read as
            a mistake.
          </p>
        </div>
        <SpaceScale />
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex max-w-2xl flex-col gap-2">
          <Heading>containers, not viewports</Heading>
          <p className="text-muted text-sm">
            the thing that breaks most layouts is sizing against the viewport. a
            hero built in <code className="font-mono text-ink text-xs">vw</code>{" "}
            looks right once, at the width it was drawn at, and wrong everywhere
            else it is placed. usva sizes against the container instead, in{" "}
            <code className="font-mono text-ink text-xs">cqi</code>, so a block
            carries its proportions wherever it lands.
          </p>
        </div>
        <div className="overflow-hidden rounded-lg border border-border bg-sunken p-4">
          <code className="font-mono text-on-sunken text-xs">
            font-size: clamp(2rem, 6cqi, 4rem);
          </code>
        </div>
      </section>

      <section className="flex max-w-2xl flex-col gap-3">
        <Heading>one column, clamped gutters</Heading>
        <p className="text-muted text-sm">
          content is a single column with a comfortable measure, and the gutters
          that hold it are a{" "}
          <code className="font-mono text-ink text-xs">clamp</code>: they give
          ground on a phone and open up on a wide screen, without a single media
          query deciding where the breaks are. the layout bends; it does not
          snap.
        </p>
      </section>
    </ChapterShell>
  );
}
