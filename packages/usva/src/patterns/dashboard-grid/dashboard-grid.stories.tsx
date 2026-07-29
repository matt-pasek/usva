import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { themeAndWidthModes } from "../../../.storybook/modes.js";
import { Button } from "../../primitives/button/index.js";
import { Panel } from "../panel/index.js";
import { DashboardGrid, DashboardGridItem } from "./dashboard-grid.js";
import { addItem, findOpenSlot, type GridItem } from "./grid-layout.js";

const meta: Meta<typeof DashboardGrid> = {
  parameters: {
    chromatic: { modes: themeAndWidthModes },
  },
  title: "Patterns/DashboardGrid",
  component: DashboardGrid,
  tags: ["autodocs"],
  argTypes: {
    editing: { control: { type: "boolean" } },
    columns: { control: { type: "number" } },
    rows: { control: { type: "number" } },
    rowHeight: { control: { type: "number" } },
    gap: { control: { type: "number" } },
  },
};
export default meta;

type Story = StoryObj<typeof DashboardGrid>;

const CATALOGUE = [
  { id: "trajectory", label: "Credit trajectory", w: 4, h: 3, minW: 3 },
  { id: "upcoming", label: "Upcoming deadlines", w: 3, h: 3, minW: 2 },
  { id: "grades", label: "Grade trend", w: 3, h: 3, minW: 2 },
  { id: "timeline", label: "Timeline", w: 6, h: 2, minW: 4 },
  { id: "registration", label: "Registration", w: 4, h: 2 },
] as const;

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
      <div className="grid h-full place-items-center text-sm text-muted">
        {label}
      </div>
    </Panel>
  );
}

function Editable({ startEditing = true }: { startEditing?: boolean }) {
  const [layout, setLayout] = useState<GridItem[]>(SEED);
  const [editing, setEditing] = useState(startEditing);
  const bounds = { columns: 10, rows: 8 };

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

      <DashboardGrid
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

export const Editing: Story = {
  render: () => <Editable />,
};

export const AtRest: Story = {
  render: () => <Editable startEditing={false} />,
};

export const TightGrid: Story = {
  render: () => {
    const [layout, setLayout] = useState<GridItem[]>([
      { id: "a", x: 0, y: 0, w: 2, h: 2 },
      { id: "b", x: 2, y: 0, w: 2, h: 2 },
      { id: "c", x: 0, y: 2, w: 4, h: 2 },
    ]);
    return (
      <DashboardGrid
        editing
        columns={4}
        rows={4}
        layout={layout}
        onLayoutChange={setLayout}
      >
        {layout.map((item) => (
          <DashboardGridItem key={item.id} id={item.id} label={item.id}>
            <Widget label={item.id} />
          </DashboardGridItem>
        ))}
      </DashboardGrid>
    );
  },
};
