import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { FeatureCarouselDemo } from "./feature-carousel-demo";

export const metadata: Metadata = {
  title: "Feature Carousel",
  description:
    "Features one at a time, advancing on their own and pausing when you look closer, with a rail to jump between them.",
};

const props = [
  {
    name: "cards",
    type: "FeatureCard[]",
    desc: (
      <>
        the features: <code>{"{ title, body?, id? }"}</code>. give each an id
        when titles can repeat.
      </>
    ),
  },
  {
    name: "autoAdvanceMs",
    type: "number",
    defaultValue: "4600",
    desc: "how long each card holds before the next.",
  },
];

export default function FeatureCarouselPage() {
  return (
    <ComponentDoc
      slug="feature-carousel"
      client
      description={
        <>
          an auto-advancing showcase for a handful of features. one large card
          cross-fades between entries, and a rail lets you jump straight to any
          of them.
        </>
      }
      composition={{
        ok: [
          "landing and marketing sections that sell three to six features",
          "a sentence or two per body, the card is a headline surface",
        ],
        no: [
          "not for content someone must read, anything critical lives outside the rotation",
          "no interactive content inside a card, the selectors are the only targets",
        ],
      }}
      a11y={
        <>
          each selector is a labelled button with{" "}
          <code className="font-mono text-xs">aria-current</code> · the progress
          line is <code className="font-mono text-xs">aria-hidden</code> ·
          reduced motion stops the auto-advance
        </>
      }
      dependencies={<code className="font-mono text-xs">motion</code>}
    >
      <FeatureCarouselDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="feature-carousel"
        usage={`import { FeatureCarousel } from "@matt-pasek/usva";

<FeatureCarousel
  cards={[
    { title: "Owns your data", body: "Everything stays local." },
    { title: "Reads at a glance", body: "Dense, but it breathes." },
    { title: "Yours to fork", body: "Copy the source, or install it." },
  ]}
/>`}
      />
    </ComponentDoc>
  );
}
