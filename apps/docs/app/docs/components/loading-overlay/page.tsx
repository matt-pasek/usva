import { Card, CardBody, CardHeader, LoadingOverlay } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";

export const metadata: Metadata = {
  title: "Loading Overlay",
  description:
    "A scrim with a centered spinner, contained to its parent or to the viewport with a refcounted body scroll lock.",
};

const props = [
  {
    name: "contain",
    type: '"viewport" | "parent"',
    desc: "parent covers the nearest positioned ancestor and locks nothing. viewport covers the page and locks body scroll. Defaults to parent.",
  },
  {
    name: "label",
    type: "string",
    desc: "Announced by the status region and shown as a caption.",
  },
  { name: "blur", type: "boolean", desc: "Backdrop blur. Defaults to true." },
  {
    name: "variant",
    type: '"ring" | "dots" | "bars" | "orbit"',
    desc: "Forwarded to Spinner.",
  },
];

const usage = `import { LoadingOverlay } from "@matt-pasek/usva";

// Over a panel. Locks nothing.
<div className="relative">
  <LoadingOverlay label="Fetching courses" />
</div>

// Over the page. Locks body scroll, refcounted.
<LoadingOverlay contain="viewport" label="Loading dashboard" />`;

export default function LoadingOverlayPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Loading Overlay</h1>
        <p className="text-muted">
          A scrim with a centered spinner. It defaults to{" "}
          <code>contain=&quot;parent&quot;</code> because that variant locks
          nothing, and the scroll lock is the one thing here that can reach
          outside the component and break an unrelated modal.
        </p>
      </div>

      <Card>
        <CardHeader>Over a panel</CardHeader>
        <CardBody>
          <div className="relative h-56 overflow-hidden rounded-2xl border border-border bg-surface p-6">
            <p className="text-sm text-muted">
              Content underneath, dimmed and blurred by the overlay.
            </p>
            <LoadingOverlay contain="parent" label="Fetching courses" />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Without blur</CardHeader>
        <CardBody>
          <div className="relative h-56 overflow-hidden rounded-2xl border border-border bg-surface p-6">
            <p className="text-sm text-muted">Scrim only, no backdrop blur.</p>
            <LoadingOverlay contain="parent" blur={false} variant="bars" />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>The scroll lock</CardHeader>
        <CardBody>
          <p className="text-sm text-muted">
            <code>contain=&quot;viewport&quot;</code> locks body scroll through
            a module-scoped refcount. It records the overflow value that was
            there before the first lock and restores exactly that on the last
            release. The naive version, which resets overflow to a hardcoded
            default, silently unlocks the page when an overlay closes over a
            still-open modal.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody>
          <InstallBlock registryName="loading-overlay" />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Usage</CardHeader>
        <CardBody>
          <pre className="overflow-x-auto rounded-md border border-border bg-sunken p-3 text-xs text-on-sunken">
            <code>{usage}</code>
          </pre>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Source</CardHeader>
        <CardBody>
          <SourceView filePath="packages/usva/src/primitives/loading-overlay/loading-overlay.tsx" />
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
