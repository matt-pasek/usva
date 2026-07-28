"use client";
import { StatBento } from "usva/patterns/stat-bento";
import { Playground } from "@/components/docs/playground";

type Config = {
  value1: string;
  suffix1: string;
  label1: string;
  value2: string;
  suffix2: string;
  label2: string;
  value3: string;
  suffix3: string;
  label3: string;
  animate: boolean;
};

const base: Config = {
  value1: "40",
  suffix1: "%",
  label1: "faster builds",
  value2: "2.4",
  suffix2: "k",
  label2: "active users",
  value3: "99.9",
  suffix3: "%",
  label3: "uptime",
  animate: true,
};

const templates: Record<string, Config> = {
  scale: {
    ...base,
    value1: "12",
    suffix1: "M",
    label1: "downloads",
    value2: "180",
    suffix2: "+",
    label2: "contributors",
    value3: "60",
    suffix3: "%",
    label3: "less code",
  },
  static: { ...base, animate: false },
};

const toStats = (c: Config) => [
  { value: c.value1, suffix: c.suffix1 || undefined, label: c.label1 },
  { value: c.value2, suffix: c.suffix2 || undefined, label: c.label2 },
  { value: c.value3, suffix: c.suffix3 || undefined, label: c.label3 },
];

const cellSrc = (value: string, suffix: string, label: string): string => {
  const parts = [`value: "${value}"`];
  if (suffix) parts.push(`suffix: "${suffix}"`);
  parts.push(`label: "${label}"`);
  return `    { ${parts.join(", ")} },`;
};

const snippetFor = (c: Config): string => {
  const rows = [
    cellSrc(c.value1, c.suffix1, c.label1),
    cellSrc(c.value2, c.suffix2, c.label2),
    cellSrc(c.value3, c.suffix3, c.label3),
  ].join("\n");
  return `import { StatBento } from "usva/patterns/stat-bento";

<StatBento${c.animate ? " animate" : ""}
  stats={[
${rows}
  ]}
/>`;
};

export function StatBentoDemo() {
  return (
    <Playground<Config>
      templates={templates}
      stageClassName="w-full"
      fields={[
        {
          kind: "switch",
          key: "animate",
          label: "animate",
          sub: "count each value up from zero on mount",
        },
      ]}
      snippet={snippetFor}
      render={(c) => (
        <StatBento
          key={`${c.animate}-${c.value1}-${c.value2}-${c.value3}`}
          animate={c.animate}
          stats={toStats(c)}
        />
      )}
    />
  );
}
