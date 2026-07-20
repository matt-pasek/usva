import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { DrawerDemo } from "./drawer-demo";

export const metadata: Metadata = {
  title: "Drawer",
  description:
    "An edge-anchored modal panel built on Base UI Dialog, with focus trap, scroll lock and Escape handled for you.",
};

const props = [
  {
    name: "side",
    type: '"top" | "right" | "bottom" | "left"',
    defaultValue: '"right"',
    desc: "which edge the panel is pinned to.",
  },
  {
    name: "size",
    type: '"sm" | "md" | "lg"',
    defaultValue: '"md"',
    desc: "inline size on the vertical edges, block size on the horizontal ones.",
  },
  {
    name: "surface",
    type: '"elevated" | "flat" | "glass"',
    defaultValue: '"elevated"',
    desc: "how the panel sits above the scrim. shared with Card and Dialog.",
  },
  {
    name: "highlight",
    type: '"none" | "wash" | "edge" | "ring"',
    defaultValue: '"none"',
    desc: "accent treatment on Drawer.Content: a wash, a top edge hairline, or a glow ring. the same vocabulary as Card and Dialog.",
  },
  {
    name: "backdropClassName",
    type: "string",
    desc: "extra classes on the scrim, on Drawer.Content.",
  },
];

export default function DrawerPage() {
  return (
    <ComponentDoc
      slug="drawer"
      client
      description={
        <>
          the same anatomy as Dialog, pinned to an edge instead of centered. a
          panel slides in from any side; a bottom sheet is just side=&quot;bottom&quot;.
        </>
      }
      composition={{
        ok: [
          "settings panels, widget libraries, filters that keep the page visible behind the scrim",
          'the slide-up sheet is this primitive with side="bottom"',
        ],
        no: [
          "not navigation chrome. a persistent sidebar is layout, not a Drawer",
          "never two edges open at once",
        ],
      }}
      a11y={
        <>
          <code className="font-mono text-xs">role="dialog"</code> named by its
          Title · focus is trapped, Escape closes · Drawer.Close keeps a 44px
          minimum target
        </>
      }
      dependencies={
        <>
          <code className="font-mono text-xs">@base-ui/react</code> · Card{" "}
          <span className="text-muted">from the same package</span>
        </>
      }
    >
      <DrawerDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="drawer"
        usage={`import { Drawer, Button } from "@matt-pasek/usva";

<Drawer>
  <Drawer.Trigger render={<Button>Edit layout</Button>} />
  <Drawer.Content side="right" size="md">
    <Drawer.Title>Widget library</Drawer.Title>
    <Drawer.Description>Drag a widget onto the grid.</Drawer.Description>
    <Drawer.Close render={<Button variant="ghost">Done</Button>} />
  </Drawer.Content>
</Drawer>`}
      />
    </ComponentDoc>
  );
}
