import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";
import { BentoInfoDemo } from "./bento-info-demo";

export const metadata: Metadata = pageMetadata("/docs/components/bento-info", {
  title: "Bento Info",
  description:
    "A labelled bento cell that holds anything: chips, a line of prose, a short list, whatever the cell has to carry.",
});

const props = [
  {
    name: "label",
    type: "ReactNode",
    desc: "mono uppercase eyebrow above the body. required here, unlike on BentoText.",
  },
  {
    name: "icon",
    type: "ReactNode",
    desc: "tile beside the label, in the alternate accent.",
  },
  {
    name: "children",
    type: "ReactNode",
    desc: "the body. chips, a sentence, a short list. it is a slot, not a variant.",
  },
];

export default function BentoInfoPage() {
  return (
    <ComponentDoc
      slug="bento-info"
      name="BentoInfo"
      layer="pattern"
      provenance={["personal-website"]}
      client
      description={
        <>
          a label and then whatever the cell has to hold. where BentoText argues
          and BentoMetric counts, this one just lists: the stack, the role, the
          dates.
        </>
      }
      composition={{
        ok: [
          "the supporting cells of a proof wall: stack, role, timeline, scope",
          "chips are the common body, but the slot takes any markup",
        ],
        no: [
          "the label is not optional here. an unlabelled cell is BentoText with no title",
          "not a table. once the body has rows and columns it wants a real one",
        ],
      }}
      a11y={
        <>
          the label is plain text and the icon tile is decorative · a list in
          the body stays a real list
        </>
      }
    >
      <BentoInfoDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="bento-grid"
        usage={`import { BentoInfo } from "usva/patterns/bento-grid";
import { Chip } from "usva/primitives/chip";

<BentoInfo label="Stack">
  <Chip>React</Chip>
  <Chip>Tailwind</Chip>
</BentoInfo>`}
      />
    </ComponentDoc>
  );
}
