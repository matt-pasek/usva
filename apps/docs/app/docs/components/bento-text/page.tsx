import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";
import { BentoTextDemo } from "./bento-text-demo";

export const metadata: Metadata = pageMetadata("/docs/components/bento-text", {
  title: "Bento Text",
  description:
    "The prose cell of a bento grid: a mono eyebrow, a real heading and an optional paragraph under it.",
});

const props = [
  {
    name: "title",
    type: "ReactNode",
    desc: "the heading. renders as a real h3, so it lands in the document outline.",
  },
  {
    name: "body",
    type: "ReactNode",
    desc: "paragraph under the heading. omit it when the title carries the whole point.",
  },
  {
    name: "label",
    type: "ReactNode",
    desc: "mono uppercase eyebrow above the heading. shared with BentoInfo.",
  },
  {
    name: "icon",
    type: "ReactNode",
    desc: "tile beside the label. it needs a label to sit next to.",
  },
];

export default function BentoTextPage() {
  return (
    <ComponentDoc
      slug="bento-text"
      name="BentoText"
      layer="pattern"
      provenance={["personal-website"]}
      client
      description={
        <>
          the cell that argues rather than counts. an eyebrow to place it, a
          heading to carry the claim, and a paragraph only when the heading
          cannot.
        </>
      }
      composition={{
        ok: [
          "the focal cell of a proof wall, where the metrics around it are evidence",
          "pairs with BentoMetric: the text makes the claim, the figures back it",
        ],
        no: [
          "not a place for three paragraphs. a cell that scrolls has outgrown the grid",
          "the eyebrow is a label, not a sentence",
        ],
      }}
      a11y={
        <>
          the title is a real <code className="font-mono text-xs">h3</code>, so
          headings stay in order down the page
        </>
      }
    >
      <BentoTextDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="bento-grid"
        usage={`import { BentoText } from "usva/patterns/bento-grid";

<BentoText
  label="Problem"
  title="Students could not see their whole degree."
  body="Requirements were spread across four systems."
/>`}
      />
    </ComponentDoc>
  );
}
