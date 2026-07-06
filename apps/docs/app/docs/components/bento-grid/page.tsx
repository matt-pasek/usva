import {
  BentoCard,
  BentoGrid,
  Card,
  CardBody,
  CardEyebrow,
  CardHeader,
  CardTitle,
} from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";

export const metadata: Metadata = {
  title: "Bento Grid",
  description:
    "A responsive bento layout whose cells share one accent wash and a coordinated hover shine, so a grid of cards reads as a single lit surface.",
};

const props = [
  {
    name: "columns",
    type: "number",
    desc: "Force an explicit column count. Omit for a responsive auto-fit grid.",
  },
  {
    name: "span",
    type: "number",
    desc: "BentoCard: how many columns the cell spans.",
  },
  {
    name: "rowSpan",
    type: "number",
    desc: "BentoCard: how many rows the cell spans.",
  },
  {
    name: "highlight",
    type: '"none" | "wash" | "edge" | "ring"',
    desc: "BentoCard: inherits the Card highlight vocabulary.",
  },
];

const usageSnippet = `import { BentoGrid, BentoCard } from "@matt-pasek/usva";

<BentoGrid columns={3}>
  <BentoCard span={2} rowSpan={2}>...</BentoCard>
  <BentoCard>...</BentoCard>
  <BentoCard highlight="edge">...</BentoCard>
</BentoGrid>`;

export default function BentoGridPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Bento Grid</h1>
        <p className="text-muted">
          A responsive bento layout. One accent wash is painted across the whole
          grid so each cell shows its own slice, and the cells share a
          coordinated shine on hover, so a wall of cards reads as a single
          surface lit from above.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody>
          <BentoGrid columns={3}>
            <BentoCard span={2} rowSpan={2}>
              <CardHeader row>
                <div className="flex flex-col gap-1">
                  <CardEyebrow>overview</CardEyebrow>
                  <CardTitle>Dashboard that starts useful</CardTitle>
                </div>
              </CardHeader>
              <CardBody className="text-sm text-muted">
                Credits, grades, and deadlines pulled into one quiet overview.
              </CardBody>
            </BentoCard>
            <BentoCard>
              <CardBody>
                <CardEyebrow>credits</CardEyebrow>
                <div className="mt-1 font-mono text-2xl tabular-nums text-ink">
                  142
                </div>
              </CardBody>
            </BentoCard>
            <BentoCard>
              <CardBody>
                <CardEyebrow>status</CardEyebrow>
                <div className="mt-1 text-sm text-live">on track</div>
              </CardBody>
            </BentoCard>
            <BentoCard span={3}>
              <CardBody className="text-sm text-muted">
                A full-width cell for a chart or a table row.
              </CardBody>
            </BentoCard>
          </BentoGrid>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody>
          <InstallBlock registryName="bento-grid" />
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
          <SourceView filePath="packages/usva/src/patterns/bento-grid/bento-grid.tsx" />
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
