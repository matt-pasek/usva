import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";
import { GridDemo } from "./dashboard-grid-demo";

export const metadata: Metadata = pageMetadata(
  "/docs/components/dashboard-grid",
  {
    title: "Dashboard Grid",
    description:
      "Drag to move, drag an edge to resize, keyboard included. Widgets the user arranges, and nothing overlaps.",
  },
);

const gridProps = [
  {
    name: "layout",
    type: "GridItem[]",
    desc: (
      <>
        controlled. each entry is{" "}
        <code>{"{ id, x, y, w, h, minW?, minH?, maxW?, maxH? }"}</code>.
      </>
    ),
  },
  {
    name: "onLayoutChange",
    type: "(layout: GridItem[]) => void",
    desc: "fires only when a move or resize is accepted. a refused one never calls it.",
  },
  {
    name: "columns",
    type: "number",
    defaultValue: "10",
    desc: "grid width in cells.",
  },
  {
    name: "rows",
    type: "number",
    defaultValue: "8",
    desc: "grid height in cells.",
  },
  {
    name: "rowHeight",
    type: "number",
    defaultValue: "72",
    desc: "pixels. rows never grow to fit their content.",
  },
  {
    name: "gap",
    type: "number",
    defaultValue: "16",
    desc: "gutter in pixels.",
  },
  {
    name: "editing",
    type: "boolean",
    defaultValue: "false",
    desc: "drag, resize and remove only exist while this is true.",
  },
  {
    name: "keyboardInstructions",
    type: "string",
    desc: "read to a screen reader when a widget is focused for dragging.",
  },
];

const itemProps = [
  {
    name: "id",
    type: "string",
    desc: "must match a layout entry. an item with no entry renders nothing.",
  },
  {
    name: "label",
    type: "string",
    desc: "names the widget in every control's label and in the live region.",
  },
  {
    name: "removable",
    type: "boolean",
    defaultValue: "true",
    desc: "set false to hide the remove button for a widget that must stay.",
  },
];

const helpers = [
  {
    name: "canPlace",
    type: "(layout, item, bounds) => boolean",
    desc: "whether an item fits, ignoring the entry it came from.",
  },
  {
    name: "findOpenSlot",
    type: "(layout, item, bounds) => GridItem | null",
    desc: "first free position, scanning rows before columns. null when nothing fits.",
  },
  {
    name: "addItem",
    type: "(layout, item, bounds) => GridItem[]",
    desc: "findOpenSlot then append. returns the same array when there is no room.",
  },
  {
    name: "removeItem",
    type: "(layout, id) => GridItem[]",
    desc: "filter by id.",
  },
  {
    name: "clampItem",
    type: "(item, bounds) => GridItem",
    desc: "squeezes an item inside the grid and inside its own min and max.",
  },
];

export default function DashboardGridPage() {
  return (
    <ComponentDoc
      slug="dashboard-grid"
      client
      description={
        <>
          a widget board the user arranges: drag to move, drag an edge to
          resize. widgets never overlap, and one dragged away leaves its hole
          rather than shuffling the rest around.
        </>
      }
      composition={{
        ok: [
          "each widget wraps a Panel or Card. the grid supplies position only",
          "the exported layout helpers drive an add-widget tray outside the grid",
        ],
        no: [
          "not for content that must grow. rowHeight is fixed",
          "no nesting a grid inside a grid item",
        ],
      }}
      a11y={
        <>
          space lifts a focused widget, arrows move it a cell, escape cancels ·
          every accepted move, resize and refusal lands in a{" "}
          <code className="font-mono text-xs">polite</code> live region · each
          control is named by its widget's label
        </>
      }
      dependencies={<code className="font-mono text-xs">@dnd-kit/core</code>}
    >
      <GridDemo />

      <PropsTable title="DashboardGrid" rows={gridProps} />
      <PropsTable title="DashboardGridItem" rows={itemProps} />
      <PropsTable title="layout helpers" rows={helpers} />

      <AcquireSection
        registryName="dashboard-grid"
        usage={`import { DashboardGrid, DashboardGridItem, type GridItem } from "@matt-pasek/usva/patterns/dashboard-grid";

const [layout, setLayout] = useState<GridItem[]>([
  { id: "trajectory", x: 0, y: 0, w: 4, h: 3, minW: 3 },
  { id: "upcoming", x: 4, y: 0, w: 3, h: 3 },
]);

<DashboardGrid layout={layout} onLayoutChange={setLayout} editing={editing}>
  {layout.map((item) => (
    <DashboardGridItem key={item.id} id={item.id} label={titles[item.id]}>
      <Panel title={titles[item.id]}>{/* widget */}</Panel>
    </DashboardGridItem>
  ))}
</DashboardGrid>`}
      />
    </ComponentDoc>
  );
}
