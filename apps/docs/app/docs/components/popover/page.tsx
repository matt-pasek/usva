import { Card, CardBody, CardHeader } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";
import { PopoverDemo } from "./popover-demo";

export const metadata: Metadata = {
  title: "Popover",
  description:
    "A positioned, non-modal overlay primitive with no backdrop or scroll lock, built on Base UI Popover.",
};

const props = [
  { name: "open", type: "boolean", desc: "Controlled open state." },
  {
    name: "defaultOpen",
    type: "boolean",
    desc: "Initial open state (uncontrolled).",
  },
  {
    name: "onOpenChange",
    type: "(open, eventDetails) => void",
    desc: "Fires when the open state changes.",
  },
  {
    name: "side",
    type: "'top' | 'right' | 'bottom' | 'left'",
    desc: "Preferred side of the trigger to render the content (on Content).",
  },
  {
    name: "align",
    type: "'start' | 'center' | 'end'",
    desc: "Alignment along the side (on Content).",
  },
  {
    name: "sideOffset",
    type: "number",
    desc: "Distance in pixels from the trigger (on Content, default 8).",
  },
];

const usageSnippet = `import { Popover } from "@matt-pasek/usva";

<Popover>
  <Popover.Trigger>Open</Popover.Trigger>
  <Popover.Content side="bottom">
    <Popover.Title>Notifications</Popover.Title>
    <Popover.Description>You have no new notifications.</Popover.Description>
  </Popover.Content>
</Popover>`;

export default function PopoverPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Popover</h1>
        <p className="text-muted">
          Built on Base UI <code>Popover</code>, a positioned, non-modal
          overlay: no backdrop, no scroll lock. Dotted compound composition (
          <code>Popover.Trigger</code>, <code>Popover.Content</code>,{" "}
          <code>Popover.Arrow</code>, <code>Popover.Title</code>,{" "}
          <code>Popover.Description</code>, <code>Popover.Close</code>).
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody>
          <PopoverDemo />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody>
          <InstallBlock registryName="popover" />
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
          <SourceView filePath="packages/usva/src/primitives/popover/popover.tsx" />
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
