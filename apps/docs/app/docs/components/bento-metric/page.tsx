import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";
import { BentoMetricDemo } from "./bento-metric-demo";

export const metadata: Metadata = pageMetadata(
  "/docs/components/bento-metric",
  {
    title: "Bento Metric",
    description:
      "One number, its unit and a pill label, with an optional count-up and a note for the caveat the number alone would hide.",
  },
);

const props = [
  {
    name: "value",
    type: "ReactNode",
    desc: "the stat itself. a number counts up when animate is set, anything else renders verbatim.",
  },
  {
    name: "label",
    type: "ReactNode",
    desc: "the pill under the value. it pins to the bottom of the cell, so a row of metrics lines up.",
  },
  {
    name: "suffix",
    type: "ReactNode",
    desc: "trailing unit, keyed to the alternate accent so the number keeps the weight.",
  },
  {
    name: "note",
    type: "ReactNode",
    desc: "an aside under the value. the caveat, the comparison, the part the number alone would hide.",
  },
  {
    name: "icon",
    type: "ReactNode",
    desc: "sits inside the label pill, ahead of the text.",
  },
  {
    name: "size",
    type: '"md" | "lg"',
    defaultValue: '"md"',
    desc: "lg is the standalone stat treatment: display weight and full-strength ink.",
  },
  {
    name: "animate",
    type: "boolean",
    defaultValue: "false",
    desc: "count up from zero on mount. ignored for a non-numeric value, and skipped under reduced motion.",
  },
];

export default function BentoMetricPage() {
  return (
    <ComponentDoc
      slug="bento-metric"
      name="BentoMetric"
      layer="pattern"
      provenance={["personal-website"]}
      client
      description={
        <>
          a number given room to be the point of its cell. the label pins to the
          bottom so a row of them lines up, and the note carries the caveat the
          figure on its own would hide.
        </>
      }
      composition={{
        ok: [
          "proof walls and stat rows, where the figures have to scan as a set",
          "works inside any Card, not only a bento cell",
        ],
        no: [
          "the count-up is for a first impression. do not animate a number that changes while it is read",
          "not a chart. one figure per cell, and the note is a line, not a paragraph",
        ],
      }}
      a11y={
        <>
          the value is real text, so it is read as written · the count-up
          respects reduced motion and lands on the target immediately
        </>
      }
    >
      <BentoMetricDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="bento-grid"
        usage={`import { BentoMetric } from "@usva-ui/react/patterns/bento-grid";

<BentoMetric
  animate
  value="41"
  label="repositories"
  note="9 of them abandoned"
/>`}
      />
    </ComponentDoc>
  );
}
