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
    "An accessible, glow-accented loading spinner in four animation styles (ring, dots, bars, orbit) and three sizes, plus a PageLoader wrapper.",
};

const props = [
  {
    name: "variant",
    type: '"ring" | "dots" | "bars" | "orbit"',
    desc: 'Animation style. Defaults to "ring".',
  },
  {
    name: "size",
    type: '"sm" | "md" | "lg"',
    desc: 'Diameter and weight. Defaults to "md".',
  },
  {
    name: "label",
    type: "string",
    desc: 'Visually hidden status text for screen readers. Defaults to "Loading".',
  },
];

const variants = [
  { variant: "ring", note: "The classic arc — a general default." },
  { variant: "dots", note: "Three pulsing dots — light, unobtrusive inline." },
  { variant: "bars", note: "An equalizer — reads as active processing." },
  { variant: "orbit", note: "A glowing dot circling a faint track." },
] as const;

const usageSnippet = `import { Spinner, PageLoader } from "@matt-pasek/usva";

<Spinner variant="ring" />
<Spinner variant="dots" size="sm" />
<Spinner variant="bars" label="Processing" />
<Spinner variant="orbit" size="lg" />

<PageLoader variant="orbit" label="Loading your workspace" />`;

export default function SpinnerPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Spinner</h1>
        <p className="text-muted">
          A pure styled spinner with the accent glow and{" "}
          <code>role="status"</code> for assistive tech. Four animation styles —{" "}
          <code>ring</code>, <code>dots</code>, <code>bars</code>, and{" "}
          <code>orbit</code> — all reduced-motion safe. The exported{" "}
          <code>PageLoader</code> centers one with an optional caption for
          whole-region loading states.
        </p>
      </div>

      <Card>
        <CardHeader>Variants</CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {variants.map((v) => (
              <div
                key={v.variant}
                className="flex flex-col items-center gap-3 rounded-lg border border-border bg-surface-2/40 p-5 text-center"
              >
                <div className="flex h-10 items-center">
                  <Spinner variant={v.variant} size="lg" />
                </div>
                <p className="font-mono text-xs text-ink">{v.variant}</p>
                <p className="text-xs leading-snug text-muted">{v.note}</p>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Sizes &amp; PageLoader</CardHeader>
        <CardBody>
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-6">
              <Spinner variant="dots" size="sm" />
              <Spinner variant="dots" size="md" />
              <Spinner variant="dots" size="lg" />
            </div>
            <div className="rounded-lg border border-border">
              <PageLoader variant="orbit" label="Loading your workspace" />
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
          <pre className="overflow-x-auto rounded-md border border-border bg-sunken p-3 text-xs text-on-sunken">
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
