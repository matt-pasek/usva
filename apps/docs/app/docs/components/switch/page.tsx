import { Card, CardBody, CardHeader } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";
import { SwitchDemo } from "./switch-demo";

export const metadata: Metadata = {
  title: "Switch",
  description:
    "An accessible switch primitive with a sliding thumb, built on Base UI Switch + Field.",
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
  { name: "disabled", type: "boolean", desc: "Disables the switch." },
  { name: "label", type: "ReactNode", desc: "Field label text." },
  {
    name: "description",
    type: "ReactNode",
    desc: "Helper text shown below the control.",
  },
  { name: "size", type: '"sm" | "md"', desc: "Visual size. Defaults to md." },
];

const usageSnippet = `import { Switch } from "@matt-pasek/usva";

<Switch
  label="Notifications"
  description="Enable push notifications for updates."
  onCheckedChange={(checked) => console.log(checked)}
/>`;

export default function SwitchPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Switch</h1>
        <p className="text-muted">
          Built on Base UI <code>Switch</code> + <code>Field</code>, with a
          springy thumb transition that honors reduced motion.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody>
          <SwitchDemo />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody>
          <InstallBlock registryName="switch" />
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
          <SourceView filePath="packages/usva/src/primitives/switch/switch.tsx" />
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
