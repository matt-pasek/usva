"use client";
import { useState } from "react";
import { ToggleChip, ToggleChipGroup } from "usva/primitives/toggle-chip";
import { Playground } from "@/components/docs/playground";

const CHIPS = [
  ["grade-avg", "Grade avg."],
  ["active-courses", "Active courses"],
  ["credits-left", "Credits left"],
  ["study-right", "Study right"],
  ["urgent-deadlines", "Urgent deadlines"],
] as const;

const TYPES = ["multiple", "single"] as const;

type Config = {
  type: (typeof TYPES)[number];
  label: string;
  min: number;
  max: number;
  disabled: boolean;
};

const base: Config = {
  type: "multiple",
  label: "Visible stats",
  min: 2,
  max: 4,
  disabled: false,
};

const templates: Record<string, Config> = {
  "bounded multi-select": base,
  "one of many": { ...base, type: "single", label: "Panel view" },
  "pick any": { ...base, label: "Columns", min: 0, max: 5 },
  disabled: { ...base, disabled: true },
};

function Preview({ config }: { config: Config }) {
  const [multi, setMulti] = useState<string[]>([
    "grade-avg",
    "active-courses",
    "credits-left",
  ]);
  const [single, setSingle] = useState("grade-avg");

  if (config.type === "single") {
    return (
      <ToggleChipGroup
        type="single"
        value={single}
        onValueChange={setSingle}
        label={config.label}
        disabled={config.disabled}
      >
        {CHIPS.map(([id, text]) => (
          <ToggleChip key={id} value={id}>
            {text}
          </ToggleChip>
        ))}
      </ToggleChipGroup>
    );
  }

  return (
    <ToggleChipGroup
      value={multi}
      onValueChange={setMulti}
      label={config.label}
      min={config.min}
      max={config.max}
      disabled={config.disabled}
    >
      {CHIPS.map(([id, text]) => (
        <ToggleChip key={id} value={id}>
          {text}
        </ToggleChip>
      ))}
    </ToggleChipGroup>
  );
}

const snippetFor = (c: Config): string => {
  const single = c.type === "single";
  const attrs = [
    single && `type="single"`,
    single ? `value={panel}` : `value={stats}`,
    single ? `onValueChange={setPanel}` : `onValueChange={setStats}`,
    c.label && `label="${c.label}"`,
    !single && c.min > 0 && `min={${c.min}}`,
    !single && c.max < CHIPS.length && `max={${c.max}}`,
    c.disabled && "disabled",
  ]
    .filter(Boolean)
    .join(" ");
  return `import { ToggleChip, ToggleChipGroup } from "usva/primitives/toggle-chip";

<ToggleChipGroup ${attrs}>
  <ToggleChip value="grade-avg">Grade avg.</ToggleChip>
  <ToggleChip value="active-courses">Active courses</ToggleChip>
  <ToggleChip value="credits-left">Credits left</ToggleChip>
</ToggleChipGroup>`;
};

export function ToggleChipDemo() {
  return (
    <Playground<Config>
      templates={templates}
      fields={[
        {
          kind: "select",
          key: "type",
          label: "type",
          sub: "multi-select or one-of-many",
          options: TYPES,
        },
        {
          kind: "text",
          key: "label",
          label: "label",
          sub: "mono eyebrow before the chips",
        },
        {
          kind: "slider",
          key: "min",
          label: "min",
          sub: "multiple only. floor selection locks",
          min: 0,
          max: 5,
        },
        {
          kind: "slider",
          key: "max",
          label: "max",
          sub: "multiple only. ceiling selection locks",
          min: 1,
          max: 5,
        },
        {
          kind: "switch",
          key: "disabled",
          label: "disabled",
          sub: "the fieldset disables every chip",
        },
      ]}
      snippet={snippetFor}
      render={(c) => <Preview key={c.type} config={c} />}
    />
  );
}
