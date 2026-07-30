import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";
import { SulaSegmentedDemo } from "./sula-segmented-demo";

export const metadata: Metadata = pageMetadata(
  "/docs/components/sula-segmented",
  {
    title: "Sula Segmented",
    description:
      "Pinches a droplet off the old segment and merges it into the new one, as the active indicator.",
  },
);

const props = [
  {
    name: "items",
    type: "SulaSegmentedItem[]",
    desc: (
      <>
        each entry is <code>{"{ value, label, icon? }"}</code>. the segments are
        real buttons, measured at rest.
      </>
    ),
  },
  {
    name: "value",
    type: "string",
    desc: "controlled: the selected value.",
  },
  {
    name: "defaultValue",
    type: "string",
    desc: "uncontrolled: the value selected on mount. falls back to the first item.",
  },
  {
    name: "onValueChange",
    type: "(value: string) => void",
    desc: "fires when a segment is picked, by click or by arrow key.",
  },
  {
    name: "size",
    type: '"sm" | "md"',
    defaultValue: '"md"',
    desc: "segment height and padding.",
  },
  {
    name: "fluid",
    type: "boolean",
    defaultValue: "true",
    desc: (
      <>
        <b>false renders the plain sliding pill and mounts no canvas.</b> also
        the automatic path under reduced motion or missing WebGL2, and what the
        server always renders.
      </>
    ),
  },
  {
    name: "bare",
    type: "boolean",
    defaultValue: "false",
    desc: "drops the track fill and border, leaving the indicator on a bare surface.",
  },
  {
    name: "backdrop",
    type: "string",
    desc: "the colour the glass tints against. defaults to the bg token.",
  },
  {
    name: "tint",
    type: "string",
    desc: "the glass itself. defaults to the surface-2 token.",
  },
  {
    name: "accentColor",
    type: "string",
    desc: "rim light and glow. defaults to the accent token.",
  },
  {
    name: "shine",
    type: "number",
    desc: "0 is flat matte glass, 1 is the full neon rim. derived from the backdrop when unset.",
  },
];

export default function SulaSegmentedPage() {
  return (
    <ComponentDoc
      slug="sula-segmented"
      client
      description={
        <>
          a segmented control whose active indicator is a liquid droplet. pick a
          new segment and a drop pinches off the old pill, travels on a thinning
          neck, and merges into the new one.
        </>
      }
      composition={{
        ok: [
          "brand surfaces: a theme switcher on a portfolio, a view toggle on a hero",
          "it mirrors SegmentedControl exactly, keyboard and semantics included",
        ],
        no: [
          "dense or task-bound UI takes the plain SegmentedControl. there the effect is noise",
          "one sula member per region",
        ],
      }}
      a11y={
        <>
          <code className="font-mono text-xs">role="radiogroup"</code>, each
          segment a <code className="font-mono text-xs">radio</code> with{" "}
          <code className="font-mono text-xs">aria-checked</code> and roving
          tabindex · the canvas and icons are{" "}
          <code className="font-mono text-xs">aria-hidden</code>
        </>
      }
      dependencies={
        <>
          <code className="font-mono text-xs">motion</code> ·{" "}
          <code className="font-mono text-xs">ogl</code> · sula-core +
          sula-motion <span className="text-muted">from the same package</span>
        </>
      }
    >
      <SulaSegmentedDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="sula-segmented"
        usage={`import { SulaSegmented } from "@usva-ui/react/sula/sula-segmented";

<SulaSegmented
  items={[
    { value: "kajo", label: "Kajo" },
    { value: "sisu", label: "Sisu" },
    { value: "savi", label: "Savi" },
  ]}
  value={theme}
  onValueChange={setTheme}
/>`}
      />
    </ComponentDoc>
  );
}
