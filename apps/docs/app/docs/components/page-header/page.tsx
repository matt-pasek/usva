import { Card, CardBody, CardHeader } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";
import {
  BackgroundDemo,
  CompactDemo,
  EditableDemo,
  MetricDemo,
} from "./page-header-demo";

export const metadata: Metadata = {
  title: "Page Header",
  description:
    "The header a view opens with: eyebrow, title, stats, an aside, a progress strip, and an editable control tray.",
};

const props = [
  {
    name: "eyebrow",
    type: "React.ReactNode",
    desc: "Mono line above the title. A status word, a period, a breadcrumb.",
  },
  { name: "title", type: "React.ReactNode", desc: "The headline." },
  {
    name: "titleAccent",
    type: "React.ReactNode",
    desc: "Second phrase of the title, carrying the accent color.",
  },
  {
    name: "accentColor",
    type: "string",
    desc: "Any CSS color. Falls back to the accent token.",
  },
  {
    name: "headingLevel",
    type: '"h1" | "h2" | "h3"',
    desc: "Defaults to h1.",
  },
  {
    name: "meta",
    type: "React.ReactNode",
    desc: "Line under the title. Dates, counts, a status dot.",
  },
  {
    name: "children",
    type: "React.ReactNode",
    desc: "Stat row under the meta line. Pass PageHeaderStats.",
  },
  {
    name: "aside",
    type: "React.ReactNode",
    desc: "The right-hand column. A PageHeaderMetric, a panel row, a chart.",
  },
  {
    name: "action",
    type: "React.ReactNode",
    desc: "Control pinned to the top right. Usually an IconButton.",
  },
  {
    name: "controls",
    type: "React.ReactNode",
    desc: "Revealed under the copy column while controlsOpen. Pass ToggleChipGroups.",
  },
  {
    name: "controlsOpen",
    type: "boolean",
    desc: "Whether the control tray is expanded. Controlled.",
  },
  {
    name: "progress",
    type: "React.ReactNode",
    desc: "Spans both columns, under them. A Progress, a ProgressRow, a segmented bar.",
  },
  {
    name: "footer",
    type: "React.ReactNode",
    desc: "Small print along the bottom.",
  },
  {
    name: "background",
    type: "React.ReactNode",
    desc: "Painted behind everything, under a scrim. A gradient, a canvas, anything.",
  },
  {
    name: "size",
    type: '"default" | "compact"',
    desc: "compact shrinks the title and centers the two columns.",
  },
];

const partProps = [
  {
    name: "PageHeaderStats",
    type: "dl",
    desc: "The stat row. Wraps PageHeaderStat children.",
  },
  {
    name: "PageHeaderStat",
    type: "label, value, sub, tone, variant",
    desc: 'variant: "plain" sits on the header, "featured" is the tinted lead tile, "panel" is a standalone card for the aside.',
  },
  {
    name: "PageHeaderMetric",
    type: "value, total, caption",
    desc: "The big number. total renders as `value / total` at roughly half the size.",
  },
];

const usage = `import {
  PageHeader,
  PageHeaderMetric,
  PageHeaderStat,
  PageHeaderStats,
} from "@matt-pasek/usva";

<PageHeader
  eyebrow="Lut University · Summer 2026"
  title="Good afternoon,"
  titleAccent="Mateusz."
  aside={<PageHeaderMetric value={76} total={193} caption="credits earned" />}
>
  <PageHeaderStats>
    <PageHeaderStat variant="featured" tone="accent" label="Grade avg." value="4.1" sub="4 graded" />
    <PageHeaderStat label="Active courses" value="4" sub="Enrolled" />
  </PageHeaderStats>
</PageHeader>`;

function PropsTable({
  rows,
  first,
}: {
  rows: { name: string; type: string; desc: string }[];
  first: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border text-muted">
            <th className="py-2 pr-4 font-medium">{first}</th>
            <th className="py-2 pr-4 font-medium">Type</th>
            <th className="py-2 font-medium">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <tr key={p.name} className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-xs text-ink">{p.name}</td>
              <td className="py-2 pr-4 font-mono text-xs text-muted">
                {p.type}
              </td>
              <td className="py-2 text-muted">{p.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function PageHeaderPage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Page Header</h1>
        <p className="text-muted">
          The block a view opens with. Every part but the title is optional, so
          it degrades from a dashboard hero all the way down to a headline. Two
          columns on a wide container, stacked on a narrow one.
        </p>
      </div>

      <Card>
        <CardHeader>Editable</CardHeader>
        <CardBody className="flex flex-col gap-3 bg-bg">
          <EditableDemo />
          <p className="text-sm text-muted">
            The pencil toggles <code>controlsOpen</code>, which expands a tray
            under the copy column. The tray is inert while closed, so its chips
            stay out of the tab order. What the chips actually control is yours:
            here they add and remove the stat tiles above.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>A metric and a progress strip</CardHeader>
        <CardBody className="flex flex-col gap-3 bg-bg">
          <MetricDemo />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Compact, with separate panels</CardHeader>
        <CardBody className="flex flex-col gap-3 bg-bg">
          <CompactDemo />
          <p className="text-sm text-muted">
            <code>size="compact"</code> shrinks the title and centers the
            columns. The aside here is a second <code>PageHeaderStats</code>{" "}
            whose tiles use <code>variant="panel"</code>, so each one reads as
            its own card.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Background</CardHeader>
        <CardBody className="flex flex-col gap-3 bg-bg">
          <BackgroundDemo />
          <p className="text-sm text-muted">
            Whatever you pass to <code>background</code> is painted behind the
            content, under a scrim built from the <code>surface</code> token, so
            the copy stays legible over it. No background, no scrim.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>It sizes off its container</CardHeader>
        <CardBody>
          <p className="text-sm text-muted">
            The title uses <code>cqi</code>, not <code>vw</code>, and the two
            columns split at a container width, not a viewport width. Drop the
            header into a narrow column and it stacks and shrinks instead of
            overrunning its neighbour.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody>
          <InstallBlock registryName="page-header" />
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
          <SourceView filePath="packages/usva/src/patterns/page-header/page-header.tsx" />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>PageHeader props</CardHeader>
        <CardBody>
          <PropsTable rows={props} first="Prop" />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Parts</CardHeader>
        <CardBody>
          <PropsTable rows={partProps} first="Part" />
        </CardBody>
      </Card>
    </main>
  );
}
