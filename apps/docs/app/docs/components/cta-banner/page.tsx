import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  CtaBanner,
} from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";

export const metadata: Metadata = {
  title: "CTA Banner",
  description:
    "The closing panel of a marketing page: accent wash, copy, numbered steps, an action, and a proof row.",
};

const props = [
  { name: "title", type: "React.ReactNode", desc: "The panel headline." },
  { name: "body", type: "React.ReactNode", desc: "Supporting copy." },
  {
    name: "headingLevel",
    type: '"h2" | "h3" | "h4"',
    desc: "Heading element for the title. Defaults to h2.",
  },
  {
    name: "steps",
    type: "React.ReactNode[]",
    desc: "Numbered chips under the copy, rendered as StepChips.",
  },
  {
    name: "stepsLabel",
    type: "string",
    desc: "Names the step sequence for assistive tech.",
  },
  {
    name: "action",
    type: "React.ReactNode",
    desc: "The call to action. Pass a Button.",
  },
  {
    name: "footer",
    type: "React.ReactNode",
    desc: "Trailing proof row. Draws a rule above itself.",
  },
  {
    name: "footerLabel",
    type: "React.ReactNode",
    desc: "Mono kicker beside the footer content.",
  },
];

const usage = `import { Button, Chip, CtaBanner } from "@matt-pasek/usva";

<CtaBanner
  title="Add it to Chrome"
  body="Nothing to configure."
  steps={["Install the extension", "Sign in", "Done"]}
  stepsLabel="Setup steps"
  action={<Button>Add to Chrome</Button>}
  footerLabel="Confirmed at"
  footer={<><Chip>Aalto</Chip><Chip>Helsinki</Chip></>}
/>`;

export default function CtaBannerPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">CTA Banner</h1>
        <p className="text-muted">
          The panel that closes a marketing page. Every part below the title is
          optional, so it degrades from a full install panel down to a headline
          and a button.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody>
          <CtaBanner
            headingLevel="h3"
            title="Add it to Chrome"
            body="Nothing to configure. Sign in once and the planner fills itself in."
            steps={["Install the extension", "Sign in", "Done"]}
            stepsLabel="Setup steps"
            action={<Button>Add to Chrome</Button>}
            footerLabel="Confirmed at"
            footer={
              <>
                <Chip>Aalto</Chip>
                <Chip>Helsinki</Chip>
                <Chip>TUNI</Chip>
              </>
            }
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>The wash is an inline gradient</CardHeader>
        <CardBody>
          <p className="text-sm text-muted">
            The accent wash is set with an inline <code>background-image</code>{" "}
            built from <code>color-mix</code> over the <code>accent-alt</code>{" "}
            token, not an arbitrary Tailwind class. A copied registry component
            cannot rely on the consumer's Tailwind having scanned a class it has
            never seen.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody>
          <InstallBlock registryName="cta-banner" />
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
          <SourceView filePath="packages/usva/src/patterns/cta-banner/cta-banner.tsx" />
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
