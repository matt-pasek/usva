import { Card, CardBody, CardHeader, StatBento } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";

export const metadata: Metadata = {
  title: "Stat Bento",
  description:
    "A strip of headline numbers: display-weight values with accent suffixes and mono label pills.",
};

const props = [
  {
    name: "stats",
    type: "StatBentoItem[]",
    desc: "Each item is { value, label, suffix?, icon? }.",
  },
  {
    name: "as",
    type: "React.ElementType",
    desc: "Element rendered as the grid. Defaults to div. Pass RevealGroup to stagger the cells.",
  },
];

const usage = `import { StatBento } from "@matt-pasek/usva";

<StatBento
  stats={[
    { value: "40", suffix: "%", label: "faster builds" },
    { value: "2.4", suffix: "k", label: "active users" },
    { value: "99.9", suffix: "%", label: "uptime" },
  ]}
/>`;

const staggerUsage = `import { RevealGroup, StatBento } from "@matt-pasek/usva";

// RevealGroup animates its direct children, so it has to be
// the grid itself rather than wrap it.
<StatBento as={RevealGroup} stagger={0.08} stats={stats} />`;

const stats = [
  { value: "40", suffix: "%", label: "faster builds" },
  { value: "2.4", suffix: "k", label: "active users" },
  { value: "99.9", suffix: "%", label: "uptime" },
];

export default function StatBentoPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Stat Bento</h1>
        <p className="text-muted">
          A standalone strip of headline numbers, not a bento of mixed cells.
          Every cell is a <code>BentoMetric</code> at display weight, with the
          unit carried in an <code>accent-alt</code> suffix so the number itself
          stays the loudest thing on the row.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody>
          <StatBento animate stats={stats} />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Motion is opt-in</CardHeader>
        <CardBody>
          <p className="text-sm text-muted">
            The component ships motion-free so the copied registry source has no
            import to resolve. To get the staggered cascade, render the grid as{" "}
            <code>RevealGroup</code> rather than wrapping it: the group animates
            its direct children, and wrapping would give it exactly one child.
          </p>
          <pre className="mt-3 overflow-x-auto rounded-md border border-border bg-sunken p-3 text-xs text-on-sunken">
            <code>{staggerUsage}</code>
          </pre>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody>
          <InstallBlock registryName="stat-bento" />
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
          <SourceView filePath="packages/usva/src/patterns/stat-bento/stat-bento.tsx" />
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
