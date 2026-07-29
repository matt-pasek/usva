"use client";
import {
  Toolbar,
  ToolbarActions,
  ToolbarCount,
  ToolbarLegend,
  ToolbarLegendItem,
} from "usva/patterns/toolbar";
import { Button } from "usva/primitives/button";
import { Playground } from "@/components/docs/playground";

const TONES = ["accent", "accent-alt", "success", "warning", "danger"] as const;

const LEGEND = [
  { swatch: "#8b5cf6", label: "Computer Science" },
  { swatch: "#52c989", label: "Mathematics" },
  { swatch: "#e0b341", label: "Physics" },
  { swatch: "#6ea8fe", label: "Linguistics" },
  { swatch: "#e0556b", label: "Philosophy" },
];

type Config = {
  legendMax: number;
  count: number;
  countTone: (typeof TONES)[number];
  countLabel: string;
};

const base: Config = {
  legendMax: 5,
  count: 3,
  countTone: "accent",
  countLabel: "unsaved",
};

const templates: Record<string, Config> = {
  default: { ...base },
  "collapsed legend": { ...base, legendMax: 3 },
  "one issue": { ...base, count: 1, countTone: "warning", countLabel: "issue" },
  "nothing pending": { ...base, count: 0 },
};

const snippetFor = (c: Config): string => {
  const legendAttr = c.legendMax < LEGEND.length ? ` max={${c.legendMax}}` : "";
  const items = LEGEND.map(
    (l) =>
      `    <ToolbarLegendItem swatch="${l.swatch}">${l.label}</ToolbarLegendItem>`,
  ).join("\n");
  const toneAttr = c.countTone !== "accent" ? ` tone="${c.countTone}"` : "";
  const countLine =
    c.count > 0
      ? `\n    <ToolbarCount${toneAttr} count={${c.count}}>${c.countLabel}</ToolbarCount>`
      : "";
  return `import { Toolbar, ToolbarActions, ToolbarCount, ToolbarLegend, ToolbarLegendItem } from "usva/patterns/toolbar";
import { Button } from "usva/primitives/button";

<Toolbar aria-label="timeline toolbar">
  <ToolbarLegend${legendAttr}>
${items}
  </ToolbarLegend>
  <ToolbarActions>${countLine}
    <Button size="sm">Confirm</Button>
  </ToolbarActions>
</Toolbar>`;
};

export function ToolbarDemo() {
  return (
    <Playground<Config>
      templates={templates}
      stageClassName="w-full"
      fields={[
        {
          kind: "slider",
          key: "legendMax",
          label: "max",
          sub: "caps visible keys, rest collapse to +N",
          min: 1,
          max: 5,
          step: 1,
        },
        {
          kind: "slider",
          key: "count",
          label: "count",
          sub: "at zero the chip renders nothing",
          min: 0,
          max: 9,
          step: 1,
        },
        {
          kind: "select",
          key: "countTone",
          label: "tone",
          sub: "semantic tone for the count chip",
          options: TONES,
        },
        {
          kind: "text",
          key: "countLabel",
          label: "label",
          sub: "the noun after the number",
        },
      ]}
      snippet={snippetFor}
      render={(c) => (
        <div className="w-full overflow-hidden rounded-lg border border-border">
          <Toolbar aria-label="timeline toolbar">
            <ToolbarLegend max={c.legendMax}>
              {LEGEND.map((l) => (
                <ToolbarLegendItem key={l.label} swatch={l.swatch}>
                  {l.label}
                </ToolbarLegendItem>
              ))}
            </ToolbarLegend>
            <ToolbarActions>
              <ToolbarCount tone={c.countTone} count={c.count}>
                {c.countLabel}
              </ToolbarCount>
              <Button size="sm">Confirm</Button>
            </ToolbarActions>
          </Toolbar>
        </div>
      )}
    />
  );
}
