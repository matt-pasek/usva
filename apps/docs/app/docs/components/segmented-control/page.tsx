import { Card, CardBody, CardHeader } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";
import { SegmentedControlDemo } from "./segmented-control-demo";

export const metadata: Metadata = {
  title: "Segmented Control",
  description:
    "A radiogroup of segments with a sliding, glow-lit indicator, roving tabindex, and full arrow-key navigation.",
};

const props = [
  {
    name: "items",
    type: "SegmentedControlItem[]",
    desc: "Segments to render. Each has value, label, and an optional icon.",
  },
  {
    name: "value",
    type: "string",
    desc: "Controlled selected value.",
  },
  {
    name: "defaultValue",
    type: "string",
    desc: "Initial value (uncontrolled); falls back to the first item.",
  },
  {
    name: "onValueChange",
    type: "(value: string) => void",
    desc: "Fires when the selected segment changes.",
  },
  {
    name: "size",
    type: '"sm" | "md"',
    desc: 'Segment height and padding. Defaults to "md".',
  },
];

const usageSnippet = `import { SegmentedControl } from "@matt-pasek/usva";

const items = [
  { value: "board", label: "Board" },
  { value: "list", label: "List" },
  { value: "calendar", label: "Calendar" },
];

<SegmentedControl
  items={items}
  value={view}
  onValueChange={setView}
/>`;

export default function SegmentedControlPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Segmented Control</h1>
        <p className="text-muted">
          A <code>role=&quot;radiogroup&quot;</code> of segments with a sliding
          indicator lit by the kajo accent glow. Controlled or uncontrolled,
          with a roving tabindex and arrow / Home / End keyboard navigation.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody>
          <SegmentedControlDemo />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody>
          <InstallBlock registryName="segmented-control" />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Usage</CardHeader>
        <CardBody>
          <pre className="overflow-x-auto rounded-md border border-border bg-surface-2 p-3 text-xs text-ink">
            <code>{usageSnippet}</code>
          </pre>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Source</CardHeader>
        <CardBody>
          <SourceView filePath="packages/usva/src/patterns/segmented-control/segmented-control.tsx" />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Props</CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted">
                  <th className="py-2 pr-4 font-medium">Prop</th>
                  <th className="py-2 pr-4 font-medium">Type</th>
                  <th className="py-2 font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                {props.map((p) => (
                  <tr key={p.name} className="border-b border-border/50">
                    <td className="py-2 pr-4 font-mono text-xs text-ink">
                      {p.name}
                    </td>
                    <td className="py-2 pr-4 font-mono text-xs text-muted">
                      {p.type}
                    </td>
                    <td className="py-2 text-muted">{p.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </main>
  );
}
