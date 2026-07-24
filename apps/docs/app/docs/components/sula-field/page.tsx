import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";
import { SulaFieldPlayground } from "./sula-field-demo";

export const metadata: Metadata = pageMetadata("/docs/components/sula-field", {
  title: "Sula Field",
  description:
    "Liquid-glass masses that drift and merge slowly behind your content. One sula per region; it pauses offscreen and in a background tab. Live demo and props.",
});

const props = [
  {
    name: "children",
    type: "ReactNode",
    desc: "rendered in normal flow above the field. omit it for a bare layer you position yourself.",
  },
  {
    name: "speed",
    type: "number",
    defaultValue: "1",
    desc: "drift-rate multiplier. higher drifts faster.",
  },
  {
    name: "drive",
    type: "SulaFieldDrive",
    defaultValue: "ambientDrift",
    desc: (
      <>
        the choreography: a pure function of time and bounds. clamped to 12
        bodies per plane and 8 necks, <b>the surplus is not drawn</b>.
      </>
    ),
  },
  {
    name: "interactive",
    type: "boolean",
    defaultValue: "false",
    desc: "the field leans toward the eased cursor. off so the background does not compete.",
  },
  {
    name: "seed",
    type: "number",
    defaultValue: "0",
    desc: "the same value wanders the same way, across renders and SSR.",
  },
  {
    name: "fluid",
    type: "boolean",
    defaultValue: "true",
    desc: "false mounts no canvas. reduced motion paints one static frame instead.",
  },
  {
    name: "stillTime",
    type: "number",
    defaultValue: "0",
    desc: "which instant of the drive the reduced-motion still is taken from, in seconds.",
  },
  {
    name: "accentColor",
    type: "string",
    defaultValue: "accent token",
    desc: "rim light and glow on the blobs.",
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
    desc: "0 is flat matte glass, 1 is the full neon rim.",
  },
];

export default function SulaFieldPage() {
  return (
    <ComponentDoc
      slug="sula-field"
      client
      description={
        <>
          an ambient veil of slow liquid glass: dark masses heave behind, lit
          glass drifts and kisses in front, and your content stays crisp and
          interactive above it.
        </>
      }
      composition={{
        ok: [
          "behind a landing hero, a splash, a section break. one per view",
          "no children makes it a bare background layer you position yourself",
        ],
        no: [
          "never under a second sula surface, and never behind a work surface",
          "never CSS-scale it. the pool spills out of the transformed box",
        ],
      }}
      a11y={
        <>
          the canvas layer is{" "}
          <code className="font-mono text-xs">aria-hidden</code> and
          pointer-transparent · content renders above it exactly as it would
          with no field
        </>
      }
      dependencies={
        <>
          <code className="font-mono text-xs">motion</code> ·{" "}
          <code className="font-mono text-xs">ogl</code> · sula-core{" "}
          <span className="text-muted">from the same package</span>
        </>
      }
    >
      <SulaFieldPlayground />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="sula-field"
        usage={`import { SulaField } from "@matt-pasek/usva";

<SulaField className="min-h-svh">
  <Hero />
</SulaField>`}
      />
    </ComponentDoc>
  );
}
