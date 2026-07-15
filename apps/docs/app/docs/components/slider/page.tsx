import { Card, CardBody, CardHeader } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";
import { SliderDemo } from "./slider-demo";

export const metadata: Metadata = {
  title: "Slider",
  description:
    "A single-thumb numeric control built on Base UI Slider, with an optional label and formatted value readout.",
};

const props = [
  { name: "value", type: "number", desc: "Controlled value." },
  {
    name: "defaultValue",
    type: "number",
    desc: "Initial value (uncontrolled).",
  },
  {
    name: "onValueChange",
    type: "(value: number, event) => void",
    desc: "Fires on every committed change, from pointer or keyboard.",
  },
  { name: "min", type: "number", desc: "Lower bound. Defaults to 0." },
  { name: "max", type: "number", desc: "Upper bound. Defaults to 100." },
  {
    name: "step",
    type: "number",
    desc: "Increment per arrow key press and per drag tick.",
  },
  { name: "disabled", type: "boolean", desc: "Disables the slider." },
  { name: "label", type: "ReactNode", desc: "Label rendered above the track." },
  {
    name: "showValue",
    type: "boolean",
    desc: "Shows the current value on the right of the label row.",
  },
  {
    name: "formatValue",
    type: "(value: number) => string",
    desc: "Formats the readout. Without it, Base UI's own formatting is used.",
  },
  {
    name: "size",
    type: '"sm" | "md"',
    desc: "Track and thumb size. Defaults to md.",
  },
];

const usageSnippet = `import { Slider } from "@matt-pasek/usva";

<Slider
  label="Speed"
  defaultValue={40}
  min={0}
  max={100}
  step={5}
  showValue
  formatValue={(v) => \`\${v}%\`}
/>`;

export default function SliderPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Slider</h1>
        <p className="text-muted">
          A single number, picked along a track. I built it on Base UI{" "}
          <code>Slider</code>, so it is operable with the arrow keys, Home and
          End, and it carries a visible focus ring on the thumb.
        </p>
        <p className="text-muted">
          Use it when the value is continuous and the exact number matters less
          than the feel of it: a speed, an opacity, a blur radius. It is not a
          range picker (one thumb, one number), and it is not a substitute for a
          typed field when the user knows the number they want. Ask for a number
          with <code>Input</code>; ask for a feeling with this.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody>
          <SliderDemo />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody>
          <InstallBlock registryName="slider" />
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
          <SourceView filePath="packages/usva/src/primitives/slider/slider.tsx" />
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
