import { Card, CardBody, CardHeader, SectionHeading } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";

export const metadata: Metadata = {
  title: "Section Heading",
  description:
    "A display heading: mono uppercase eyebrow over a large fluid title. The section opener, distinct from the numbered SectionLabel.",
};

const props = [
  {
    name: "eyebrow",
    type: "React.ReactNode",
    desc: "Mono uppercase kicker above the title. Omitted entirely when absent.",
  },
  { name: "title", type: "React.ReactNode", desc: "The display title." },
  {
    name: "as",
    type: '"h1" | "h2" | "h3"',
    desc: "Heading level. Defaults to h2. Pick by document outline, not by size.",
  },
  {
    name: "tone",
    type: '"accent" | "accent-alt"',
    desc: "Colors the eyebrow. Defaults to accent-alt.",
  },
];

const usage = `import { SectionHeading } from "@matt-pasek/usva";

<SectionHeading
  eyebrow="The problem"
  title="Students could not see their whole degree."
/>`;

export default function SectionHeadingPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Section Heading</h1>
        <p className="text-muted">
          The section opener that carries a page: a mono uppercase eyebrow over
          a large fluid title. This is not <code>SectionLabel</code>, which is
          built around a numbered mono index with an optional lede and stays at
          body scale. Collapsing the two would make both worse.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody>
          <SectionHeading
            eyebrow="The problem"
            title="Students could not see their whole degree."
          />
          <SectionHeading
            tone="accent"
            eyebrow="Outcome"
            title="One planner, four systems reconciled."
          />
          <SectionHeading title="No eyebrow, just the heading." />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Heading level</CardHeader>
        <CardBody>
          <p className="text-sm text-muted">
            <code>as</code> changes the element, not the size. The title is
            always <code>clamp(1.75rem, 4vw, 3rem)</code>. Choose the level from
            the document outline so the page stays navigable by headings, and
            let the type scale stay constant.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody>
          <InstallBlock registryName="section-heading" />
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
          <SourceView filePath="packages/usva/src/patterns/section-heading/section-heading.tsx" />
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
