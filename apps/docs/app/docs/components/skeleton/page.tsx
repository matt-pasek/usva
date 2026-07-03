import { Card, CardBody, CardHeader, Skeleton } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";

export const metadata: Metadata = {
  title: "Skeleton",
  description:
    "A styled-only loading placeholder with shimmer animation, no Base UI dependency.",
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
        <CardHeader>Install</CardHeader>
        <CardBody>
          <InstallBlock registryName="skeleton" />
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
