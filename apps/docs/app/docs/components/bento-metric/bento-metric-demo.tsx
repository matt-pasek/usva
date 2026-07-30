"use client";
import {
  BentoCard,
  BentoGrid,
  BentoMetric,
} from "@usva-ui/react/patterns/bento-grid";
import { Playground } from "@/components/docs/playground";

const SIZES = ["md", "lg"] as const;

type Config = {
  value: string;
  suffix: string;
  label: string;
  note: string;
  size: (typeof SIZES)[number];
  animate: boolean;
};

const base: Config = {
  value: "2.4",
  suffix: "k",
  label: "active users",
  note: "",
  size: "md",
  animate: true,
};

const templates: Record<string, Config> = {
  stat: { ...base },
  "with a caveat": {
    ...base,
    value: "41",
    suffix: "",
    label: "repositories",
    note: "9 of them abandoned",
  },
  standalone: {
    ...base,
    value: "94",
    suffix: "%",
    label: "hit ratio",
    size: "lg",
  },
  verbatim: {
    ...base,
    value: "n/a",
    suffix: "",
    label: "not measured",
    animate: false,
  },
};

const snippetFor = (c: Config): string => {
  const attrs = [
    c.animate && "animate",
    `value="${c.value}"`,
    c.suffix && `suffix="${c.suffix}"`,
    `label="${c.label}"`,
    c.note && `note="${c.note}"`,
    c.size !== "md" && `size="${c.size}"`,
  ]
    .filter(Boolean)
    .join(" ");
  return `import { BentoMetric } from "@usva-ui/react/patterns/bento-grid";

<BentoMetric ${attrs} />`;
};

export function BentoMetricDemo() {
  return (
    <Playground<Config>
      templates={templates}
      stageClassName="w-full"
      fields={[
        { kind: "text", key: "value", label: "value", sub: "the stat itself" },
        {
          kind: "text",
          key: "suffix",
          label: "suffix",
          sub: "unit after the number",
        },
        { kind: "text", key: "label", label: "label", sub: "the pill beneath" },
        {
          kind: "text",
          key: "note",
          label: "note",
          sub: "aside under the value",
        },
        {
          kind: "select",
          key: "size",
          label: "size",
          sub: "weight of the value",
          options: SIZES,
        },
        {
          kind: "switch",
          key: "animate",
          label: "animate",
          sub: "count up from zero on mount",
        },
      ]}
      snippet={snippetFor}
      render={(c) => (
        <BentoGrid columns={2} className="w-full">
          <BentoCard>
            <BentoMetric
              key={`${c.animate}-${c.value}`}
              animate={c.animate}
              value={c.value}
              suffix={c.suffix || undefined}
              label={c.label}
              note={c.note || undefined}
              size={c.size}
            />
          </BentoCard>
          <BentoCard>
            <BentoMetric value="12" label="shipped" note="since january" />
          </BentoCard>
        </BentoGrid>
      )}
    />
  );
}
