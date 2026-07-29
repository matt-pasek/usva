import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";
import { BentoGridDemo } from "./bento-grid-demo";

export const metadata: Metadata = pageMetadata("/docs/components/bento-grid", {
  title: "Bento Grid",
  description:
    "Cells of different weights in one grid, sharing one accent wash and hover shine so a wall of cards reads as a single lit surface.",
});

const props = [
  {
    name: "columns",
    type: "number",
    desc: "explicit column count. omit for a responsive auto-fit grid.",
  },
];

export default function BentoGridPage() {
  return (
    <ComponentDoc
      slug="bento-grid"
      client
      description={
        <>
          a wall of cards that reads as one lit surface. mix wide and tall cells
          so the grid has a focal point, and a shared wash and hover shine sweep
          across all of them at once.
        </>
      }
      composition={{
        ok: [
          "proof walls and case-study stats: mix spans so the grid has a focal cell",
          "BentoMetric, BentoInfo and BentoText work inside any Card, not just a bento cell",
        ],
        no: [
          "span is not a position. the grid is flow-dense, narrow cards backfill ahead of a wide one",
          "a wall of identical one-by-one cells is just a grid, not a bento",
        ],
      }}
      a11y={
        <>
          the spotlight and edge glow are{" "}
          <code className="font-mono text-xs">aria-hidden</code> · BentoText
          renders a real heading · the shine and count-up respect reduced motion
        </>
      }
      dependencies={
        <>
          Card <span className="text-muted">from the same package</span>
        </>
      }
    >
      <BentoGridDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="bento-grid"
        usage={`import { BentoCard, BentoGrid, BentoMetric } from "usva/patterns/bento-grid";

<BentoGrid columns={3}>
  <BentoCard span={2} rowSpan={2}>...</BentoCard>
  <BentoCard>
    <BentoMetric animate value="94" suffix="%" label="hit ratio" />
  </BentoCard>
</BentoGrid>`}
      />
    </ComponentDoc>
  );
}
