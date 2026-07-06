import { Card, CardBody, CardHeader, StepList } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";

export const metadata: Metadata = {
  title: "Step List",
  description:
    "A vertical numbered process list with a connector spine and optional icon chips, for how-it-works and onboarding sequences.",
};

const props = [
  {
    name: "steps",
    type: "Step[]",
    desc: "The steps: { title, body?, icon?, id? }.",
  },
];

const usage = `import { StepList } from "@matt-pasek/usva";

<StepList
  steps={[
    { title: "Sketch", body: "Rough the flow." },
    { title: "Build", body: "Wire it up." },
    { title: "Ship", body: "Push it live." },
  ]}
/>`;

export default function StepListPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Step List</h1>
        <p className="text-muted">
          A vertical numbered process — a connector spine, mono step indices,
          and an optional icon chip per step. Pass an <code>icon</code> slot per
          step, or let it fall back to the number. Wrap in a{" "}
          <code>RevealGroup</code> for a staggered entrance.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody>
          <StepList
            steps={[
              {
                title: "Sketch the flow",
                body: "Rough the screens and the path between them.",
              },
              {
                title: "Build the primitives",
                body: "Wire the tokens and the core components.",
              },
              {
                title: "Ship it",
                body: "Push to the registry and migrate the apps.",
              },
            ]}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody>
          <InstallBlock registryName="step-list" />
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
          <SourceView filePath="packages/usva/src/patterns/step-list/step-list.tsx" />
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
