import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";
import { ProgressRowDemo } from "./progress-row-demo";

export const metadata: Metadata = pageMetadata(
  "/docs/components/progress-row",
  {
    title: "Progress Row",
    description:
      "A label, a count and a bar, as one row in a list of many, with a keyed bar colour and a status slot.",
  },
);

const props = [
  {
    name: "label",
    type: "ReactNode",
    desc: "the row's name. doubles as the bar's accessible name when a string.",
  },
  {
    name: "value",
    type: "number",
    desc: "current amount. clamped, overshoot fills the bar.",
  },
  {
    name: "max",
    type: "number",
    desc: "target amount. a max of 0 renders an empty bar, not a division by zero.",
  },
  {
    name: "unit",
    type: "string",
    desc: 'trailing unit on the figures, e.g. "cr".',
  },
  {
    name: "status",
    type: "ReactNode",
    desc: (
      <>
        a slot, usually a Badge. <b>never derived from the ratio</b>.
      </>
    ),
  },
  {
    name: "barColor",
    type: "string",
    desc: "categorical key color, any CSS color. it says which row this is, not how it is doing.",
  },
];

export default function ProgressRowPage() {
  return (
    <ComponentDoc
      slug="progress-row"
      client
      description={
        <>
          a labelled progress bar with a value-over-max figure. the bar color
          keys the row to a category, and any verdict goes in the status slot.
        </>
      }
      composition={{
        ok: [
          "stack inside a Card body with divide-y for a module list",
          "a Badge in the status slot when a row needs a verdict",
        ],
        no: [
          "not a disclosure. no chevron, no aria-expanded, no wrapping button",
          "no traffic-light barColor. status has its own slot",
        ],
      }}
      a11y={
        <>
          <code className="font-mono text-xs">role="progressbar"</code> with{" "}
          <code className="font-mono text-xs">aria-valuenow/min/max</code> · a
          string label becomes the bar's{" "}
          <code className="font-mono text-xs">aria-label</code>, pass one
          yourself otherwise
        </>
      }
    >
      <ProgressRowDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="progress-row"
        usage={`import { ProgressRow } from "@usva-ui/react/patterns/progress-row";
import { Badge } from "@usva-ui/react/primitives/badge";

<ProgressRow
  label="Computer Science"
  value={12}
  max={30}
  unit="cr"
  barColor="#8b5cf6"
  status={<Badge tone="warning">In progress</Badge>}
/>`}
      />
    </ComponentDoc>
  );
}
