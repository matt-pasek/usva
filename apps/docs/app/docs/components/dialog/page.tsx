import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";
import { DialogDemo } from "./dialog-demo";

export const metadata: Metadata = pageMetadata("/docs/components/dialog", {
  title: "Dialog",
  description:
    "Interrupts, on purpose. Focus trapped, scroll locked, Escape closes, on Base UI Dialog.",
});

const props = [
  {
    name: "open",
    type: "boolean",
    desc: "controlled open state, on the root.",
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
    desc: "fires when the open state changes.",
  },
  {
    name: "modal",
    type: 'boolean | "trap-focus"',
    defaultValue: "true",
    desc: "focus trap, scroll lock and outside-pointer behavior in one switch.",
  },
  {
    name: "surface",
    type: '"elevated" | "flat" | "glass"',
    defaultValue: '"elevated"',
    desc: "how Dialog.Content sits above the scrim. shared with Card and Drawer.",
  },
  {
    name: "highlight",
    type: '"none" | "wash" | "edge" | "ring"',
    defaultValue: '"none"',
    desc: "accent treatment on Dialog.Content: a radial wash, a top edge hairline, or a glow ring. the same vocabulary as Card.",
  },
  {
    name: "backdropClassName",
    type: "string",
    desc: "extra classes on the scrim, on Dialog.Content.",
  },
];

export default function DialogPage() {
  return (
    <ComponentDoc
      slug="dialog"
      client
      description={
        <>
          a window that stops the page until you answer it. for confirmations,
          short forms, and the last word before something destructive happens.
        </>
      }
      composition={{
        ok: [
          "confirmations and short forms that block the page until answered",
          "destructive actions pass through it before anything is destroyed",
        ],
        no: [
          "not for content that scrolls or pins to an edge. that is Drawer",
          "never stack two. a second dialog means the first asked too much",
        ],
      }}
      a11y={
        <>
          <code className="font-mono text-xs">role="dialog"</code> named by its
          Title, or <code className="font-mono text-xs">aria-label</code>{" "}
          without one · focus moves in on open, Escape closes
        </>
      }
      dependencies={
        <>
          <code className="font-mono text-xs">@base-ui/react</code> · Card{" "}
          <span className="text-muted">from the same package</span>
        </>
      }
    >
      <DialogDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="dialog"
        usage={`import { Dialog } from "@usva-ui/react/primitives/dialog";

<Dialog>
  <Dialog.Trigger>Open</Dialog.Trigger>
  <Dialog.Content>
    <Dialog.Title>Confirm action</Dialog.Title>
    <Dialog.Description>This can't be undone.</Dialog.Description>
    <Dialog.Close>Cancel</Dialog.Close>
  </Dialog.Content>
</Dialog>`}
      />
    </ComponentDoc>
  );
}
