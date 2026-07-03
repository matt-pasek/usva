import { Card, CardBody, CardHeader, Input, Label } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";

export const metadata: Metadata = {
  title: "Label",
  description:
    "A styled form label with htmlFor association, a disabled state, and an optional monospace variant.",
};

const props = [
  {
    name: "htmlFor",
    type: "string",
    desc: "Associates the label with a form control by its id.",
  },
  {
    name: "disabled",
    type: "boolean",
    desc: "Applies muted, not-allowed styling and sets data-disabled.",
  },
  {
    name: "mono",
    type: "boolean",
    desc: "Renders the label in the monospace type family. Defaults to false.",
  },
];

const usageSnippet = `import { Label, Input } from "@matt-pasek/usva";

<Label htmlFor="email">Email</Label>
<Input id="email" type="email" placeholder="you@usva.dev" />

<Label htmlFor="token" mono>API token</Label>
<Label htmlFor="locked" disabled>Locked field</Label>`;

export default function LabelPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Label</h1>
        <p className="text-muted">
          A pure styled form label. Pair it with a control via{" "}
          <code>htmlFor</code>, dim it with <code>disabled</code>, or switch to
          the monospace family with <code>mono</code>.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <Label htmlFor="demo-email">Email</Label>
              <Input id="demo-email" type="email" placeholder="you@usva.dev" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="demo-token" mono>
                API token
              </Label>
              <Input id="demo-token" placeholder="sk_live_…" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="demo-locked" disabled>
                Locked field
              </Label>
              <Input id="demo-locked" disabled placeholder="Unavailable" />
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody>
          <InstallBlock registryName="label" />
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
          <SourceView filePath="packages/usva/src/primitives/label/label.tsx" />
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
