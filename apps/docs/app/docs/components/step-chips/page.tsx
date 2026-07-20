import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { StepChipsDemo } from "./step-chips-demo";

export const metadata: Metadata = {
  title: "Step Chips",
  description:
    "A short numbered sequence of steps in one row, joined by arrows.",
};

const props = [
  {
    name: "steps",
    type: "React.ReactNode[]",
    desc: "the steps, in order. keep each one a few words.",
  },
  {
    name: "aria-label",
    type: "string",
    desc: 'names the sequence, e.g. "Setup steps".',
  },
];

export default function StepChipsPage() {
  return (
    <ComponentDoc
      slug="step-chips"
      description={
        <>
          a short numbered sequence in one row, sized to sit inside a banner or
          under a heading rather than to carry a page.
        </>
      }
      composition={{
        ok: [
          "inside a CtaBanner or under a section heading, as a one-line pitch",
          "three or four steps of a few words each",
        ],
        no: [
          "no interactive steps. it describes a sequence, it does not track one",
          "no bodies under the steps, that is StepList",
        ],
      }}
      a11y={
        <>
          an ordered list, so position comes free · the number and arrow are{" "}
          <code className="font-mono text-xs">aria-hidden</code> to avoid double
          announcing · takes{" "}
          <code className="font-mono text-xs">aria-label</code>
        </>
      }
    >
      <StepChipsDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="step-chips"
        usage={`import { StepChips } from "@matt-pasek/usva";

<StepChips
  aria-label="Setup steps"
  steps={["Install the extension", "Sign in", "Done"]}
/>`}
      />
    </ComponentDoc>
  );
}
