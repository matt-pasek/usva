import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";
import { SulaFabDemo } from "./sula-fab-demo";

export const metadata: Metadata = pageMetadata("/docs/components/sula-fab", {
  title: "Sula Fab",
  description:
    "Actions that emerge as liquid beads from a floating button, and pinch back on close.",
});

const props = [
  {
    name: "actions",
    type: "SulaFabAction[]",
    desc: (
      <>
        <code>{"{ icon, label, onClick?, href? }"}</code> each. beads are
        icon-only; the label is the accessible name and the tooltip.
      </>
    ),
  },
  {
    name: "icon",
    type: "ReactNode",
    defaultValue: "a plus",
    desc: "the trigger glyph.",
  },
  {
    name: "label",
    type: "string",
    defaultValue: '"Actions"',
    desc: "the trigger's accessible name.",
  },
  {
    name: "open / defaultOpen",
    type: "boolean",
    defaultValue: "false",
    desc: "controlled and uncontrolled open state.",
  },
  {
    name: "onOpenChange",
    type: "(open: boolean) => void",
    desc: "fires on toggle, Escape, or an action.",
  },
  {
    name: "layout",
    type: '"line" | "arc"',
    defaultValue: '"line"',
    desc: "line stacks the beads along direction; arc fans them upward.",
  },
  {
    name: "direction",
    type: '"up" | "down" | "left" | "right"',
    defaultValue: '"up"',
    desc: "which way a line layout opens.",
  },
  {
    name: "tooltipPosition",
    type: '"left" | "right" | "top"',
    desc: "where action tooltips sit. left for line, top for arc.",
  },
  {
    name: "gap",
    type: "number",
    defaultValue: "12",
    desc: "constant edge gap in px between trigger and beads. raise it for touch.",
  },
  {
    name: "fluid",
    type: "boolean",
    defaultValue: "true",
    desc: "false renders a plain stacked menu and mounts no canvas.",
  },
  {
    name: "backdrop / tint / accentColor",
    type: "string",
    desc: "the glass palette. default to the bg, surface-2 and accent tokens.",
  },
  {
    name: "shine",
    type: "number",
    defaultValue: "per backdrop",
    desc: "0 is flat matte glass, 1 is the full neon rim.",
  },
];

export default function SulaFabPage() {
  return (
    <ComponentDoc
      slug="sula-fab"
      client
      description={
        <>
          a speed dial whose actions are liquid beads: each necks off the
          trigger, travels to its slot on a thinning thread, and settles. it
          collapses to a plain stacked menu under reduced motion.
        </>
      }
      composition={{
        ok: [
          "the page's one primary action with a few close relatives",
          "actions with href render as real anchors when the action navigates",
        ],
        no: [
          "not for toolbars or a dozen commands. a plain menu reads faster",
          "one sula per region. it never shares a corner with SulaNav",
        ],
      }}
      a11y={
        <>
          the trigger carries{" "}
          <code className="font-mono text-xs">aria-expanded</code> and{" "}
          <code className="font-mono text-xs">aria-haspopup</code> · closed
          actions are <code className="font-mono text-xs">inert</code> · open
          focuses the first action, Escape returns focus to the trigger
        </>
      }
      dependencies={
        <>
          <code className="font-mono text-xs">motion</code> ·{" "}
          <code className="font-mono text-xs">ogl</code> · sula-core and
          sula-motion <span className="text-muted">from the same package</span>
        </>
      }
    >
      <SulaFabDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="sula-fab"
        usage={`import { SulaFab } from "@usva-ui/react/sula/sula-fab";

<SulaFab
  label="Create"
  actions={[
    { icon: <PlusIcon />, label: "New note", onClick: newNote },
    { icon: <MailIcon />, label: "Message", href: "/compose" },
  ]}
/>`}
      />
    </ComponentDoc>
  );
}
