import { Card, CardBody, CardHeader, ChecklistCard } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";

export const metadata: Metadata = {
  title: "Checklist Card",
  description:
    "A card of ticked reassurances, built on a real list rather than a stack of bordered divs.",
};

const props = [
  {
    name: "items",
    type: "React.ReactNode[]",
    desc: "The claims. Strings or nodes.",
  },
  {
    name: "title",
    type: "React.ReactNode",
    desc: "Optional heading above the list. Omitted entirely when absent.",
  },
  {
    name: "marker",
    type: "React.ReactNode",
    desc: "Overrides the default tick. Decorative either way.",
  },
];

const usage = `import { ChecklistCard } from "@matt-pasek/usva";

<ChecklistCard
  title="Privacy"
  items={[
    "Runs entirely on your machine",
    "No tracking, no analytics",
    "Open source, end to end",
  ]}
/>`;

const items = [
  "Runs entirely on your machine",
  "No tracking, no analytics, no accounts",
  "Open source, end to end",
];

export default function ChecklistCardPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Checklist Card</h1>
        <p className="text-muted">
          A card of reassurances: short claims, each ticked. Thin on purpose. It
          is a <code>Card</code> recipe over <code>List</code>, and exists so
          the markup stays a real list.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody>
          <ChecklistCard title="Privacy" items={items} />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Why not bordered divs</CardHeader>
        <CardBody>
          <p className="text-sm text-muted">
            sisu-plus renders this block as a stack of <code>div</code>s with a
            bottom border. Visually identical, but a screen reader announces
            three loose fragments rather than a list of three related items, and
            never says how many there are. The border is a <code>divided</code>{" "}
            prop on a real <code>ul</code> instead.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody>
          <InstallBlock registryName="checklist-card" />
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
          <SourceView filePath="packages/usva/src/patterns/checklist-card/checklist-card.tsx" />
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
