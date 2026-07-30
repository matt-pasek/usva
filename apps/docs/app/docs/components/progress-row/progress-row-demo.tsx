"use client";
import { ProgressRow } from "@usva-ui/react/patterns/progress-row";
import { Badge } from "@usva-ui/react/primitives/badge";
import { Playground } from "@/components/docs/playground";

const STATUSES = ["none", "complete", "in progress", "blocked"] as const;

type Config = {
  label: string;
  value: number;
  max: number;
  unit: string;
  barColor: string;
  status: (typeof STATUSES)[number];
};

const base: Config = {
  label: "Computer Science",
  value: 12,
  max: 30,
  unit: "cr",
  barColor: "#8b5cf6",
  status: "in progress",
};

const templates: Record<string, Config> = {
  "in progress": base,
  complete: { ...base, value: 30, barColor: "#52c989", status: "complete" },
  empty: {
    ...base,
    label: "Electives",
    value: 0,
    max: 15,
    barColor: "",
    status: "none",
  },
  blocked: {
    ...base,
    label: "Thesis",
    value: 4,
    max: 40,
    barColor: "#f0a04b",
    status: "blocked",
  },
};

const badgeFor = (status: Config["status"]) => {
  if (status === "complete") return <Badge tone="success">Complete</Badge>;
  if (status === "in progress")
    return <Badge tone="warning">In progress</Badge>;
  if (status === "blocked") return <Badge tone="danger">Blocked</Badge>;
  return undefined;
};

const statusJsx = (status: Config["status"]): string | undefined => {
  if (status === "complete") return '<Badge tone="success">Complete</Badge>';
  if (status === "in progress")
    return '<Badge tone="warning">In progress</Badge>';
  if (status === "blocked") return '<Badge tone="danger">Blocked</Badge>';
  return undefined;
};

const snippetFor = (c: Config): string => {
  const status = statusJsx(c.status);
  const lines = [
    `  label="${c.label}"`,
    `  value={${c.value}}`,
    `  max={${c.max}}`,
    c.unit && `  unit="${c.unit}"`,
    c.barColor && `  barColor="${c.barColor}"`,
    status && `  status={${status}}`,
  ].filter(Boolean);
  const imports = [
    `import { ProgressRow } from "@usva-ui/react/patterns/progress-row";`,
    status != null &&
      `import { Badge } from "@usva-ui/react/primitives/badge";`,
  ].filter(Boolean);
  return `${imports.join("\n")}

<ProgressRow
${lines.join("\n")}
/>`;
};

export function ProgressRowDemo() {
  return (
    <Playground<Config>
      templates={templates}
      stageClassName="w-full"
      fields={[
        { kind: "text", key: "label", label: "label", sub: "the row's name" },
        {
          kind: "slider",
          key: "value",
          label: "value",
          sub: "current amount",
          min: 0,
          max: 40,
          step: 1,
        },
        {
          kind: "slider",
          key: "max",
          label: "max",
          sub: "target amount",
          min: 0,
          max: 40,
          step: 1,
        },
        {
          kind: "text",
          key: "unit",
          label: "unit",
          sub: "trailing figure unit",
        },
        {
          kind: "color",
          key: "barColor",
          label: "barColor",
          sub: "categorical key color, not a verdict",
        },
        {
          kind: "select",
          key: "status",
          label: "status",
          sub: "a slot, usually a Badge",
          options: STATUSES,
        },
      ]}
      snippet={snippetFor}
      render={(c) => (
        <div className="mx-auto w-full max-w-xl">
          <ProgressRow
            label={c.label}
            value={c.value}
            max={c.max}
            unit={c.unit || undefined}
            barColor={c.barColor || undefined}
            status={badgeFor(c.status)}
          />
        </div>
      )}
    />
  );
}
