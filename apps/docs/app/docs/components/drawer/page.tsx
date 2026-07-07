import { Card, CardBody, CardHeader } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";
import { BottomSheetDemo, DrawerDemo } from "./drawer-demo";

export const metadata: Metadata = {
  title: "Drawer",
  description:
    "An edge-anchored modal panel built on Base UI Dialog, with focus trap, scroll lock and Escape handled for you.",
};

const props = [
  {
    name: "side",
    type: '"top" | "right" | "bottom" | "left"',
    desc: "Which edge the panel is pinned to. Defaults to right.",
  },
  {
    name: "size",
    type: '"sm" | "md" | "lg"',
    desc: "Inline size on the vertical edges, block size on the horizontal ones.",
  },
  {
    name: "surface",
    type: '"elevated" | "flat" | "glass"',
    desc: "How the panel sits above the scrim. Shared with Card and Dialog.",
  },
];

const usage = `import { Drawer, Button } from "@matt-pasek/usva";

<Drawer>
  <Drawer.Trigger render={<Button>Edit layout</Button>} />
  <Drawer.Content side="right" size="md">
    <Drawer.Title>Widget library</Drawer.Title>
    <Drawer.Description>Drag a widget onto the grid.</Drawer.Description>
    <Drawer.Close render={<Button variant="ghost">Done</Button>} />
  </Drawer.Content>
</Drawer>`;

export default function DrawerPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Drawer</h1>
        <p className="text-muted">
          The same anatomy as <code>Dialog</code>, anchored to an edge. Base UI
          supplies the focus trap, the scroll lock, Escape and the portal; usva
          adds the edge anchoring and a CSS slide. A bottom sheet is just{" "}
          <code>side=&quot;bottom&quot;</code>.
        </p>
      </div>

      <Card>
        <CardHeader>Every edge</CardHeader>
        <CardBody>
          <div className="flex flex-wrap gap-2">
            <DrawerDemo side="left" />
            <DrawerDemo side="right" />
            <DrawerDemo side="top" />
            <DrawerDemo side="bottom" />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Slide-up sheet</CardHeader>
        <CardBody>
          <BottomSheetDemo />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody>
          <InstallBlock registryName="drawer" />
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
        <CardBody>
          <SourceView filePath="packages/usva/src/primitives/drawer/drawer.tsx" />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Props</CardHeader>
        <CardBody>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-muted">
                  <th className="py-2 pr-4 font-medium">Prop</th>
                  <th className="py-2 pr-4 font-medium">Type</th>
                  <th className="py-2 font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                {props.map((p) => (
                  <tr key={p.name} className="border-b border-border/50">
                    <td className="py-2 pr-4 font-mono text-xs text-ink">
                      {p.name}
                    </td>
                    <td className="py-2 pr-4 font-mono text-xs text-muted">
                      {p.type}
                    </td>
                    <td className="py-2 text-muted">{p.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </main>
  );
}
