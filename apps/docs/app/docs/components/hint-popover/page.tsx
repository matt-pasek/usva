import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";
import { HintPopoverDemo } from "./hint-popover-demo";

export const metadata: Metadata = pageMetadata(
  "/docs/components/hint-popover",
  {
    title: "Hint Popover",
    description:
      "The explanation a tooltip cannot hold, because this one has a button you can actually click.",
  },
);

const props = [
  {
    name: "trigger",
    type: "ReactNode",
    desc: "the element the hint hangs off.",
  },
  {
    name: "title",
    type: "ReactNode",
    desc: "bold first line.",
  },
  {
    name: "icon",
    type: "ReactNode",
    desc: "glyph beside the text, tinted by tone.",
  },
  {
    name: "action",
    type: "ReactNode",
    desc: "interactive footer, typically a dismiss Button.",
  },
  {
    name: "tone",
    type: '"neutral" | "accent" | "success" | "warning" | "danger" | "info"',
    defaultValue: '"neutral"',
    desc: "tints the panel and the icon.",
  },
  {
    name: "side",
    type: '"top" | "right" | "bottom" | "left"',
    defaultValue: '"top"',
    desc: "which edge of the trigger the panel hangs off.",
  },
  {
    name: "openDelay",
    type: "number",
    defaultValue: "120",
    desc: "hover dwell before opening. guards against drive-by pointers.",
  },
  {
    name: "closeDelay",
    type: "number",
    defaultValue: "200",
    desc: "grace period after the pointer leaves, so it can cross the 8px gap into the panel without the action becoming unclickable.",
  },
];

export default function HintPopoverPage() {
  return (
    <ComponentDoc
      slug="hint-popover"
      client
      description={
        <>
          a hint that appears on hover, like a tooltip, but with something to
          click inside it: a dismiss, a read more, a next step. the one you
          reach for when a plain label is not quite enough. touch opens it on
          press.
        </>
      }
      composition={{
        ok: [
          "hangs off a Badge, a stat, a ghost Button that asks a question",
          "action holds one small dismiss or follow-up Button",
        ],
        no: [
          "plain text with nothing to click belongs in a Tooltip",
          "no forms or multi-step content. that is a Popover or Dialog",
        ],
      }}
      a11y={
        <>
          opens on keyboard focus, not just hover · panel content is reachable ·
          Escape dismisses and stays dismissed until focus genuinely leaves
        </>
      }
      dependencies={<code className="font-mono text-xs">@base-ui/react</code>}
    >
      <HintPopoverDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="hint-popover"
        usage={`import { Badge, Button, HintPopover } from "@matt-pasek/usva";

<HintPopover
  tone="warning"
  title="Prerequisite not met"
  trigger={<Badge tone="warning">2 warnings</Badge>}
  action={<Button size="sm" variant="ghost">Dismiss</Button>}
>
  MATH-201 must be completed before MATH-305.
</HintPopover>`}
      />
    </ComponentDoc>
  );
}
