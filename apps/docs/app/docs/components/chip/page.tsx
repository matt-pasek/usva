import { Card, CardBody, CardHeader } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";
import { ChipDemo } from "./chip-demo";

export const metadata: Metadata = {
  title: "Chip",
  description:
    "A compact pill for tags, filters, and counts — six tones, an optional value segment, and a dismissable remove button.",
};

const props = [
  {
    name: "tone",
    type: '"default" | "accent" | "accent-alt" | "success" | "warning" | "danger"',
    desc: 'Color role of the chip. Defaults to "default".',
  },
  {
    name: "size",
    type: '"sm" | "md"',
    desc: 'Height and padding. Defaults to "md".',
  },
  {
    name: "value",
    type: "React.ReactNode",
    desc: "Optional trailing value segment, separated by a divider (e.g. a count).",
  },
  {
    name: "onRemove",
    type: "() => void",
    desc: "When provided, renders a dismiss button that calls this on click.",
  },
  {
    name: "removeLabel",
    type: "string",
    desc: 'Accessible label for the dismiss button. Defaults to "Remove".',
  },
];

const usageSnippet = `import { Chip } from "@matt-pasek/usva";

<Chip tone="accent">Design</Chip>
<Chip tone="success" value="v2.1">Release</Chip>
<Chip tone="accent" onRemove={() => remove(id)}>Engineering</Chip>`;

export default function ChipPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Chip</h1>
        <p className="text-muted">
          A compact pill for tags, filters, and status counts. Pass{" "}
          <code>value</code> for a divided trailing segment, or{" "}
          <code>onRemove</code> to make it dismissable.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody>
          <ChipDemo />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody>
          <InstallBlock registryName="chip" />
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
          <SourceView filePath="packages/usva/src/primitives/chip/chip.tsx" />
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
