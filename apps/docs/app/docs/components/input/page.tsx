import { Card, CardBody, CardHeader, Input } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";

export const metadata: Metadata = {
  title: "Input",
  description:
    "A text input primitive with focus ring, hover border, invalid, and disabled states — extending the native input.",
};

const props = [
  {
    name: "aria-invalid",
    type: "boolean",
    desc: "Paints the border with the danger role to flag validation errors.",
  },
  {
    name: "disabled",
    type: "boolean",
    desc: "Disables the field and dims it with a not-allowed cursor.",
  },
  {
    name: "…InputHTMLAttributes",
    type: "React.InputHTMLAttributes",
    desc: "All native input attributes (type, value, placeholder, onChange, …) pass through.",
  },
];

const usageSnippet = `import { Input } from "@matt-pasek/usva";

<Input placeholder="you@example.com" type="email" />
<Input aria-invalid defaultValue="not-an-email" />
<Input disabled placeholder="Disabled" />`;

export default function InputPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Input</h1>
        <p className="text-muted">
          A thin wrapper over the native <code>&lt;input&gt;</code> with a kajo
          focus ring, hover border, <code>aria-invalid</code> danger state, and
          disabled styling. Every native input attribute passes straight
          through.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody>
          <div className="flex max-w-sm flex-col gap-3">
            <Input placeholder="Default — focus me" />
            <Input defaultValue="Filled value" />
            <Input aria-invalid defaultValue="invalid@" />
            <Input disabled placeholder="Disabled" />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody>
          <InstallBlock registryName="input" />
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
          <SourceView filePath="packages/usva/src/primitives/input/input.tsx" />
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
