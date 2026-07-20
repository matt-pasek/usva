import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { ToolbarDemo } from "./toolbar-demo";

export const metadata: Metadata = {
  title: "Toolbar",
  description:
    "A horizontal action bar over a working surface: grouped controls on the left, a trailing actions cluster on the right.",
};

const props = [
  {
    name: "role",
    type: "string",
    defaultValue: '"toolbar"',
    desc: "override only when the bar is purely presentational.",
  },
  {
    name: "ToolbarLegend · max",
    type: "number",
    desc: 'caps the visible keys; the rest collapse into a "+N" indicator.',
  },
  {
    name: "ToolbarLegendItem · swatch",
    type: "string",
    desc: "any CSS color, following StripeCard's stripeColor. unset falls back to a neutral token.",
  },
  {
    name: "ToolbarCount · count",
    type: "number",
    desc: "at zero the chip renders nothing, so callers stop guarding.",
  },
  {
    name: "ToolbarCount · tone",
    type: '"accent" | "accent-alt" | "success" | "warning" | "danger"',
    defaultValue: '"accent"',
    desc: "semantic tone for the chip and its dot.",
  },
];

export default function ToolbarPage() {
  return (
    <ComponentDoc
      slug="toolbar"
      description={
        <>
          a horizontal bar over a working surface: groups of related controls on
          the left, a trailing actions cluster on the right, and it wraps instead
          of clipping.
        </>
      }
      composition={{
        ok: [
          "tops a table, board, or panel it acts on",
          "small controls only: sm buttons, badges, legend keys, count chips",
        ],
        no: [
          "not navigation and not a page header",
          "no solid buttons except the one primary action in ToolbarActions",
        ],
      }}
      a11y={
        <>
          <code className="font-mono text-xs">role="toolbar"</code> on the row,
          give it an <code className="font-mono text-xs">aria-label</code> ·
          swatches and count dots are{" "}
          <code className="font-mono text-xs">aria-hidden</code>
        </>
      }
    >
      <ToolbarDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="toolbar"
        usage={`import { Toolbar, ToolbarActions, ToolbarGroup, Button } from "@matt-pasek/usva";

<Toolbar aria-label="projects toolbar">
  <ToolbarGroup>
    <Button size="sm" variant="ghost">Filter</Button>
  </ToolbarGroup>
  <ToolbarActions>
    <Button size="sm">New</Button>
  </ToolbarActions>
</Toolbar>`}
      />
    </ComponentDoc>
  );
}
