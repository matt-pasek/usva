"use client";
import { SulaFab, type SulaFabAction } from "@matt-pasek/usva";
import { Playground } from "@/components/docs/playground";

function Glyph({ d }: { d: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

const ACTIONS: SulaFabAction[] = [
  { icon: <Glyph d="M12 5v14M5 12h14" />, label: "New note" },
  { icon: <Glyph d="M4 7h16M4 12h16M4 17h10" />, label: "New list" },
  {
    icon: (
      <Glyph d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
    ),
    label: "Message",
  },
];

const LAYOUTS = ["line", "arc"] as const;
const DIRECTIONS = ["up", "down", "left", "right"] as const;
const TOOLTIPS = ["auto", "left", "right", "top"] as const;

type Config = {
  label: string;
  layout: (typeof LAYOUTS)[number];
  direction: (typeof DIRECTIONS)[number];
  tooltipPosition: (typeof TOOLTIPS)[number];
  gap: number;
  fluid: boolean;
  shine: number;
};

const base: Config = {
  label: "Create",
  layout: "line",
  direction: "up",
  tooltipPosition: "auto",
  gap: 12,
  fluid: true,
  shine: 0.7,
};

const templates: Record<string, Config> = {
  "speed dial": base,
  "arc fan": { ...base, layout: "arc" },
  "opens right": { ...base, direction: "right" },
  "fallback menu": { ...base, fluid: false },
};

const snippetFor = (c: Config): string => {
  const attrs = [
    `label="${c.label}"`,
    c.layout !== "line" && `layout="${c.layout}"`,
    c.direction !== "up" && `direction="${c.direction}"`,
    c.tooltipPosition !== "auto" && `tooltipPosition="${c.tooltipPosition}"`,
    c.gap !== base.gap && `gap={${c.gap}}`,
    !c.fluid && "fluid={false}",
    c.shine !== base.shine && `shine={${c.shine}}`,
  ]
    .filter(Boolean)
    .join("\n  ");
  return `import { SulaFab } from "@matt-pasek/usva";

<SulaFab
  ${attrs}
  actions={actions}
/>`;
};

function Preview(c: Config) {
  return (
    <div className="flex min-h-64 w-full items-end justify-center py-8">
      <SulaFab
        key={`${c.layout}-${c.direction}-${c.fluid}-${c.gap}`}
        fluid={c.fluid}
        layout={c.layout}
        direction={c.direction}
        tooltipPosition={
          c.tooltipPosition === "auto" ? undefined : c.tooltipPosition
        }
        gap={c.gap}
        shine={c.shine}
        actions={ACTIONS}
        label={c.label}
      />
    </div>
  );
}

export function SulaFabDemo() {
  return (
    <Playground<Config>
      templates={templates}
      fields={[
        {
          kind: "text",
          key: "label",
          label: "label",
          sub: "the trigger's accessible name",
        },
        {
          kind: "select",
          key: "layout",
          label: "layout",
          sub: "stack along a line or fan an arc",
          options: LAYOUTS,
        },
        {
          kind: "select",
          key: "direction",
          label: "direction",
          sub: "which way a line opens",
          options: DIRECTIONS,
        },
        {
          kind: "select",
          key: "tooltipPosition",
          label: "tooltipPosition",
          sub: "tooltip side; auto is left for lines, top for arcs",
          options: TOOLTIPS,
        },
        {
          kind: "slider",
          key: "gap",
          label: "gap",
          sub: "edge gap in px between trigger and beads",
          min: 4,
          max: 24,
          step: 1,
        },
        {
          kind: "switch",
          key: "fluid",
          label: "fluid",
          sub: "off renders the plain stacked menu",
        },
        {
          kind: "slider",
          key: "shine",
          label: "shine",
          sub: "0 matte glass, 1 full neon rim",
          min: 0,
          max: 1,
          step: 0.05,
        },
      ]}
      snippet={snippetFor}
      render={(c) => <Preview {...c} />}
    />
  );
}
