import {
  Card,
  CardBody,
  CardHeader,
  PageLoader,
  Spinner,
} from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";

export const metadata: Metadata = {
  title: "Spinner",
  description:
    "An accessible, glow-accented loading spinner in three sizes, plus a PageLoader wrapper for full-region loading states.",
};

const props = [
  {
    name: "size",
    type: '"sm" | "md" | "lg"',
    desc: 'Diameter and border weight. Defaults to "md".',
  },
  {
    name: "label",
    type: "string",
    desc: 'Visually hidden status text for screen readers. Defaults to "Loading".',
  },
];

const usageSnippet = `import { Spinner, PageLoader } from "@matt-pasek/usva";

<Spinner size="sm" />
<Spinner size="md" label="Fetching" />
<Spinner size="lg" />

<PageLoader label="Loading your workspace" />`;

export default function SpinnerPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Spinner</h1>
        <p className="text-muted">
          A pure styled spinner with the kajo accent glow and{" "}
          <code>role="status"</code> for assistive tech. The exported{" "}
          <code>PageLoader</code> centers a large spinner with an optional
          caption for whole-region loading states.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody>
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-6">
              <Spinner size="sm" />
              <Spinner size="md" />
              <Spinner size="lg" />
            </div>
            <div className="rounded-lg border border-border">
              <PageLoader label="Loading your workspace" />
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody>
          <InstallBlock registryName="spinner" />
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
          <SourceView filePath="packages/usva/src/primitives/spinner/spinner.tsx" />
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
