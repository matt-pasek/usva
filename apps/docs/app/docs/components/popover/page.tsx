import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { PopoverDemo } from "./popover-demo";

export const metadata: Metadata = {
  title: "Popover",
  description:
    "Rich content anchored to a trigger, clickable, with the page still live behind it.",
};

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
    type: "(open, eventDetails) => void",
    desc: "fires with the new open state first.",
  },
  {
    name: "side",
    type: '"top" | "right" | "bottom" | "left"',
    desc: "preferred side of the trigger, on Content.",
  },
  {
    name: "align",
    type: '"start" | "center" | "end"',
    desc: "alignment along the chosen side, on Content.",
  },
  {
    name: "sideOffset",
    type: "number",
    defaultValue: "8",
    desc: "distance in pixels from the trigger, on Content.",
  },
];

export default function PopoverPage() {
  return (
    <ComponentDoc
      slug="popover"
      client
      description={
        <>
          a small panel you click open, anchored to whatever you clicked. the
          page stays live behind it, so it is for the extras you reach for on
          purpose: a filter set, a menu of actions, a compact form.
        </>
      }
      composition={{
        ok: [
          "small anchored panels: notifications, filters, a compact form",
          "Title + Description inside Content give it an accessible name",
        ],
        no: [
          "not modal. anything that must block the page is a Dialog",
          "not a tooltip. plain hover labels stay Tooltip",
        ],
      }}
      a11y={
        <>
          opens on click, closes on click-outside and{" "}
          <code className="font-mono text-xs">Escape</code> · Title and
          Description wire the popup's name and description
        </>
      }
      dependencies={<code className="font-mono text-xs">@base-ui/react</code>}
    >
      <PopoverDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="popover"
        usage={`import { Popover } from "@matt-pasek/usva";

<Popover>
  <Popover.Trigger>Open</Popover.Trigger>
  <Popover.Content side="bottom">
    <Popover.Title>Notifications</Popover.Title>
    <Popover.Description>You have no new notifications.</Popover.Description>
  </Popover.Content>
</Popover>`}
      />
    </ComponentDoc>
  );
}
