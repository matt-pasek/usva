import { Card, CardBody, CardHeader, StatCard } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";

export const metadata: Metadata = {
  title: "Stat Card",
  description:
    "A compact metric card with label, mono value, unit, trend indicator, note, icon, and an optional spark slot.",
};

const props = [
  {
    name: "label",
    type: "React.ReactNode",
    desc: "Uppercase metric label shown at the top.",
  },
  {
    name: "value",
    type: "React.ReactNode",
    desc: "The primary figure, rendered mono and tabular.",
  },
  {
    name: "unit",
    type: "React.ReactNode",
    desc: "Optional unit suffix beside the value (e.g. ms, %).",
  },
  {
    name: "note",
    type: "React.ReactNode",
    desc: "Optional footnote next to the trend indicator.",
  },
  {
    name: "icon",
    type: "React.ReactNode",
    desc: "Optional glyph shown in the top-right corner.",
  },
  {
    name: "trend",
    type: '"up" | "down" | "flat"',
    desc: "Colors the note and prepends a directional glyph.",
  },
  {
    name: "size",
    type: '"sm" | "md"',
    desc: 'Padding and value size. Defaults to "md".',
  },
  {
    name: "spark",
    type: "React.ReactNode",
    desc: "Optional slot for a sparkline or mini-chart, stretched to fill.",
  },
];

const usageSnippet = `import { StatCard } from "@matt-pasek/usva";

<StatCard
  label="Response time"
  value="128"
  unit="ms"
  trend="down"
  note="12% faster"
/>`;

export default function StatCardPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Stat Card</h1>
        <p className="text-muted">
          A compact metric tile built on <code>Card</code> — a mono tabular{" "}
          <code>value</code> with an optional <code>unit</code>, a colored{" "}
          <code>trend</code> + <code>note</code>, an <code>icon</code>, and a{" "}
          <code>spark</code> slot for a mini-chart.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <StatCard
              label="Revenue"
              value="48.2"
              unit="k"
              trend="up"
              note="8.1% MoM"
            />
            <StatCard
              label="Response time"
              value="128"
              unit="ms"
              trend="down"
              note="12% faster"
            />
            <StatCard
              label="Active users"
              value="2,940"
              trend="flat"
              note="steady"
            />
            <StatCard
              size="sm"
              label="Error rate"
              value="0.03"
              unit="%"
              trend="down"
              note="within SLO"
              spark={
                <svg
                  aria-hidden="true"
                  viewBox="0 0 100 24"
                  preserveAspectRatio="none"
                  className="h-6 text-accent"
                >
                  <polyline
                    points="0,18 20,14 40,16 60,8 80,10 100,4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
              }
            />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody>
          <InstallBlock registryName="stat-card" />
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
          <SourceView filePath="packages/usva/src/patterns/stat-card/stat-card.tsx" />
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
