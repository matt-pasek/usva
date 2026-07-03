import { Card, CardBody, CardHeader } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";
import { TabsDemo } from "./tabs-demo";

export const metadata: Metadata = {
  title: "Tabs",
  description:
    "An accessible tabs primitive with roving focus and an animated active-tab indicator, built on Base UI Tabs.",
};

const props = [
  { name: "value", type: "Value | null", desc: "Controlled active tab value." },
  {
    name: "defaultValue",
    type: "Value | null",
    desc: "Initial active tab value (uncontrolled).",
  },
  {
    name: "onValueChange",
    type: "(value, eventDetails) => void",
    desc: "Fires when the active tab changes.",
  },
  {
    name: "orientation",
    type: '"horizontal" | "vertical"',
    desc: "Layout flow direction.",
  },
];

const usageSnippet = `import { Tabs } from "@matt-pasek/usva";

<Tabs defaultValue="account">
  <Tabs.List>
    <Tabs.Tab value="account">Account</Tabs.Tab>
    <Tabs.Tab value="password">Password</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel value="account">Manage your account details.</Tabs.Panel>
  <Tabs.Panel value="password">Change your password.</Tabs.Panel>
</Tabs>`;

export default function TabsPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Tabs</h1>
        <p className="text-muted">
          Built on Base UI <code>Tabs</code>, with roving keyboard focus and
          dotted compound composition (<code>Tabs.List</code>,{" "}
          <code>Tabs.Tab</code>, <code>Tabs.Panel</code>). The active tab is
          tracked by an animated underline indicator.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody>
          <TabsDemo />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody>
          <InstallBlock registryName="tabs" />
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
          <SourceView filePath="packages/usva/src/primitives/tabs/tabs.tsx" />
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
