import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";
import { EntityCardDemo } from "./entity-card-demo";

export const metadata: Metadata = pageMetadata("/docs/components/entity-card", {
  title: "Entity Card",
  description:
    "Media, meta, title, body, actions. Assemble them into a project tile, a list row, or a showcase card.",
});

const props = [
  {
    name: "variant",
    type: '"stack" | "row" | "showcase"',
    defaultValue: '"stack"',
    desc: (
      <>
        layout: stack is media on top, row puts the media beside the content,
        showcase is the big numbered work card. row and showcase{" "}
        <b>need EntityContent</b> around the text parts.
      </>
    ),
  },
  {
    name: "className",
    type: "string",
    desc: "merged onto the root Card, which adds a 2xl radius, overflow-hidden, and a flex column.",
  },
  {
    name: "...Card props",
    type: "CardProps",
    desc: "EntityCard extends the Card primitive, so every Card prop is forwarded.",
  },
];

export default function EntityCardPage() {
  return (
    <ComponentDoc
      slug="entity-card"
      description={
        <>
          a card you assemble from parts: media, meta, title, body and actions,
          in any order. the same parts render a project tile, a list row or a
          showcase card, depending on the variant.
        </>
      }
      composition={{
        ok: [
          "stack for tiles in a grid, row for compact lists, showcase for the numbered selected-work card",
          "interactive on the root puts the arrow on the title and the lift on hover",
        ],
        no: [
          "never an EntityCard inside another card",
          "an interactive card gets one destination, not a pile of competing buttons",
        ],
      }}
      a11y={
        <>
          EntityTitle renders an <code className="font-mono text-xs">h3</code> ·
          the hover arrow is decorative · media scaling stops under{" "}
          <code className="font-mono text-xs">motion-reduce</code>
        </>
      }
      dependencies={
        <>
          Card <span className="text-muted">from the same package</span>
        </>
      }
    >
      <EntityCardDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="entity-card"
        usage={`import { EntityActions, EntityBody, EntityCard, EntityMedia, EntityMeta, EntityTitle } from "usva/patterns/entity-card";
import { Badge } from "usva/primitives/badge";
import { Button } from "usva/primitives/button";

<EntityCard>
  <EntityMedia>
    <img src="/cover.jpg" alt="" />
  </EntityMedia>
  <EntityMeta>
    <Badge tone="accent">Design</Badge>
  </EntityMeta>
  <EntityTitle>Aurora tokens</EntityTitle>
  <EntityBody>A layered token pipeline for the kajo theme.</EntityBody>
  <EntityActions>
    <Button size="sm">Open</Button>
  </EntityActions>
</EntityCard>`}
      />
    </ComponentDoc>
  );
}
