import { Card, CardBody, CardHeader } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";
import { RadioDemo } from "./radio-demo";

export const metadata: Metadata = {
  title: "Radio",
  description:
    "An accessible radio group primitive with label and description support, built on Base UI RadioGroup + Radio + Field.",
};

const groupProps = [
  { name: "value", type: "Value", desc: "Controlled selected value." },
  {
    name: "defaultValue",
    type: "Value",
    desc: "Initial selected value (uncontrolled).",
  },
  {
    name: "onValueChange",
    type: "(value: Value, eventDetails) => void",
    desc: "Fires when the selected value changes.",
  },
  { name: "name", type: "string", desc: "Identifies the group for forms." },
  {
    name: "orientation",
    type: '"horizontal" | "vertical"',
    desc: "Layout direction. Defaults to vertical.",
  },
];

const radioProps = [
  { name: "value", type: "Value", desc: "The value this radio represents." },
  { name: "label", type: "ReactNode", desc: "Field label text." },
  {
    name: "description",
    type: "ReactNode",
    desc: "Helper text shown below the control.",
  },
  { name: "disabled", type: "boolean", desc: "Disables the radio." },
  { name: "size", type: '"sm" | "md"', desc: "Visual size. Defaults to md." },
];

const usageSnippet = `import { Radio, RadioGroup } from "@matt-pasek/usva";

<RadioGroup name="plan" onValueChange={(value) => console.log(value)}>
  <Radio value="free" label="Free" description="Good for trying things out." />
  <Radio value="pro" label="Pro" description="For growing teams." />
</RadioGroup>`;

export default function RadioPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Radio</h1>
        <p className="text-muted">
          Built on Base UI <code>RadioGroup</code> + <code>Radio</code> +{" "}
          <code>Field</code>, wired for label and description composition.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody>
          <RadioDemo />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody>
          <InstallBlock registryName="radio" />
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
          <SourceView filePath="packages/usva/src/primitives/radio/radio.tsx" />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>RadioGroup Props</CardHeader>
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
                {groupProps.map((p) => (
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

      <Card>
        <CardHeader>Radio Props</CardHeader>
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
                {radioProps.map((p) => (
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
