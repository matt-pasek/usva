import { Card, CardBody, CardHeader, StatChip } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";

export const metadata: Metadata = {
  title: "Stat Chip",
  description:
    "A compact labelled numeric pill with tabular figures and tone, for inline metrics in dense dashboard UI.",
};

const props = [
  {
    name: "value",
    type: "React.ReactNode",
    desc: "The figure — rendered semibold and tabular.",
  },
  {
    name: "label",
    type: "React.ReactNode",
    desc: 'Optional leading muted label, e.g. "credits".',
  },
  {
    name: "unit",
    type: "React.ReactNode",
    desc: 'Optional trailing faint unit, e.g. "cr", "%".',
  },
  {
    name: "tone",
    type: '"neutral" | "accent" | "accent-alt" | "success" | "warning" | "danger"',
    desc: "Tints the border and colors the value.",
  },
  { name: "size", type: '"sm" | "md"', desc: "Defaults to md." },
];

const usage = `import { StatChip } from "@matt-pasek/usva";

<StatChip label="credits" value="142" unit="cr" />
<StatChip tone="accent-alt" label="done" value="99" unit="%" />`;

export default function StatChipPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Stat Chip</h1>
        <p className="text-muted">
          A compact labelled numeric pill — mono, tabular figures, tone-colored.
          Distinct from <code>Chip</code> (a tag) and <code>Badge</code> (a
          status): this is a mini metric for dense dashboard rows.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody>
          <div className="flex flex-wrap items-center gap-2">
            <StatChip label="total" value="1,240" />
            <StatChip tone="accent" label="active" value="86" />
            <StatChip tone="accent-alt" label="done" value="99" unit="%" />
            <StatChip tone="warning" label="due" value="4" />
            <StatChip tone="danger" label="failed" value="2" />
            <StatChip label="credits" value="142" unit="cr" />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody>
          <InstallBlock registryName="stat-chip" />
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
          <SourceView filePath="packages/usva/src/primitives/stat-chip/stat-chip.tsx" />
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
