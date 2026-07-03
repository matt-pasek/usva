import { Card, CardBody, CardHeader } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { CheckboxDemo } from "./checkbox-demo";

export const metadata: Metadata = {
  title: "Checkbox",
  description:
    "An accessible checkbox primitive with label and description support, built on Base UI Checkbox + Field.",
};

const props = [
  { name: "checked", type: "boolean", desc: "Controlled checked state." },
  {
    name: "defaultChecked",
    type: "boolean",
    desc: "Initial checked state (uncontrolled).",
  },
  {
    name: "onCheckedChange",
    type: "(checked: boolean) => void",
    desc: "Fires when the checked state changes.",
  },
  {
    name: "indeterminate",
    type: "boolean",
    desc: "Renders a mixed (neither checked nor unchecked) state.",
  },
  { name: "disabled", type: "boolean", desc: "Disables the checkbox." },
  { name: "label", type: "ReactNode", desc: "Field label text." },
  {
    name: "description",
    type: "ReactNode",
    desc: "Helper text shown below the control.",
  },
  { name: "size", type: '"sm" | "md"', desc: "Visual size. Defaults to md." },
];

const usageSnippet = `import { Checkbox } from "@matt-pasek/usva";

<Checkbox
  label="Accept terms"
  description="You agree to our terms of service."
  onCheckedChange={(checked) => console.log(checked)}
/>`;

const registrySnippet = "npx shadcn add https://usva.dev/r/checkbox.json";

export default function CheckboxPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Checkbox</h1>
        <p className="text-muted">
          Built on Base UI <code>Checkbox</code> + <code>Field</code>, wired for
          label and description composition.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody>
          <CheckboxDemo />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <p className="text-sm text-muted">
              As a package dependency (recommended):
            </p>
            <pre className="overflow-x-auto rounded-md border border-border bg-surface-2 p-3 text-xs text-ink">
              <code>bun add @matt-pasek/usva</code>
            </pre>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm text-muted">
              Or copy the source into your project via shadcn:
            </p>
            <pre className="overflow-x-auto rounded-md border border-border bg-surface-2 p-3 text-xs text-ink">
              <code>{registrySnippet}</code>
            </pre>
          </div>
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
