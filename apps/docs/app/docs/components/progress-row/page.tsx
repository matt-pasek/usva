import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  ProgressRow,
} from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";

export const metadata: Metadata = {
  title: "Progress Row",
  description:
    "A labelled progress bar with mono value over max figures, a categorical bar color and a status slot.",
};

const props = [
  { name: "label", type: "React.ReactNode", desc: "The row's name." },
  { name: "value", type: "number", desc: "Current amount." },
  {
    name: "max",
    type: "number",
    desc: "Target amount. A max of 0 renders an empty bar rather than dividing by zero.",
  },
  {
    name: "unit",
    type: "string",
    desc: 'Trailing unit on the figures, e.g. "cr".',
  },
  {
    name: "status",
    type: "React.ReactNode",
    desc: "A slot, usually a Badge. ProgressRow never derives status from the ratio.",
  },
  {
    name: "barColor",
    type: "string",
    desc: "Categorical key color, any CSS color. It says which row this is, not how it is doing.",
  },
];

const usage = `import { ProgressRow, Badge } from "@matt-pasek/usva";

<ProgressRow
  label="Computer Science"
  value={12}
  max={30}
  unit="cr"
  barColor="#8b5cf6"
  status={<Badge tone="warning">In progress</Badge>}
/>`;

export default function ProgressRowPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Progress Row</h1>
        <p className="text-muted">
          A labelled bar with mono figures and a status slot. Deliberately not a
          disclosure: the accordion chevron that usually wraps this shape is a
          separate concern and does not belong inside a progress row.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody>
          <div className="divide-y divide-border">
            <ProgressRow
              label="Computer Science"
              value={30}
              max={30}
              unit="cr"
              barColor="#8b5cf6"
              status={<Badge tone="success">Complete</Badge>}
            />
            <ProgressRow
              label="Mathematics"
              value={12}
              max={30}
              unit="cr"
              barColor="#52c989"
              status={<Badge tone="warning">In progress</Badge>}
            />
            <ProgressRow label="Electives" value={0} max={15} unit="cr" />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody>
          <InstallBlock registryName="progress-row" />
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
          <SourceView filePath="packages/usva/src/patterns/progress-row/progress-row.tsx" />
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
