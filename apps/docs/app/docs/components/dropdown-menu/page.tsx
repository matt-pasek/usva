import { Card, CardBody, CardHeader } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";
import { DropdownMenuDemo } from "./dropdown-menu-demo";

export const metadata: Metadata = {
  title: "Dropdown Menu",
  description:
    "An accessible dropdown menu primitive with trigger, portal-positioned menu, and roving-focus items, built on Base UI Menu.",
};

const props = [
  { name: "open", type: "boolean", desc: "Controlled open state." },
  {
    name: "defaultOpen",
    type: "boolean",
    desc: "Initial open state (uncontrolled).",
  },
  {
    name: "onOpenChange",
    type: "(open, eventDetails) => void",
    desc: "Fires when the menu opens or closes.",
  },
];

const itemProps = [
  {
    name: "onSelect",
    type: "(event) => void",
    desc: "Fires when the item is selected (click or Enter/Space).",
  },
  { name: "disabled", type: "boolean", desc: "Disables the item." },
];

const usageSnippet = `import { DropdownMenu } from "@matt-pasek/usva";

<DropdownMenu>
  <DropdownMenu.Trigger>Open menu</DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Label>Actions</DropdownMenu.Label>
    <DropdownMenu.Item onSelect={() => console.log("edit")}>
      Edit
    </DropdownMenu.Item>
    <DropdownMenu.Separator />
    <DropdownMenu.Item disabled>Delete</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu>`;

export default function DropdownMenuPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Dropdown Menu</h1>
        <p className="text-muted">
          Built on Base UI <code>Menu</code>, with a portal-positioned menu,
          roving keyboard focus, and dotted compound composition (
          <code>DropdownMenu.Trigger</code>, <code>DropdownMenu.Content</code>
          , <code>DropdownMenu.Item</code>).
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody>
          <DropdownMenuDemo />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody>
          <InstallBlock registryName="dropdown-menu" />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Usage</CardHeader>
        <CardBody>
          <pre className="overflow-x-auto rounded-md border border-border bg-surface-2 p-3 text-xs text-ink">
            <code>{usageSnippet}</code>
          </pre>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Source</CardHeader>
        <CardBody>
          <SourceView filePath="packages/usva/src/primitives/dropdown-menu/dropdown-menu.tsx" />
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

      <Card>
        <CardHeader>Item props</CardHeader>
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
                {itemProps.map((p) => (
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
