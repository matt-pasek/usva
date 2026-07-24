import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";
import { GlowCardDemo } from "./glow-card-demo";

export const metadata: Metadata = pageMetadata("/docs/components/glow-card", {
  title: "Glow Card",
  description:
    "A Card whose border lights the edge facing your pointer, so one card earns the directional glow BentoGrid shares across a grid.",
});

const props = [
  {
    name: "…CardProps",
    type: "CardProps",
    desc: "every Card prop applies: surface, highlight, interactive, and the rest.",
  },
];

export default function GlowCardPage() {
  return (
    <ComponentDoc
      slug="glow-card"
      name="GlowCard"
      layer="primitive"
      description={
        <>
          a Card whose border lights up on the edge facing the pointer, so a
          single card earns the directional glow BentoGrid shares across a whole
          grid. it takes every <code>Card</code> prop.
        </>
      }
      composition={{
        ok: [
          "the one card on a view that earns the pointer glow, a hero or a highlighted tier",
          "anywhere a plain Card goes: it is a drop-in with a lit edge",
        ],
        no: [
          "never a grid of them. shared glow across many cells is BentoGrid",
          "not on a touch-first surface. the glow needs a pointer to follow",
        ],
      }}
      a11y={
        <>
          the glow layer is{" "}
          <code className="font-mono text-xs">aria-hidden</code> · everything
          else is a plain Card
        </>
      }
      dependencies={
        <>
          Card <span className="text-muted">from the same package</span>
        </>
      }
    >
      <GlowCardDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="card"
        usage={`import { GlowCard, CardHeader, CardTitle, CardBody } from "@matt-pasek/usva";

<GlowCard>
  <CardHeader>
    <CardTitle>Featured</CardTitle>
  </CardHeader>
  <CardBody>Move your cursor toward the border.</CardBody>
</GlowCard>`}
      />
    </ComponentDoc>
  );
}
