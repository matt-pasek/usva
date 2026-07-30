import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";
import { DropdownMenuDemo } from "./dropdown-menu-demo";

export const metadata: Metadata = pageMetadata(
  "/docs/components/dropdown-menu",
  {
    title: "Dropdown Menu",
    description:
      "Actions anchored to what triggered them, with roving focus and portal positioning. Actions, not navigation.",
  },
);

const props = [
  {
    name: "open",
    type: "boolean",
    desc: "controlled open state.",
  },
  {
    name: "defaultOpen",
    type: "boolean",
    defaultValue: "false",
    desc: "initial open state when uncontrolled.",
  },
  {
    name: "onOpenChange",
    type: "(open, details) => void",
    desc: "fires when the menu opens or closes.",
  },
  {
    name: "Content sideOffset",
    type: "number",
    defaultValue: "6",
    desc: "gap between the trigger and the panel.",
  },
  {
    name: "Item onSelect",
    type: "(event) => void",
    desc: "fires when the item is picked, by click or Enter.",
  },
  {
    name: "Item disabled",
    type: "boolean",
    defaultValue: "false",
    desc: "dims the item and blocks selection.",
  },
];

export default function DropdownMenuPage() {
  return (
    <ComponentDoc
      slug="dropdown-menu"
      client
      description={
        <>
          a list of actions anchored to whatever triggered them. it portals
          above everything and hands the arrow keys the list.{" "}
          <b>actions, not navigation</b>.
        </>
      }
      composition={{
        ok: [
          "hangs off an icon Button in a Toolbar, a table row's overflow, a card corner",
          "Separator groups items, Label names a group",
        ],
        no: [
          "navigation goes in a link, never in a menu item",
          "no inputs or forms inside. that is a Popover",
        ],
      }}
      a11y={
        <>
          menu semantics from Base UI · arrow keys rove, Enter selects, Escape
          closes · disabled items carry{" "}
          <code className="font-mono text-xs">data-disabled</code>
        </>
      }
      dependencies={<code className="font-mono text-xs">@base-ui/react</code>}
    >
      <DropdownMenuDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="dropdown-menu"
        usage={`import { DropdownMenu } from "@usva-ui/react/primitives/dropdown-menu";

<DropdownMenu>
  <DropdownMenu.Trigger>Open menu</DropdownMenu.Trigger>
  <DropdownMenu.Content>
    <DropdownMenu.Item onSelect={handleEdit}>Edit</DropdownMenu.Item>
    <DropdownMenu.Separator />
    <DropdownMenu.Item disabled>Delete</DropdownMenu.Item>
  </DropdownMenu.Content>
</DropdownMenu>`}
      />
    </ComponentDoc>
  );
}
