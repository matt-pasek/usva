import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";
import { SegmentedControlDemo } from "./segmented-control-demo";

export const metadata: Metadata = pageMetadata(
  "/docs/components/segmented-control",
  {
    title: "Segmented Control",
    description:
      "A few exclusive options, all visible at once, with the choice carried by a sliding indicator. The plain one, for dense UI.",
  },
);

const props = [
  {
    name: "items",
    type: "SegmentedControlItem[]",
    desc: (
      <>
        the segments: <code>{"{ value, label, icon? }"}</code>. the icon is
        decorative.
      </>
    ),
  },
  {
    name: "value",
    type: "string",
    desc: "the controlled selected value.",
  },
  {
    name: "defaultValue",
    type: "string",
    desc: "uncontrolled start. falls back to the first item.",
  },
  {
    name: "onValueChange",
    type: "(value: string) => void",
    desc: "fires on click and on arrow-key moves.",
  },
  {
    name: "size",
    type: '"sm" | "md"',
    defaultValue: '"md"',
    desc: "segment height and padding.",
  },
  {
    name: "orientation",
    type: '"horizontal" | "vertical"',
    defaultValue: '"horizontal"',
    desc: "vertical stacks the segments and slides the indicator on the y axis.",
  },
];

export default function SegmentedControlPage() {
  return (
    <ComponentDoc
      slug="segmented-control"
      client
      description={
        <>
          a small row of options with one picked at a time, the selection
          carried by a sliding indicator instead of a restyle. it switches a
          view in place; the page stays put.
        </>
      }
      composition={{
        ok: [
          "sits in a Toolbar, a PageHeader, or above the region it switches",
          "two to five short segments, icons optional",
        ],
        no: [
          "never for navigation between pages, that is Tabs or links",
          "no long labels. a segment that wraps is a Select",
        ],
      }}
      a11y={
        <>
          <code className="font-mono text-xs">role="radiogroup"</code> with a
          radio per segment · roving tabindex, arrows / Home / End move and
          select · the indicator is aria-hidden
        </>
      }
    >
      <SegmentedControlDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="segmented-control"
        usage={`import { SegmentedControl } from "usva/patterns/segmented-control";

<SegmentedControl
  items={[
    { value: "board", label: "Board" },
    { value: "list", label: "List" },
  ]}
  value={view}
  onValueChange={setView}
/>`}
      />
    </ComponentDoc>
  );
}
