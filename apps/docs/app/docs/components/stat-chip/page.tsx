import { StatChip } from "@matt-pasek/usva/primitives/stat-chip";
import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { DemoPanel } from "@/components/docs/demo-panel";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata("/docs/components/stat-chip", {
  title: "Stat Chip",
  description:
    "One number in a pill: a credit balance, a quota, a count you keep glancing at.",
});

const props = [
  {
    name: "value",
    type: "ReactNode",
    desc: "the figure. semibold, tone-colored.",
  },
  {
    name: "label",
    type: "ReactNode",
    desc: 'leading muted label, e.g. "credits".',
  },
  {
    name: "unit",
    type: "ReactNode",
    desc: 'trailing faint unit, e.g. "cr", "%".',
  },
  {
    name: "tone",
    type: '"neutral" | "accent" | "accent-alt" | "success" | "warning" | "danger"',
    defaultValue: '"neutral"',
    desc: "tints the border and colors the value.",
  },
  {
    name: "size",
    type: '"sm" | "md"',
    defaultValue: '"md"',
    desc: "sm drops to a 24px pill for the densest rows.",
  },
];

export default function StatChipPage() {
  return (
    <ComponentDoc
      slug="stat-chip"
      description={
        <>
          a mini metric in a pill: a label, a figure, an optional unit.{" "}
          <b>tone colors only the value</b>, so a row of them scans as numbers,
          not a rainbow.
        </>
      }
      composition={{
        ok: [
          "a wrapping row of metrics in a card header or dashboard row",
          "mixed tones side by side; the neutral chip is the resting state",
        ],
        no: [
          "not a status indicator. a state without a figure is Badge",
          "not clickable. it renders a span; a metric that navigates gets wrapped, not wired",
        ],
      }}
      a11y={
        <>
          a plain <code className="font-mono text-xs">span</code>: label, value
          and unit read in order · tone is never the only signal, the label
          names the metric
        </>
      }
      dependencies={
        <code className="font-mono text-xs">class-variance-authority</code>
      }
    >
      <DemoPanel label="tones">
        <div className="flex flex-wrap items-center gap-2">
          <StatChip label="total" value="1,240" />
          <StatChip tone="accent" label="active" value="86" />
          <StatChip tone="accent-alt" label="done" value="99" unit="%" />
          <StatChip tone="success" label="uptime" value="99.9" unit="%" />
          <StatChip tone="warning" label="due" value="4" />
          <StatChip tone="danger" label="failed" value="2" />
        </div>
      </DemoPanel>

      <DemoPanel label="sizes">
        <div className="flex flex-wrap items-center gap-2">
          <StatChip label="credits" value="142" unit="cr" />
          <StatChip size="sm" label="credits" value="142" unit="cr" />
        </div>
      </DemoPanel>

      <PropsTable rows={props} />

      <AcquireSection
        registryName="stat-chip"
        usage={`import { StatChip } from "@matt-pasek/usva/primitives/stat-chip";

<StatChip label="credits" value="142" unit="cr" />
<StatChip tone="accent-alt" label="done" value="99" unit="%" />`}
      />
    </ComponentDoc>
  );
}
