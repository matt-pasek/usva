import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";
import { StepListDemo } from "./step-list-demo";

export const metadata: Metadata = pageMetadata("/docs/components/step-list", {
  title: "Step List",
  description:
    "An ordered procedure down a connector spine, one step per row with room for an icon.",
});

const props = [
  {
    name: "steps",
    type: "Step[]",
    desc: (
      <>
        the steps: <code>{"{ title, body?, icon?, id? }"}</code>. an icon
        replaces the number in the chip and moves the ordinal above the title.
      </>
    ),
  },
  {
    name: "headingLevel",
    type: '"h2" | "h3" | "h4"',
    defaultValue: '"h4"',
    desc: "level of each step title. pick it to fit the page outline.",
  },
];

export default function StepListPage() {
  return (
    <ComponentDoc
      slug="step-list"
      description={
        <>
          a vertical numbered process: a connector spine with a title and body
          per step. for how-it-works and onboarding sections.
        </>
      }
      composition={{
        ok: [
          "a how-it-works section, alone or beside an illustration",
          "wrap in RevealGroup for a staggered entrance",
        ],
        no: [
          "not a wizard. it explains a process, it does not run one",
          "no long prose bodies. a step body is a sentence or two",
        ],
      }}
      a11y={
        <>
          an ordered list with a real heading per step · the connector spine is{" "}
          <code className="font-mono text-xs">aria-hidden</code>
        </>
      }
    >
      <StepListDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="step-list"
        usage={`import { StepList } from "@matt-pasek/usva/patterns/step-list";

<StepList
  steps={[
    { title: "Sketch", body: "Rough the flow." },
    { title: "Build", body: "Wire it up." },
    { title: "Ship", body: "Push it live." },
  ]}
/>`}
      />
    </ComponentDoc>
  );
}
