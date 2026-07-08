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
    type: '"solid" | "soft" | "outline" | "ghost" | "onSurface"',
    desc: 'Visual weight of the button. Defaults to "solid". Use "onSurface" for buttons sitting on an image or gradient.',
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
  {
    name: "status",
    type: '"idle" | "loading" | "success" | "error"',
    desc: 'Drives the content machine. "loading" swaps in a spinner and blocks clicks; "success" and "error" flash their own colour and icon, then settle back to idle.',
  },
  {
    name: "loadingText / successText / errorText",
    type: "ReactNode",
    desc: "Labels shown alongside the spinner, check, and alert icons for each non-idle status.",
  },
  {
    name: "settleDelay",
    type: "number",
    desc: "How long success or error holds before returning to idle. Defaults to 1200ms.",
  },
  {
    name: "onSettle",
    type: "() => void",
    desc: "Fires when a success or error status settles back to idle.",
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
          Five variants (<code>solid</code>, <code>soft</code>,{" "}
          <code>outline</code>, <code>ghost</code>, <code>onSurface</code>)
          across three sizes. Every variant lifts a pixel on hover and presses
          down on click. The <code>solid</code> variant lights up with the kajo
          accent glow on hover, <code>onSurface</code> is a translucent tonal
          fill for buttons over imagery, and <code>asChild</code> lets any
          element inherit the button styling.
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
          <pre className="overflow-x-auto rounded-md border border-border bg-sunken p-3 text-xs text-on-sunken">
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
