import { Card, CardBody, CardHeader } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";
import { DialogDemo } from "./dialog-demo";

export const metadata: Metadata = {
  title: "Dialog",
  description:
    "A modal dialog primitive with backdrop, focus trap, and scroll lock, built on Base UI Dialog.",
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
    name: "modal",
    type: "boolean | 'trap-focus'",
    desc: "Controls focus trap, scroll lock, and outside pointer interaction.",
  },
];

const usageSnippet = `import { Dialog } from "@matt-pasek/usva";

<Dialog>
  <Dialog.Trigger>Open</Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Title>Confirm action</Dialog.Title>
    <Dialog.Description>This can't be undone.</Dialog.Description>
    <Dialog.Close>Cancel</Dialog.Close>
  </Dialog.Content>
</Dialog>`;

export default function DialogPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Dialog</h1>
        <p className="text-muted">
          Built on Base UI <code>Dialog</code>, with a portal-rendered backdrop
          + popup and dotted compound composition (<code>Dialog.Trigger</code>,{" "}
          <code>Dialog.Content</code>, <code>Dialog.Title</code>,{" "}
          <code>Dialog.Description</code>, <code>Dialog.Close</code>). Focus
          trap and scroll lock are handled automatically for modal dialogs.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody>
          <DialogDemo />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody>
          <InstallBlock registryName="dialog" />
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
          <SourceView filePath="packages/usva/src/primitives/dialog/dialog.tsx" />
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
