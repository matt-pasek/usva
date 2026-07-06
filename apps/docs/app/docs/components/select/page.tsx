import { Card, CardBody, CardHeader } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";
import { SelectDemo } from "./select-demo";

export const metadata: Metadata = {
  title: "Select",
  description:
    "An accessible select primitive with trigger, portal-positioned listbox, and item indicators, built on Base UI Select.",
};

const props = [
  { name: "value", type: "Value | null", desc: "Controlled selected value." },
  {
    name: "defaultValue",
    type: "Value | null",
    desc: "Initial selected value (uncontrolled).",
  },
  {
    name: "onValueChange",
    type: "(value, eventDetails) => void",
    desc: "Fires when the selected value changes.",
  },
  { name: "name", type: "string", desc: "Form field name." },
  { name: "disabled", type: "boolean", desc: "Disables the select." },
];

const usageSnippet = `import { Select } from "@matt-pasek/usva";

<Select onValueChange={(value) => console.log(value)}>
  <Select.Trigger aria-label="Fruit">
    <Select.Value placeholder="Pick a fruit" />
  </Select.Trigger>
  <Select.Content>
    <Select.Item value="apple">Apple</Select.Item>
    <Select.Item value="banana">Banana</Select.Item>
  </Select.Content>
</Select>`;

export default function SelectPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Select</h1>
        <p className="text-muted">
          Built on Base UI <code>Select</code>, with a portal-positioned listbox
          and dotted compound composition (<code>Select.Trigger</code>,{" "}
          <code>Select.Content</code>, <code>Select.Item</code>).
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody>
          <SelectDemo />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody>
          <InstallBlock registryName="select" />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Usage</CardHeader>
        <CardBody>
          <pre className="overflow-x-auto rounded-md border border-border bg-sunken p-3 text-xs text-on-sunken">
            <code>{usageSnippet}</code>
          </pre>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Source</CardHeader>
        <CardBody>
          <SourceView filePath="packages/usva/src/primitives/select/select.tsx" />
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
