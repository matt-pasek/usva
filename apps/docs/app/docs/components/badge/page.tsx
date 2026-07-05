import { Badge, Card, CardBody, CardHeader } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";

export const metadata: Metadata = {
  title: "Badge",
  description:
    "A compact status label with six semantic tones and a monospace uppercase variant for tags and metadata.",
};

const tones = [
  "neutral",
  "accent",
  "accent-alt",
  "success",
  "warning",
  "danger",
] as const;

const props = [
  {
    name: "tone",
    type: '"neutral" | "accent" | "accent-alt" | "success" | "warning" | "danger"',
    desc: 'Semantic color role of the badge. Defaults to "neutral".',
  },
  {
    name: "mono",
    type: "boolean",
    desc: "Render as an uppercase monospace tag with tracked letters. Defaults to false.",
  },
];

const usageSnippet = `import { Badge } from "@matt-pasek/usva";

<Badge tone="accent">New</Badge>
<Badge tone="success">Passing</Badge>
<Badge tone="accent-alt" mono>v1.0.0</Badge>`;

export default function BadgePage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Badge</h1>
        <p className="text-muted">
          Six semantic tones — including the green <code>accent-alt</code> role
          — rendered as soft pills. The <code>mono</code> variant switches to an
          uppercase monospace tag for versions, keys, and metadata.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody>
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {tones.map((tone) => (
                <Badge key={tone} tone={tone}>
                  {tone}
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {tones.map((tone) => (
                <Badge key={tone} tone={tone} mono>
                  {tone}
                </Badge>
              ))}
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody>
          <InstallBlock registryName="badge" />
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
          <SourceView filePath="packages/usva/src/primitives/badge/badge.tsx" />
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
