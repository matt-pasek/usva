"use client";
import {
  addItem,
  Button,
  clampItem,
  DashboardGrid,
  DashboardGridItem,
  findOpenSlot,
  type GridItem,
  Panel,
} from "@matt-pasek/usva";
import { useState } from "react";
import { Playground } from "@/components/docs/playground";

type Config = {
  columns: number;
  rows: number;
  rowHeight: number;
  gap: number;
  editing: boolean;
};

const base: Config = {
  columns: 10,
  rows: 6,
  rowHeight: 72,
  gap: 16,
  editing: false,
};

const templates: Record<string, Config> = {
  board: base,
  editing: { ...base, editing: true },
  dense: {
    ...base,
    columns: 12,
    rows: 8,
    rowHeight: 56,
    gap: 8,
    editing: true,
  },
  roomy: { ...base, columns: 8, rows: 5, rowHeight: 96, gap: 24 },
};

const CATALOGUE = [
  { id: "trajectory", label: "Credit trajectory", w: 4, h: 3, minW: 3 },
  { id: "upcoming", label: "Upcoming deadlines", w: 3, h: 3, minW: 2 },
  { id: "grades", label: "Grade trend", w: 3, h: 3, minW: 2 },
  { id: "timeline", label: "Timeline", w: 6, h: 2, minW: 4 },
  { id: "registration", label: "Registration", w: 4, h: 2 },
];

const labelOf = (id: string) =>
  CATALOGUE.find((entry) => entry.id === id)?.label ?? id;

const SEED: GridItem[] = [
  { id: "trajectory", x: 0, y: 0, w: 4, h: 3, minW: 3 },
  { id: "upcoming", x: 4, y: 0, w: 3, h: 3, minW: 2 },
  { id: "grades", x: 7, y: 0, w: 3, h: 3, minW: 2 },
  { id: "timeline", x: 0, y: 3, w: 6, h: 2, minW: 4 },
];

function Widget({ label }: { label: string }) {
  return (
    <Panel title={label} className="h-full">
      <div className="grid h-full place-items-center text-xs text-muted">
        {label}
      </div>
    </Panel>
  );
}

function seedFor(bounds: { columns: number; rows: number }): GridItem[] {
  return SEED.reduce<GridItem[]>((placed, entry) => {
    const clamped = clampItem(entry, bounds);
    const slot = findOpenSlot(placed, clamped, bounds);
    return slot ? [...placed, slot] : placed;
  }, []);
}

function Preview(c: Config) {
  const bounds = { columns: c.columns, rows: c.rows };
  const [layout, setLayout] = useState<GridItem[]>(() => seedFor(bounds));

  const hidden = CATALOGUE.filter(
    (entry) => !layout.some((item) => item.id === entry.id),
  );

  return (
    <div className="flex w-full flex-col gap-4">
      {c.editing && hidden.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          {hidden.map((entry) => {
            const candidate = { ...entry, x: 0, y: 0 };
            const room = findOpenSlot(layout, candidate, bounds) != null;
            return (
              <Button
                key={entry.id}
                variant="onSurface"
                disabled={!room}
                onClick={() => setLayout(addItem(layout, candidate, bounds))}
              >
                Add {entry.label}
              </Button>
            );
          })}
        </div>
      ) : null}

      <DashboardGrid
        columns={c.columns}
        rows={c.rows}
        rowHeight={c.rowHeight}
        gap={c.gap}
        layout={layout}
        onLayoutChange={setLayout}
        editing={c.editing}
      >
        {layout.map((item) => (
          <DashboardGridItem
            key={item.id}
            id={item.id}
            label={labelOf(item.id)}
          >
            <Widget label={labelOf(item.id)} />
          </DashboardGridItem>
        ))}
      </DashboardGrid>
    </div>
  );
}

const snippetFor = (c: Config): string => {
  const attrs = [
    c.columns !== 10 && `\n  columns={${c.columns}}`,
    c.rows !== 8 && `\n  rows={${c.rows}}`,
    c.rowHeight !== 72 && `\n  rowHeight={${c.rowHeight}}`,
    c.gap !== 16 && `\n  gap={${c.gap}}`,
    c.editing && `\n  editing`,
  ]
    .filter(Boolean)
    .join("");
  return `import { DashboardGrid, DashboardGridItem, type GridItem } from "@matt-pasek/usva";

const [layout, setLayout] = useState<GridItem[]>(seed);

<DashboardGrid${attrs}
  layout={layout}
  onLayoutChange={setLayout}
>
  {layout.map((item) => (
    <DashboardGridItem key={item.id} id={item.id} label={titles[item.id]}>
      <Panel title={titles[item.id]}>{/* widget */}</Panel>
    </DashboardGridItem>
  ))}
</DashboardGrid>`;
};

export function GridDemo() {
  return (
    <Playground<Config>
      templates={templates}
      fields={[
        {
          kind: "slider",
          key: "columns",
          label: "columns",
          sub: "grid width in cells",
          min: 6,
          max: 12,
          step: 1,
        },
        {
          kind: "slider",
          key: "rows",
          label: "rows",
          sub: "grid height in cells",
          min: 4,
          max: 10,
          step: 1,
        },
        {
          kind: "slider",
          key: "rowHeight",
          label: "rowHeight",
          sub: "pixels per row",
          min: 48,
          max: 112,
          step: 8,
        },
        {
          kind: "slider",
          key: "gap",
          label: "gap",
          sub: "gutter in pixels",
          min: 0,
          max: 32,
          step: 4,
        },
        {
          kind: "switch",
          key: "editing",
          label: "editing",
          sub: "drag, resize and remove; reveals the add tray",
        },
      ]}
      snippet={snippetFor}
      render={(c) => <Preview key={`${c.columns}x${c.rows}`} {...c} />}
    />
  );
}
