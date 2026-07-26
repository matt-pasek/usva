import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";
import { HeroSplitDemo } from "./hero-split-demo";

export const metadata: Metadata = pageMetadata("/docs/components/hero-split", {
  title: "Hero Split",
  description:
    "Copy on one side, the proof on the other, over an optional background. Both sized off the container rather than the window.",
});

const props = [
  { name: "title", type: "ReactNode", desc: "the headline." },
  {
    name: "titleAccent",
    type: "ReactNode",
    desc: "second phrase of the title, carrying the accent color.",
  },
  {
    name: "accentColor",
    type: "string",
    defaultValue: "accent-alt token",
    desc: "any CSS color, keyed to the product.",
  },
  {
    name: "headingLevel",
    type: '"h1" | "h2"',
    defaultValue: '"h1"',
    desc: (
      <>
        <b>one h1 per page</b>.
      </>
    ),
  },
  {
    name: "badge",
    type: "ReactNode",
    desc: "pill above the title. an Announcement or a Badge.",
  },
  { name: "body", type: "ReactNode", desc: "the lede." },
  {
    name: "actions",
    type: "ReactNode",
    desc: "the call to action row. pass Buttons.",
  },
  {
    name: "proof",
    type: "ReactNode",
    desc: "social proof under the actions. an AvatarGroup with a label does this.",
  },
  { name: "note", type: "ReactNode", desc: "small print under the copy." },
  {
    name: "visual",
    type: "ReactNode",
    desc: "the product shot. beside the copy on wide containers, stacked below on narrow.",
  },
  {
    name: "background",
    type: "ReactNode",
    desc: (
      <>
        painted behind everything, under a scrim built from the <code>bg</code>{" "}
        token. a slot, not a built-in atmosphere. no background, no scrim.
      </>
    ),
  },
];

export default function HeroSplitPage() {
  return (
    <ComponentDoc
      slug="hero-split"
      description={
        <>
          the landing hero: copy on one side, a product visual on the other.
          every part but the title is optional, so it collapses to a headline
          and a button.
        </>
      }
      composition={{
        ok: [
          "the first section of a landing page, once",
          "actions take Buttons, proof takes an AvatarGroup, badge takes an Announcement",
        ],
        no: [
          "never nested inside a Card or another hero",
          "the background slot is not a place for content. it sits under a scrim",
        ],
      }}
      a11y={
        <>
          the title is a real heading, level set by{" "}
          <code className="font-mono text-xs">headingLevel</code> · the scrim is{" "}
          <code className="font-mono text-xs">aria-hidden</code> and the
          background layer drops pointer events
        </>
      }
    >
      <HeroSplitDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="hero-split"
        usage={`import { HeroSplit } from "@matt-pasek/usva/patterns/hero-split";
import { MockupShowcase } from "@matt-pasek/usva/patterns/mockup-showcase";
import { Button } from "@matt-pasek/usva/primitives/button";

<HeroSplit
  title="Your whole degree,"
  titleAccent="in one place."
  body="Four registries reconciled into one planner."
  actions={<Button>Add to Chrome</Button>}
  visual={<MockupShowcase>{/* screenshot */}</MockupShowcase>}
/>`}
      />
    </ComponentDoc>
  );
}
