import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { DemoPanel } from "@/components/docs/demo-panel";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";
import {
  BackgroundDemo,
  CompactDemo,
  EditableDemo,
  MetricDemo,
} from "./page-header-demo";

export const metadata: Metadata = pageMetadata("/docs/components/page-header", {
  title: "Page Header",
  description:
    "The top of a screen: eyebrow, title, the stats worth reading first, an aside, and an editable control tray.",
});

const props = [
  {
    name: "eyebrow",
    type: "ReactNode",
    desc: "mono line above the title. a status word, a period, a breadcrumb.",
  },
  { name: "title", type: "ReactNode", desc: "the headline." },
  {
    name: "titleAccent",
    type: "ReactNode",
    desc: "second phrase of the title, carrying the accent color.",
  },
  {
    name: "accentColor",
    type: "string",
    defaultValue: "accent token",
    desc: "any CSS color.",
  },
  {
    name: "headingLevel",
    type: '"h1" | "h2" | "h3"',
    defaultValue: '"h1"',
    desc: "the heading element the title renders as.",
  },
  {
    name: "meta",
    type: "ReactNode",
    desc: "line under the title. dates, counts, a status dot.",
  },
  {
    name: "children",
    type: "ReactNode",
    desc: "stat row under the meta line. pass PageHeaderStats.",
  },
  {
    name: "aside",
    type: "ReactNode",
    desc: "the right-hand column. a PageHeaderMetric, a panel row, a chart.",
  },
  {
    name: "action",
    type: "ReactNode",
    desc: "control pinned to the top right. usually an icon-only Button.",
  },
  {
    name: "controls",
    type: "ReactNode",
    desc: "revealed under the copy column while controlsOpen. pass ToggleChipGroups.",
  },
  {
    name: "controlsOpen",
    type: "boolean",
    defaultValue: "false",
    desc: "whether the control tray is expanded. controlled.",
  },
  {
    name: "progress",
    type: "ReactNode",
    desc: "spans both columns, under them. a Progress, a ProgressRow, a segmented bar.",
  },
  {
    name: "footer",
    type: "ReactNode",
    desc: "small print along the bottom.",
  },
  {
    name: "background",
    type: "ReactNode",
    desc: (
      <>
        painted behind everything, under a scrim built from the{" "}
        <code>surface</code> token. no background, no scrim.
      </>
    ),
  },
  {
    name: "size",
    type: '"default" | "compact"',
    defaultValue: '"default"',
    desc: "compact shrinks the title and centers the two columns.",
  },
];

const partProps = [
  {
    name: "PageHeaderStats",
    type: "dl",
    desc: "the stat row. wraps PageHeaderStat children.",
  },
  {
    name: "PageHeaderStat",
    type: "label, value, sub, tone, variant",
    desc: (
      <>
        variant: <code>plain</code> sits on the header, <code>featured</code> is
        the tinted lead tile, <code>panel</code> is a standalone card for the
        aside.
      </>
    ),
  },
  {
    name: "PageHeaderMetric",
    type: "value, total, caption",
    desc: (
      <>
        the big number. total renders as <code>value / total</code> at roughly
        half the size.
      </>
    ),
  },
];

export default function PageHeaderPage() {
  return (
    <ComponentDoc
      slug="page-header"
      client
      description={
        <>
          the block a view opens with. every part but the title is optional, so
          it degrades from a full dashboard hero all the way down to a plain
          headline.
        </>
      }
      composition={{
        ok: [
          "the first block of a view, above a DashboardGrid or a content column",
          "the aside takes a PageHeaderMetric or panel-variant stats, controls take ToggleChipGroups",
        ],
        no: [
          "one per view. a section inside the page gets a SectionHeading",
          "the control tray configures the header, it is not a filter bar for the page",
        ],
      }}
      a11y={
        <>
          stats pair label and value in a{" "}
          <code className="font-mono text-xs">dl</code> · the closed control
          tray is <code className="font-mono text-xs">inert</code> · the scrim
          is <code className="font-mono text-xs">aria-hidden</code>
        </>
      }
    >
      <DemoPanel
        label="editable"
        note="the pencil toggles controlsOpen. the chips here add and remove stat tiles"
      >
        <EditableDemo />
      </DemoPanel>

      <DemoPanel label="metric and progress strip">
        <MetricDemo />
      </DemoPanel>

      <DemoPanel
        label="compact"
        note="the aside is a second PageHeaderStats with panel tiles"
      >
        <CompactDemo />
      </DemoPanel>

      <DemoPanel label="background slot">
        <BackgroundDemo />
      </DemoPanel>

      <PropsTable rows={props} />

      <PropsTable rows={partProps} />

      <AcquireSection
        registryName="page-header"
        usage={`import { PageHeader, PageHeaderMetric, PageHeaderStat, PageHeaderStats } from "usva/patterns/page-header";

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
</PageHeader>`}
      />
    </ComponentDoc>
  );
}
