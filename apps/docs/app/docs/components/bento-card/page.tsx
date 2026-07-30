import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";
import { BentoCardDemo } from "./bento-card-demo";

export const metadata: Metadata = pageMetadata("/docs/components/bento-card", {
  title: "Bento Card",
  description:
    "The cell a bento grid is built from: a translucent Card that takes a column and row span and carries the shared wash.",
});

const props = [
  {
    name: "span",
    type: "number",
    desc: (
      <>
        columns the cell covers. <b>nothing clamps it</b>, overshoot the grid
        and the card overflows its track.
      </>
    ),
  },
  {
    name: "rowSpan",
    type: "number",
    desc: "rows the cell covers. rows are minmax, so this raises the floor rather than fixing the height.",
  },
  {
    name: "highlight",
    type: '"none" | "wash" | "edge" | "ring"',
    desc: "inherits the Card highlight vocabulary. one focal cell earns a highlight, a wall of them does not.",
  },
];

export default function BentoCardPage() {
  return (
    <ComponentDoc
      slug="bento-card"
      name="BentoCard"
      layer="pattern"
      provenance={["personal-website"]}
      client
      description={
        <>
          one cell of the wall. it is a Card with a span, translucent enough
          that the grid&rsquo;s wash reads through it rather than stopping at
          its edge.
        </>
      }
      composition={{
        ok: [
          "size one cell past its neighbours to give the grid a focal point",
          "holds any of the cell parts, or your own markup, or nothing at all",
        ],
        no: [
          "span is not a position. the grid is flow-dense, so narrow cards backfill ahead of a wide one",
          "outside a BentoGrid it is a plain Card. use Card directly instead",
        ],
      }}
      a11y={
        <>
          the spotlight and edge glow are{" "}
          <code className="font-mono text-xs">aria-hidden</code> · the shine
          respects reduced motion
        </>
      }
      dependencies={
        <>
          Card <span className="text-muted">from the same package</span>
        </>
      }
    >
      <BentoCardDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="bento-grid"
        usage={`import { BentoCard, BentoGrid } from "@usva-ui/react/patterns/bento-grid";

<BentoGrid columns={3}>
  <BentoCard span={2} rowSpan={2} highlight="wash">...</BentoCard>
  <BentoCard>...</BentoCard>
</BentoGrid>`}
      />
    </ComponentDoc>
  );
}
