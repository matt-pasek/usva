import { StatCard } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { DemoPanel } from "@/components/docs/demo-panel";
import { PropsTable } from "@/components/docs/props-table";

export const metadata: Metadata = {
  title: "Stat Card",
  description:
    "One metric in a tile: a big value, a coloured trend, an optional sparkline, and a note on why it moved.",
};

const props = [
  {
    name: "label",
    type: "React.ReactNode",
    desc: "the uppercase metric label at the top.",
  },
  {
    name: "value",
    type: "React.ReactNode",
    desc: "the figure. mono, tabular, the loudest thing in the tile.",
  },
  {
    name: "unit",
    type: "React.ReactNode",
    desc: "quiet suffix beside the value, e.g. ms, %.",
  },
  {
    name: "note",
    type: "React.ReactNode",
    desc: "the footnote beside the trend glyph.",
  },
  {
    name: "icon",
    type: "React.ReactNode",
    desc: "decorative glyph chip in the top-right corner.",
  },
  {
    name: "trend",
    type: '"up" | "down" | "flat"',
    desc: "colors the note and prepends a directional glyph. up is success, down is danger.",
  },
  {
    name: "size",
    type: '"sm" | "md"',
    defaultValue: '"md"',
    desc: "padding and value size.",
  },
  {
    name: "featured",
    type: "boolean",
    defaultValue: "false",
    desc: "blows the tile up to a hero stat with a much larger numeral.",
  },
  {
    name: "tone",
    type: '"neutral" | "accent" | "accent-alt"',
    defaultValue: '"neutral"',
    desc: "tints the border and colors the value.",
  },
  {
    name: "surface",
    type: "CardSurface",
    defaultValue: '"elevated"',
    desc: "how the tile sits on the page. passed through to Card.",
  },
  {
    name: "spark",
    type: "React.ReactNode",
    desc: "slot for a sparkline or mini-chart, stretched to fill.",
  },
];

export default function StatCardPage() {
  return (
    <ComponentDoc
      slug="stat-card"
      description={
        <>
          one metric in a tile: a big value, a quiet unit, and a colored trend.{" "}
          <b>one featured tile per grid</b>; the rest stay smaller.
        </>
      }
      composition={{
        ok: [
          "grids of two to four on a dashboard, or inside DashboardGrid",
          "the spark slot takes a sparkline that stretches to the tile width",
        ],
        no: [
          "not a marketing proof strip, that is StatBento",
          "no actions inside. a metric that opens something wraps in a link",
        ],
      }}
      a11y={
        <>
          the icon and trend glyph are{" "}
          <code className="font-mono text-xs">aria-hidden</code> · the trend
          meaning is duplicated by the note text, never color alone
        </>
      }
      dependencies={
        <>
          Card <span className="text-muted">from the same package</span>
        </>
      }
    >
      <DemoPanel>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StatCard
            label="Revenue"
            value="48.2"
            unit="k"
            trend="up"
            note="8.1% MoM"
          />
          <StatCard
            label="Response time"
            value="128"
            unit="ms"
            trend="down"
            note="12% faster"
          />
          <StatCard
            label="Active users"
            value="2,940"
            trend="flat"
            note="steady"
          />
          <StatCard
            size="sm"
            label="Error rate"
            value="0.03"
            unit="%"
            trend="down"
            note="within SLO"
            spark={
              <svg
                aria-hidden="true"
                viewBox="0 0 100 24"
                preserveAspectRatio="none"
                className="h-6 text-accent"
              >
                <polyline
                  points="0,18 20,14 40,16 60,8 80,10 100,4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
            }
          />
        </div>
      </DemoPanel>

      <DemoPanel label="featured · tone">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StatCard
            featured
            tone="accent"
            label="Stars"
            value="12.4k"
            note="all-time"
          />
          <StatCard
            featured
            tone="accent-alt"
            label="Uptime"
            value="99.98"
            unit="%"
            trend="up"
            note="30-day"
          />
        </div>
      </DemoPanel>

      <PropsTable rows={props} />

      <AcquireSection
        registryName="stat-card"
        usage={`import { StatCard } from "@matt-pasek/usva";

<StatCard
  label="Response time"
  value="128"
  unit="ms"
  trend="down"
  note="12% faster"
/>`}
      />
    </ComponentDoc>
  );
}
