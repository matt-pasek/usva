import { Card, CardBody, CardHeader, StepChips } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";

export const metadata: Metadata = {
  title: "Step Chips",
  description:
    "A numbered sequence of chips joined by arrows, rendered as a real ordered list.",
};

const props = [
  { name: "steps", type: "React.ReactNode[]", desc: "The steps, in order." },
  {
    name: "aria-label",
    type: "string",
    desc: 'Names the sequence, e.g. "Setup steps".',
  },
];

const usage = `import { StepChips } from "@matt-pasek/usva";

<StepChips
  aria-label="Setup steps"
  steps={["Install the extension", "Sign in", "Done"]}
/>`;

export default function StepChipsPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Step Chips</h1>
        <p className="text-muted">
          A short, numbered sequence, sized to sit inside a{" "}
          <code>CtaBanner</code> rather than to carry a page. For a full
          walkthrough with copy under each step, use <code>StepList</code>.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody>
          <StepChips
            aria-label="Setup steps"
            steps={["Install the extension", "Sign in", "Done"]}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>The arrow lives inside its step</CardHeader>
        <CardBody>
          <p className="text-sm text-muted">
            An <code>ol</code> may only contain <code>li</code> children, so the
            joining arrow sits inside the step it follows and is{" "}
            <code>aria-hidden</code>. The number is hidden too: the ordered list
            already conveys position, so announcing "1" would double it up. The
            last step draws no arrow.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody>
          <InstallBlock registryName="step-chips" />
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
          <SourceView filePath="packages/usva/src/patterns/step-chips/step-chips.tsx" />
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
