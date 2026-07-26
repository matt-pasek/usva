"use client";
import {
  BentoCard,
  BentoGrid,
  BentoInfo,
  BentoMetric,
  BentoText,
} from "@matt-pasek/usva/patterns/bento-grid";
import { Chip } from "@matt-pasek/usva/primitives/chip";
import { Playground } from "@/components/docs/playground";

const HIGHLIGHTS = ["none", "wash", "edge", "ring"] as const;

type Config = {
  columns: number;
  focalSpan: number;
  focalRowSpan: number;
  highlight: (typeof HIGHLIGHTS)[number];
  animate: boolean;
};

const base: Config = {
  columns: 3,
  focalSpan: 2,
  focalRowSpan: 2,
  highlight: "wash",
  animate: true,
};

const contentSpans = (c: Config): [number, number, number] => {
  const side = c.columns - c.focalSpan;
  if (side <= 0) return [1, 1, Math.max(1, c.columns - 2)];
  if (c.focalRowSpan >= 2) return [side, side, c.columns];
  return [side, side, c.columns - side];
};

const templates: Record<string, Config> = {
  "proof wall": { ...base },
  "stat row": {
    ...base,
    columns: 4,
    focalSpan: 2,
    focalRowSpan: 1,
    highlight: "none",
  },
  "hero cell": {
    ...base,
    focalRowSpan: 1,
    highlight: "ring",
    animate: false,
  },
  "single accent": {
    ...base,
    columns: 3,
    focalSpan: 3,
    focalRowSpan: 1,
    highlight: "edge",
    animate: false,
  },
};

const snippetFor = (c: Config): string => {
  const focalAttrs = [
    `span={${c.focalSpan}}`,
    `rowSpan={${c.focalRowSpan}}`,
    c.highlight !== "none" && `highlight="${c.highlight}"`,
  ]
    .filter(Boolean)
    .join(" ");
  const metricAttrs = (value: string, suffix: string, label: string) =>
    `<BentoMetric ${c.animate ? "animate " : ""}value="${value}" suffix="${suffix}" label="${label}" />`;
  const [m1, m2, info] = contentSpans(c);
  return `import { BentoCard, BentoGrid, BentoInfo, BentoMetric, BentoText } from "@matt-pasek/usva/patterns/bento-grid";
import { Chip } from "@matt-pasek/usva/primitives/chip";

<BentoGrid columns={${c.columns}}>
  <BentoCard ${focalAttrs}>
    <BentoText
      label="Problem"
      title="Students could not see their whole degree."
      body="Requirements were spread across four systems, none of which agreed."
    />
  </BentoCard>
  <BentoCard span={${m1}}>
    ${metricAttrs("2.4", "k", "active users")}
  </BentoCard>
  <BentoCard span={${m2}}>
    ${metricAttrs("94", "%", "hit ratio")}
  </BentoCard>
  <BentoCard span={${info}}>
    <BentoInfo label="Stack">
      <Chip>React</Chip>
      <Chip>Tailwind</Chip>
      <Chip>Base UI</Chip>
    </BentoInfo>
  </BentoCard>
</BentoGrid>`;
};

export function BentoGridDemo() {
  return (
    <Playground<Config>
      templates={templates}
      stageClassName="w-full"
      fields={[
        {
          kind: "slider",
          key: "columns",
          label: "columns",
          sub: "grid track count",
          min: 2,
          max: 4,
          step: 1,
        },
        {
          kind: "slider",
          key: "focalSpan",
          label: "span",
          sub: "columns the focal cell spans",
          min: 1,
          max: 4,
          step: 1,
        },
        {
          kind: "slider",
          key: "focalRowSpan",
          label: "rowSpan",
          sub: "rows the focal cell spans",
          min: 1,
          max: 3,
          step: 1,
        },
        {
          kind: "select",
          key: "highlight",
          label: "highlight",
          sub: "focal cell edge treatment",
          options: HIGHLIGHTS,
        },
        {
          kind: "switch",
          key: "animate",
          label: "animate",
          sub: "count metrics up from zero",
        },
      ]}
      snippet={snippetFor}
      render={(c) => {
        const [m1, m2, info] = contentSpans(c);
        return (
          <BentoGrid columns={c.columns} className="w-full">
            <BentoCard
              span={c.focalSpan}
              rowSpan={c.focalRowSpan}
              highlight={c.highlight}
            >
              <BentoText
                label="Problem"
                title="Students could not see their whole degree."
                body="Requirements were spread across four systems, none of which agreed with the others."
              />
            </BentoCard>
            <BentoCard span={m1}>
              <BentoMetric
                key={`u-${c.animate}`}
                animate={c.animate}
                value="2.4"
                suffix="k"
                label="active users"
              />
            </BentoCard>
            <BentoCard span={m2}>
              <BentoMetric
                key={`h-${c.animate}`}
                animate={c.animate}
                value="94"
                suffix="%"
                label="hit ratio"
              />
            </BentoCard>
            <BentoCard span={info}>
              <BentoInfo label="Stack">
                <div className="flex flex-wrap gap-1.5">
                  <Chip>React</Chip>
                  <Chip>Tailwind</Chip>
                  <Chip>Base UI</Chip>
                </div>
              </BentoInfo>
            </BentoCard>
          </BentoGrid>
        );
      }}
    />
  );
}
