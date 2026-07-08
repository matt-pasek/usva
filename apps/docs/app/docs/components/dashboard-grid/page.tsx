import { Card, CardBody, CardHeader } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";
import { GridDemo } from "./dashboard-grid-demo";

export const metadata: Metadata = {
  title: "Dashboard Grid",
  description:
    "A draggable, resizable widget grid. Pointer and keyboard, with collision rules you can call yourself.",
};

const gridProps = [
  {
    name: "layout",
    type: "GridItem[]",
    desc: "Controlled. Each entry is { id, x, y, w, h, minW?, minH?, maxW?, maxH? }.",
  },
  {
    name: "onLayoutChange",
    type: "(layout: GridItem[]) => void",
    desc: "Fires only when a move or resize is accepted. A refused one never calls it.",
  },
  { name: "columns", type: "number", desc: "Defaults to 10." },
  { name: "rows", type: "number", desc: "Defaults to 8." },
  {
    name: "rowHeight",
    type: "number",
    desc: "Pixels. Rows never grow to fit their content. Defaults to 72.",
  },
  { name: "gap", type: "number", desc: "Gutter in pixels. Defaults to 16." },
  {
    name: "editing",
    type: "boolean",
    desc: "Drag, resize and remove only exist while this is true.",
  },
  {
    name: "keyboardInstructions",
    type: "string",
    desc: "Read to a screen reader when a widget is focused for dragging.",
  },
];

const itemProps = [
  {
    name: "id",
    type: "string",
    desc: "Must match a layout entry. An item with no entry renders nothing.",
  },
  {
    name: "label",
    type: "string",
    desc: "Names the widget in every control's label and in the live region.",
  },
  {
    name: "removable",
    type: "boolean",
    desc: "Set false to hide the remove button for a widget that must stay.",
  },
];

const helpers = [
  {
    name: "canPlace",
    type: "(layout, item, bounds) => boolean",
    desc: "Whether an item fits, ignoring the entry it came from.",
  },
  {
    name: "findOpenSlot",
    type: "(layout, item, bounds) => GridItem | null",
    desc: "First free position, scanning rows before columns. null when nothing fits.",
  },
  {
    name: "addItem",
    type: "(layout, item, bounds) => GridItem[]",
    desc: "findOpenSlot then append. Returns the same array when there is no room.",
  },
  {
    name: "removeItem",
    type: "(layout, id) => GridItem[]",
    desc: "Filter by id.",
  },
  {
    name: "clampItem",
    type: "(item, bounds) => GridItem",
    desc: "Squeezes an item inside the grid and inside its own min and max.",
  },
];

const usage = `import {
  addItem,
  DashboardGrid,
  DashboardGridItem,
  findOpenSlot,
  type GridItem,
} from "@matt-pasek/usva";

const [layout, setLayout] = useState<GridItem[]>([
  { id: "trajectory", x: 0, y: 0, w: 4, h: 3, minW: 3 },
  { id: "upcoming",   x: 4, y: 0, w: 3, h: 3 },
]);

<DashboardGrid layout={layout} onLayoutChange={setLayout} editing={editing}>
  {layout.map((item) => (
    <DashboardGridItem key={item.id} id={item.id} label={titles[item.id]}>
      <Panel title={titles[item.id]}>{/* widget */}</Panel>
    </DashboardGridItem>
  ))}
</DashboardGrid>`;

function PropsTable({
  rows,
  first,
}: {
  rows: { name: string; type: string; desc: string }[];
  first: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border text-muted">
            <th className="py-2 pr-4 font-medium">{first}</th>
            <th className="py-2 pr-4 font-medium">Type</th>
            <th className="py-2 font-medium">Description</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <tr key={p.name} className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-xs text-ink">{p.name}</td>
              <td className="py-2 pr-4 font-mono text-xs text-muted">
                {p.type}
              </td>
              <td className="py-2 text-muted">{p.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function DashboardGridPage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Dashboard Grid</h1>
        <p className="text-muted">
          A widget board the user arranges. Drag to move, drag an edge to
          resize, and nothing may overlap. Works with a mouse and with a
          keyboard.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody className="bg-bg">
          <GridDemo />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>It works from the keyboard</CardHeader>
        <CardBody>
          <p className="text-sm text-muted">
            Tab to a widget's grip, press space to lift it, move it a cell at a
            time with the arrow keys, then space to drop or escape to cancel.
            The three resize handles take arrow keys directly, each on its own
            axis, so you can widen a widget without also making it taller. Every
            accepted move and every refusal is announced in a polite live
            region.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>The layout is yours</CardHeader>
        <CardBody>
          <p className="text-sm text-muted">
            <code>layout</code> is controlled and <code>onLayoutChange</code>{" "}
            only fires when a move is legal, so there is nothing to undo and
            nothing to reconcile. Persist the array wherever you like. The same
            collision rules the grid enforces are exported as plain functions,
            so a "add a widget" tray is <code>findOpenSlot</code> for the
            enabled state and <code>addItem</code> for the click.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>What it does not do</CardHeader>
        <CardBody>
          <p className="text-sm text-muted">
            No compaction. A widget you drag away leaves a hole, and the ones
            below it stay put. That is a deliberate choice: on a board the user
            arranged by hand, rows that reflow underneath a drag are the thing
            that makes these grids feel possessed.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody>
          <InstallBlock registryName="dashboard-grid" />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Usage</CardHeader>
        <CardBody>
          <pre className="overflow-x-auto rounded-md border border-border bg-sunken p-3 text-xs text-on-sunken">
            <code>{usage}</code>
          </pre>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Source</CardHeader>
        <CardBody className="flex flex-col gap-4">
          <SourceView filePath="packages/usva/src/patterns/dashboard-grid/dashboard-grid.tsx" />
          <SourceView filePath="packages/usva/src/patterns/dashboard-grid/grid-layout.ts" />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>DashboardGrid props</CardHeader>
        <CardBody>
          <PropsTable rows={gridProps} first="Prop" />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>DashboardGridItem props</CardHeader>
        <CardBody>
          <PropsTable rows={itemProps} first="Prop" />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Layout helpers</CardHeader>
        <CardBody>
          <PropsTable rows={helpers} first="Function" />
        </CardBody>
      </Card>
    </main>
  );
}
