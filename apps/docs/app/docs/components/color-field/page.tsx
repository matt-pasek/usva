import { Card, CardBody, CardHeader } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";
import { ColorFieldDemo } from "./color-field-demo";

export const metadata: Metadata = {
  title: "Color Field",
  description:
    "A native color swatch paired with a validated hex input. Built for overriding a role token, not for hardcoding a color onto a component.",
};

const props = [
  { name: "value", type: "string", desc: "Controlled hex, in #rrggbb form." },
  {
    name: "defaultValue",
    type: "string",
    desc: "Initial hex (uncontrolled). Defaults to #000000.",
  },
  {
    name: "onValueChange",
    type: "(hex: string) => void",
    desc: "Fires only when the text parses as a six-digit hex. A malformed draft never escapes the field.",
  },
  { name: "label", type: "ReactNode", desc: "Label for the hex input." },
  {
    name: "swatchLabel",
    type: "string",
    desc: 'Accessible name for the swatch, which is its own focusable control. Defaults to "Pick a color".',
  },
  {
    name: "disabled",
    type: "boolean",
    desc: "Disables both the swatch and the hex input.",
  },
  {
    name: "id",
    type: "string",
    desc: "Id for the hex input. Generated if omitted.",
  },
];

const usageSnippet = `import { ColorField } from "@matt-pasek/usva";

const [accent, setAccent] = useState("#a78bfa");

<ColorField
  label="Accent"
  value={accent}
  onValueChange={(hex) => {
    setAccent(hex);
    document.documentElement.style.setProperty("--usva-accent", hex);
  }}
/>`;

export default function ColorFieldPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Color Field</h1>
        <p className="text-muted">
          Two controls, one value: a native color swatch and a hex input that
          validates as you type. Both are focusable, both carry the focus ring,
          and a malformed hex marks the field invalid instead of leaking out
          through <code>onValueChange</code>.
        </p>
        <p className="text-muted">
          Use it to override a <strong>role token</strong>: an accent, a
          surface, a border. That is what it is for. It is not a way to hardcode
          a color onto a component. A component that hardcodes a color cannot be
          rethemed, which is the entire point of the role tokens. If you find
          yourself reaching for this to paint one button, paint the token
          instead, or add the role you are missing.
        </p>
        <p className="text-muted">
          It is also deliberately small. No gradient canvas, no eyedropper, no
          alpha. Six digits and a swatch.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody>
          <ColorFieldDemo />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody>
          <InstallBlock registryName="color-field" />
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
          <SourceView filePath="packages/usva/src/primitives/color-field/color-field.tsx" />
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
