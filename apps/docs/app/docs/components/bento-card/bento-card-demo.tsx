"use client";
import {
  BentoCard,
  BentoGrid,
  BentoMetric,
  BentoText,
} from "@usva-ui/react/patterns/bento-grid";
import { Playground } from "@/components/docs/playground";

const HIGHLIGHTS = ["none", "wash", "edge", "ring"] as const;

type Config = {
  span: number;
  rowSpan: number;
  highlight: (typeof HIGHLIGHTS)[number];
};

const base: Config = { span: 2, rowSpan: 2, highlight: "wash" };

const templates: Record<string, Config> = {
  focal: { ...base },
  "full width": { span: 3, rowSpan: 1, highlight: "edge" },
  "tall column": { span: 1, rowSpan: 2, highlight: "ring" },
  flat: { span: 1, rowSpan: 1, highlight: "none" },
};

const snippetFor = (c: Config): string => {
  const attrs = [
    `span={${c.span}}`,
    `rowSpan={${c.rowSpan}}`,
    c.highlight !== "none" && `highlight="${c.highlight}"`,
  ]
    .filter(Boolean)
    .join(" ");
  return `import { BentoCard, BentoGrid } from "@usva-ui/react/patterns/bento-grid";

<BentoGrid columns={3}>
  <BentoCard ${attrs}>...</BentoCard>
  <BentoCard>...</BentoCard>
  <BentoCard>...</BentoCard>
</BentoGrid>`;
};

export function BentoCardDemo() {
  return (
    <Playground<Config>
      templates={templates}
      stageClassName="w-full"
      fields={[
        {
          kind: "slider",
          key: "span",
          label: "span",
          sub: "columns the cell covers",
          min: 1,
          max: 3,
          step: 1,
        },
        {
          kind: "slider",
          key: "rowSpan",
          label: "rowSpan",
          sub: "rows the cell covers",
          min: 1,
          max: 3,
          step: 1,
        },
        {
          kind: "select",
          key: "highlight",
          label: "highlight",
          sub: "edge treatment on the cell",
          options: HIGHLIGHTS,
        },
      ]}
      snippet={snippetFor}
      render={(c) => (
        <BentoGrid columns={3} className="w-full">
          <BentoCard span={c.span} rowSpan={c.rowSpan} highlight={c.highlight}>
            <BentoText
              label="Focal"
              title="The cell you sized."
              body="Everything else backfills around it."
            />
          </BentoCard>
          <BentoCard>
            <BentoMetric value="2.4" suffix="k" label="active users" />
          </BentoCard>
          <BentoCard>
            <BentoMetric value="94" suffix="%" label="hit ratio" />
          </BentoCard>
          <BentoCard>
            <BentoMetric value="12" label="shipped" />
          </BentoCard>
        </BentoGrid>
      )}
    />
  );
}
