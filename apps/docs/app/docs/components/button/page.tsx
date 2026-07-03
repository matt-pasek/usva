import { Card, CardBody, CardHeader } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";
import { ButtonDemo } from "./button-demo";

export const metadata: Metadata = {
  title: "Button",
  description:
    "The primary action primitive with four variants, three sizes, an accent hover glow, and asChild slotting.",
};

const props = [
  {
    name: "variant",
    type: '"solid" | "soft" | "outline" | "ghost"',
    desc: 'Visual weight of the button. Defaults to "solid".',
  },
  {
    name: "size",
    type: '"sm" | "md" | "lg"',
    desc: 'Control height and padding. Defaults to "md".',
  },
  {
    name: "asChild",
    type: "boolean",
    desc: "Merge props onto the single child element instead of rendering a <button>.",
  },
  {
    name: "disabled",
    type: "boolean",
    desc: "Disables the button and dims it to 50% opacity.",
  },
];

const usageSnippet = `import { Button } from "@matt-pasek/usva";

<Button variant="solid">Save changes</Button>
<Button variant="outline" size="sm">Cancel</Button>
<Button asChild>
  <a href="/docs">Read the docs</a>
</Button>`;

export default function ButtonPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Button</h1>
        <p className="text-muted">
          Four variants (<code>solid</code>, <code>soft</code>,{" "}
          <code>outline</code>, <code>ghost</code>) across three sizes. The{" "}
          <code>solid</code> variant lights up with the kajo accent glow on
          hover, and <code>asChild</code> lets any element inherit the button
          styling.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody>
          <ButtonDemo />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody>
          <InstallBlock registryName="button" />
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
          <SourceView filePath="packages/usva/src/primitives/button/button.tsx" />
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
