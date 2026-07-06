import {
  Card,
  CardBody,
  CardHeader,
  Skeleton,
  SkeletonMirror,
} from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";

function MediaCard() {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-4 shadow-floating">
      <div className="flex items-center gap-3">
        <div className="size-11 rounded-full bg-sunken" />
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-semibold text-ink">Aino Virtanen</span>
          <span className="text-xs text-muted">Product designer</span>
        </div>
      </div>
      <div className="h-40 rounded-xl bg-sunken" />
      <p className="text-sm text-muted">
        A short caption describing the item, its state, and one more line of
        supporting detail so the block has some height.
      </p>
      <div className="flex gap-2">
        <span className="rounded-md bg-accent px-3 py-1.5 text-xs text-on-accent">
          Open
        </span>
        <span className="rounded-md border border-border px-3 py-1.5 text-xs text-muted">
          Share
        </span>
      </div>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Skeleton",
  description:
    "A styled-only loading placeholder with a swishing outline sheen, plus SkeletonMirror, which auto-infers a skeleton from any layout you wrap.",
};

const props = [
  {
    name: "variant",
    type: '"text" | "circle" | "rect"',
    desc: 'Shape of the placeholder. Defaults to "text".',
  },
  {
    name: "width",
    type: "string | number",
    desc: "Explicit width, applied via inline style.",
  },
  {
    name: "height",
    type: "string | number",
    desc: "Explicit height, applied via inline style.",
  },
  {
    name: "radius",
    type: "string | number",
    desc: "Explicit border radius override, applied via inline style.",
  },
];

const usageSnippet = `import { Skeleton } from "@matt-pasek/usva";

<Skeleton variant="circle" width={40} height={40} />
<Skeleton variant="text" />
<Skeleton variant="rect" height={120} />`;

export default function SkeletonPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Skeleton</h1>
        <p className="text-muted">
          A pure styled loading placeholder — no Base UI dependency, no
          interactivity, server-safe.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody>
          <div className="flex w-72 flex-col gap-3 rounded-lg border border-border p-4">
            <div className="flex items-center gap-3">
              <Skeleton variant="circle" width={40} height={40} />
              <div className="flex flex-1 flex-col gap-2">
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="40%" />
              </div>
            </div>
            <Skeleton variant="rect" height={120} />
            <Skeleton variant="text" />
            <Skeleton variant="text" width="80%" />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Auto-inferred (SkeletonMirror)</CardHeader>
        <CardBody className="flex flex-col gap-4">
          <p className="text-sm text-muted">
            <code>SkeletonMirror</code> wraps your real markup and greys every
            leaf into a shaped block, so the placeholder always matches the
            layout — it <em>is</em> the layout. One glimmer travels around the
            whole outline. Works with any component, usva or your own; the{" "}
            <code>MediaCard</code> below is a plain hand-rolled div.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <span className="font-mono text-xs text-faint">real</span>
              <MediaCard />
            </div>
            <div className="flex flex-col gap-2">
              <span className="font-mono text-xs text-faint">
                &lt;SkeletonMirror&gt;
              </span>
              <SkeletonMirror>
                <MediaCard />
              </SkeletonMirror>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody>
          <InstallBlock registryName="skeleton" />
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
          <SourceView filePath="packages/usva/src/primitives/skeleton/skeleton.tsx" />
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
