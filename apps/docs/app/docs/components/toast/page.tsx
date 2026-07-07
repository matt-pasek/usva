import { Card, CardBody, CardHeader } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";
import { ToastDemo } from "./toast-demo";

export const metadata: Metadata = {
  title: "Toast",
  description:
    "An imperative toast primitive with a provider + toast() API, built on Base UI's SSR-safe toast manager.",
};

const props = [
  {
    name: "title",
    type: "React.ReactNode",
    desc: "The toast's headline. Required.",
  },
  {
    name: "description",
    type: "React.ReactNode",
    desc: "Optional supporting copy.",
  },
  {
    name: "type",
    type: "'success' | 'warning' | 'danger' | 'info'",
    desc: "Maps to a status token role (accent border).",
  },
  {
    name: "duration",
    type: "number",
    desc: "Auto-dismiss timeout in ms (maps to Base UI's timeout). 0 disables auto-dismiss.",
  },
  {
    name: "action",
    type: "{ label: string; onClick?: () => void }",
    desc: "Renders an inline action button (maps to Base UI's actionProps).",
  },
];

const usageSnippet = `import { toast, Toaster } from "@matt-pasek/usva";

// mount once, e.g. in a root layout. It does not wrap your app.
<Toaster />

// call from anywhere, including outside React
toast({ title: "Saved", description: "Your changes are live.", type: "success" });`;

export default function ToastPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Toast</h1>
        <p className="text-muted">
          Built on Base UI's <code>Toast</code> manager, which lives at module
          scope rather than in React context. So <code>toast()</code> is
          callable from anywhere, even outside React, and stays SSR-safe. Mount{" "}
          <code>Toaster</code> once (e.g. in a root layout) to render the
          viewport. It does not wrap your app, and your call sites do not need
          to sit beneath it. Toasts fired before it mounts are dropped, not
          queued.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody>
          <ToastDemo />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody>
          <InstallBlock registryName="toast" />
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
          <SourceView filePath="packages/usva/src/primitives/toast/toast.tsx" />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>toast() options</CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted">
                  <th className="py-2 pr-4 font-medium">Option</th>
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
