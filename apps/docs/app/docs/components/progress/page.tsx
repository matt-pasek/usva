import { Card, CardBody, CardHeader, Progress } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";

export const metadata: Metadata = {
  title: "Progress",
  description:
    "An accessible progress bar with determinate and indeterminate modes, three sizes, and an optional kajo accent glow.",
};

const props = [
  {
    name: "value",
    type: "number",
    desc: "Current progress. Omit for an indeterminate (pulsing) bar.",
  },
  {
    name: "max",
    type: "number",
    desc: "Upper bound for value. Defaults to 100.",
  },
  {
    name: "size",
    type: '"sm" | "md" | "lg"',
    desc: 'Track height. Defaults to "md".',
  },
  {
    name: "glow",
    type: "boolean",
    desc: "Adds the kajo accent glow to the filled portion. Defaults to false.",
  },
];

const usageSnippet = `import { Progress } from "@matt-pasek/usva";

<Progress value={40} />
<Progress value={72} glow />
<Progress value={30} max={50} size="lg" />
<Progress />`;

export default function ProgressPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Progress</h1>
        <p className="text-muted">
          A styled <code>role="progressbar"</code> track. Pass a{" "}
          <code>value</code> for a determinate bar, omit it for an indeterminate
          pulse, and set <code>glow</code> for the kajo accent halo.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody>
          <div className="flex flex-col gap-5">
            <Progress value={25} size="sm" />
            <Progress value={55} />
            <Progress value={80} size="lg" glow />
            <Progress />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody>
          <InstallBlock registryName="progress" />
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
          <SourceView filePath="packages/usva/src/primitives/progress/progress.tsx" />
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
