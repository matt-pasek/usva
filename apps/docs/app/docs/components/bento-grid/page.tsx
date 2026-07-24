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
  {
    name: "span",
    type: "number",
    desc: (
      <>
        BentoCard: columns the cell spans. <b>nothing clamps it</b>, overshoot
        columns and the card overflows its track.
      </>
    ),
  },
  {
    name: "rowSpan",
    type: "number",
    desc: "BentoCard: rows the cell spans. rows are minmax, so it raises the floor, not the height.",
  },
  {
    name: "highlight",
    type: '"none" | "wash" | "edge" | "ring"',
    desc: "BentoCard: inherits the Card highlight vocabulary.",
  },
  {
    name: "value / label / suffix",
    type: "ReactNode",
    desc: "BentoMetric: the stat, its pill label, and the accent unit after the number.",
  },
  {
    name: "size",
    type: '"md" | "lg"',
    defaultValue: '"md"',
    desc: "BentoMetric: lg is the standalone stat treatment, display weight and full-strength ink.",
  },
  {
    name: "animate",
    type: "boolean",
    defaultValue: "false",
    desc: "BentoMetric: count up from zero on mount. ignored for non-numeric values.",
  },
  {
    name: "title / body",
    type: "ReactNode",
    desc: "BentoText: the heading and its optional paragraph. label and icon are shared with BentoInfo.",
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
        usage={`import { BentoGrid, BentoCard, BentoMetric } from "@matt-pasek/usva";

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
