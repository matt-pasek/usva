import { Card, CardBody, CardHeader, SectionLabel } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";

export const metadata: Metadata = {
  title: "Section Label",
  description:
    "A section heading with an optional mono index, uppercase title, glowing accent hairline, and trailing aside.",
};

const props = [
  {
    name: "index",
    type: "string",
    desc: "Optional mono, glowing accent index (e.g. 01) shown before the title.",
  },
  {
    name: "title",
    type: "React.ReactNode",
    desc: "The section title. Rendered as an uppercase h2.",
  },
  {
    name: "aside",
    type: "React.ReactNode",
    desc: "Optional trailing content after the hairline (e.g. a count).",
  },
];

const usageSnippet = `import { SectionLabel } from "@matt-pasek/usva";

<SectionLabel index="01" title="Projects" aside="6 total" />`;

export default function SectionLabelPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Section Label</h1>
        <p className="text-muted">
          A composed section heading — a mono glowing <code>index</code>, an
          uppercase <code>title</code>, an accent hairline that fills the
          remaining width, and an optional trailing <code>aside</code>.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody>
          <div className="flex flex-col gap-8">
            <SectionLabel index="01" title="Selected work" aside="6 projects" />
            <SectionLabel index="02" title="Writing" />
            <SectionLabel title="Now" aside="2026" />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody>
          <InstallBlock registryName="section-label" />
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
          <SourceView filePath="packages/usva/src/patterns/section-label/section-label.tsx" />
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
