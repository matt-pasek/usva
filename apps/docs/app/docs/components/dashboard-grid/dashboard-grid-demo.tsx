"use client";
import {
  addItem,
  Button,
  DashboardGrid,
  DashboardGridItem,
  findOpenSlot,
  type GridItem,
  Panel,
} from "@matt-pasek/usva";
import { useState } from "react";

const BOUNDS = { columns: 10, rows: 6 };

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

export function GridDemo() {
  const [layout, setLayout] = useState<GridItem[]>(SEED);
  const [editing, setEditing] = useState(false);

  const hidden = CATALOGUE.filter(
    (entry) => !layout.some((item) => item.id === entry.id),
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant={editing ? "solid" : "onSurface"}
          onClick={() => setEditing((current) => !current)}
        >
          {editing ? "Done" : "Customize"}
        </Button>
        {editing &&
          hidden.map((entry) => {
            const candidate = { ...entry, x: 0, y: 0 };
            const room = findOpenSlot(layout, candidate, BOUNDS) != null;
            return (
              <Button
                key={entry.id}
                variant="onSurface"
                disabled={!room}
                onClick={() => setLayout(addItem(layout, candidate, BOUNDS))}
              >
                Add {entry.label}
              </Button>
            );
          })}
      </div>

      <DashboardGrid
        columns={BOUNDS.columns}
        rows={BOUNDS.rows}
        layout={layout}
        onLayoutChange={setLayout}
        editing={editing}
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
