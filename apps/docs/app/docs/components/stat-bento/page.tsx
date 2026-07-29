import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";
import { StatBentoDemo } from "./stat-bento-demo";

export const metadata: Metadata = pageMetadata("/docs/components/stat-bento", {
  title: "Stat Bento",
  description:
    "The numbers you lead with, at display scale: big values with accent suffixes and a short label under each.",
});

const props = [
  {
    name: "stats",
    type: "StatBentoItem[]",
    desc: (
      <>
        the cells: <code>{"{ value, label, suffix?, icon? }"}</code>. the suffix
        carries the unit in accent-alt.
      </>
    ),
  },
  {
    name: "animate",
    type: "boolean",
    desc: "counts each numeric value up from zero on mount.",
  },
  {
    name: "as",
    type: "React.ElementType",
    defaultValue: '"div"',
    desc: (
      <>
        the element rendered as the grid. pass <code>RevealGroup</code> to
        stagger the cells: it animates its direct children, so it{" "}
        <b>must be the grid, not wrap it</b>.
      </>
    ),
  },
];

export default function StatBentoPage() {
  return (
    <ComponentDoc
      slug="stat-bento"
      description={
        <>
          a strip of headline numbers, each a big value with its unit in an
          accent suffix and a short label beneath. a proof strip to sit under a
          hero or a case study.
        </>
      }
      composition={{
        ok: [
          "a proof strip on a landing section, under a hero or a CaseStudyHero",
          "three cells reads best. cells take a translucent ink fill, safe inside a Card",
        ],
        no: [
          "not a dashboard. live metrics with trend and spark are StatCard",
          "never mix cell types. a mixed grid is BentoGrid",
        ],
      }}
      a11y={
        <>
          plain text in a grid · icons are decorative and{" "}
          <code className="font-mono text-xs">aria-hidden</code>
        </>
      }
      dependencies={
        <>
          BentoMetric <span className="text-muted">from the same package</span>
        </>
      }
    >
      <StatBentoDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="stat-bento"
        usage={`import { StatBento } from "usva/patterns/stat-bento";

<StatBento
  stats={[
    { value: "40", suffix: "%", label: "faster builds" },
    { value: "2.4", suffix: "k", label: "active users" },
    { value: "99.9", suffix: "%", label: "uptime" },
  ]}
/>`}
      />
    </ComponentDoc>
  );
}
