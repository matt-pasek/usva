import { Card, CardBody, CardHeader } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";
import { AccordionDemo, SingleDemo } from "./disclosure-row-demo";

export const metadata: Metadata = {
  title: "Disclosure Row",
  description:
    "A row that expands. The accordion shell that ProgressRow deliberately does not contain.",
};

const props = [
  {
    name: "summary",
    type: "React.ReactNode",
    desc: "The row itself. A title, a ProgressRow, whatever the panel is about.",
  },
  {
    name: "children",
    type: "React.ReactNode",
    desc: "The panel. Stays mounted while closed so the height can transition.",
  },
  {
    name: "aside",
    type: "React.ReactNode",
    desc: "Trailing content inside the button. Counts, badges, figures.",
  },
  {
    name: "railColor",
    type: "string",
    desc: "Any CSS color for the left rail. Omit it and no rail draws.",
  },
  {
    name: "open",
    type: "boolean",
    desc: "Controlled. Leave it out to let the row manage itself.",
  },
  {
    name: "defaultOpen",
    type: "boolean",
    desc: "Starting state when uncontrolled.",
  },
  {
    name: "onOpenChange",
    type: "(open: boolean) => void",
    desc: "Fires on every click, controlled or not.",
  },
  { name: "disabled", type: "boolean", desc: "The row stops toggling." },
  {
    name: "buttonLabel",
    type: "string",
    desc: "Names the button when the summary is not plain text.",
  },
];

const usage = `import { DisclosureRow, ProgressRow } from "@matt-pasek/usva";

<DisclosureRow
  railColor="#52c989"
  summary={<ProgressRow label="Core studies" value={45} max={60} unit="cr" />}
  buttonLabel="Core studies"
>
  <CourseList />
</DisclosureRow>`;

export default function DisclosureRowPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Disclosure Row</h1>
        <p className="text-muted">
          A row that expands. The whole row is the button, so there is no small
          chevron to hunt for.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody>
          <SingleDemo />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>An accordion is three of them</CardHeader>
        <CardBody className="flex flex-col gap-3">
          <AccordionDemo />
          <p className="text-sm text-muted">
            There is no <code>Accordion</code> component. Hold the open id in
            state and pass <code>open</code> to each row. Uncontrolled rows open
            and close independently, which is what you want more often than not.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>The closed panel is inert</CardHeader>
        <CardBody>
          <p className="text-sm text-muted">
            The panel stays mounted while closed so its height can animate,
            which would otherwise leave every link inside it focusable and
            announced. It carries <code>inert</code> until it opens. The button
            points at it with <code>aria-controls</code> and reports{" "}
            <code>aria-expanded</code>.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Why this is not part of ProgressRow</CardHeader>
        <CardBody>
          <p className="text-sm text-muted">
            sisu wraps its progress rows in exactly this button. Folding the
            chevron and <code>aria-expanded</code> into <code>ProgressRow</code>{" "}
            would make every progress bar pretend to be interactive. They
            compose instead: pass a <code>ProgressRow</code> as the{" "}
            <code>summary</code>.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody>
          <InstallBlock registryName="disclosure-row" />
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
          <SourceView filePath="packages/usva/src/patterns/disclosure-row/disclosure-row.tsx" />
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
