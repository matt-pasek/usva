import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";
import { SulaFrameDemo } from "./sula-frame-demo";

export const metadata: Metadata = pageMetadata("/docs/components/sula-frame", {
  title: "Sula Frame",
  description:
    "Hugs a card, or the whole viewport, with a liquid border that leans toward your cursor.",
});

const props = [
  {
    name: "children",
    type: "ReactNode",
    desc: "wrapped content, in normal flow above the canvas. optional in fixed mode.",
  },
  {
    name: "fixed",
    type: "boolean",
    defaultValue: "false",
    desc: "false wraps its own box; true is a position:fixed frame around the viewport.",
  },
  {
    name: "radius",
    type: "number",
    desc: "corner radius in px. wrapper mode reads the box's computed border-radius; fixed mode scales with viewport width.",
  },
  {
    name: "thickness",
    type: "number",
    defaultValue: "2",
    desc: "band width in px.",
  },
  {
    name: "inset",
    type: "number",
    defaultValue: "0",
    desc: "gap between the frame and the edge in px. the viewport margin in fixed mode.",
  },
  {
    name: "fluid",
    type: "boolean",
    defaultValue: "true",
    desc: "false mounts no canvas; reduced motion paints the static border instead.",
  },
  {
    name: "intro",
    type: "boolean",
    defaultValue: "true",
    desc: "a one-time reveal ramp on mount. skipped under reduced motion.",
  },
  {
    name: "accentColor",
    type: "string",
    defaultValue: "accent token",
    desc: "rim light and glow.",
  },
  {
    name: "backdrop",
    type: "string",
    defaultValue: "bg token",
    desc: "the colour the glass tints against.",
  },
  {
    name: "tint",
    type: "string",
    defaultValue: "surface-2 token",
    desc: "the glass itself.",
  },
  {
    name: "shine",
    type: "number",
    defaultValue: "per theme",
    desc: "0 is flat matte, 1 is the full neon rim.",
  },
];

export default function SulaFramePage() {
  return (
    <ComponentDoc
      slug="sula-frame"
      client
      description={
        <>
          a liquid border that hugs a rounded rectangle, calm at rest and
          leaning toward the cursor. wrap a card for a glowing brand edge, or
          set fixed to frame the whole viewport.
        </>
      }
      composition={{
        ok: [
          "wrap one hero card, a pricing panel, a focal surface",
          "fixed mode as page chrome, inset from the viewport edge",
        ],
        no: [
          "one liquid surface per view. it is a wow moment, not dense product chrome",
          "never CSS-scale the frame; it measures its own box",
        ],
      }}
      a11y={
        <>
          the canvas layer is{" "}
          <code className="font-mono text-xs">aria-hidden</code> · wrapped
          content stays in normal flow, fully interactive · a{" "}
          <code className="font-mono text-xs">:focus-visible</code> inside wakes
          the ring
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
      <SulaFrameDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="sula-frame"
        usage={`import { SulaFrame } from "usva/sula/sula-frame";

<SulaFrame radius={20} className="rounded-[20px] bg-surface p-8">
  <Pricing />
</SulaFrame>

<SulaFrame fixed inset={12} />`}
      />
    </ComponentDoc>
  );
}
