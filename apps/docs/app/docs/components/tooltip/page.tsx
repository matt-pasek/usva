import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { TooltipDemo } from "./tooltip-demo";

export const metadata: Metadata = {
  title: "Tooltip",
  description:
    "Names an unlabelled control on hover or focus. It holds no action, and never the only copy of the truth.",
};

const props = [
  {
    name: "delay",
    type: "number",
    desc: "hover delay in ms before opening. set on TooltipProvider, shared by every tooltip under it.",
  },
  {
    name: "defaultOpen",
    type: "boolean",
    desc: "open on mount, uncontrolled.",
  },
  {
    name: "open",
    type: "boolean",
    desc: "controlled open state.",
  },
  {
    name: "onOpenChange",
    type: "(open: boolean) => void",
    desc: "fires when the open state changes.",
  },
  {
    name: "sideOffset",
    type: "number",
    defaultValue: "6",
    desc: "distance in px between trigger and content, on TooltipContent.",
  },
];

export default function TooltipPage() {
  return (
    <ComponentDoc
      slug="tooltip"
      client
      description={
        <>
          a short label that surfaces on hover or focus and says what a thing
          is: the name of an icon button, a keyboard shortcut, a word too
          clipped to read. never more than you can take in at a glance.
        </>
      }
      composition={{
        ok: [
          "icon-only buttons, truncated text, terse toolbar actions",
          "the trigger's render prop puts it on an existing element instead of nesting a second button",
        ],
        no: [
          "no interactive content inside. that is a Popover",
          "never the only place information lives. it is a hint, not the label",
        ],
      }}
      a11y={
        <>
          opens on focus as well as hover · content is portalled with{" "}
          <code className="font-mono text-xs">role="tooltip"</code> and wired to
          the trigger via{" "}
          <code className="font-mono text-xs">aria-describedby</code> · escape
          dismisses · exit animation honors{" "}
          <code className="font-mono text-xs">motion-reduce</code>
        </>
      }
      dependencies={<code className="font-mono text-xs">@base-ui/react</code>}
    >
      <TooltipDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="tooltip"
        usage={`import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@matt-pasek/usva";

<TooltipProvider>
  <Tooltip>
    <TooltipTrigger render={<button>Hover me</button>} />
    <TooltipContent>Helpful hint</TooltipContent>
  </Tooltip>
</TooltipProvider>`}
      />
    </ComponentDoc>
  );
}
