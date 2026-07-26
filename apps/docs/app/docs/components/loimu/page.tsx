import type { Metadata } from "next";
import { GroundNote } from "@/components/dark-stage";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";
import { LoimuPlayground } from "./loimu-demo";

export const metadata: Metadata = pageMetadata("/docs/components/loimu", {
  title: "Loimu",
  description:
    "Light from something enormous and off-frame, drawn into long streamers that fade before the edge.",
});

const props = [
  {
    name: "children",
    type: "ReactNode",
    desc: "rendered above the sheet, in normal flow.",
  },
  {
    name: "speed",
    type: "number",
    defaultValue: "1",
    desc: "flow and fold rate multiplier.",
  },
  {
    name: "interactive",
    type: "boolean",
    defaultValue: "true",
    desc: "the streamers bend toward your cursor from a distance, following it with a lag.",
  },
  {
    name: "opacity",
    type: "number",
    defaultValue: "1",
    desc: "overall opacity of the sheet, 0 to 1.",
  },
  {
    name: "mode",
    type: '"emissive" | "absorptive"',
    desc: "forces the blend. by default a dark ground emits and a light ground stains, which is the only way this survives a light theme.",
  },
  {
    name: "colors",
    type: "{ body?; deep?; edge? }",
    desc: "the hue along the flow: body reads accent, deep reads accent-2 where the light is oldest, edge reads accent-alt on the leading lines. omitted stops read their token.",
  },
  {
    name: "params",
    type: "Partial<LoimuParams>",
    desc: "escape hatch for the field: source, sigma, fold, curlAmt, omega, edge and the rest. the defaults are the tuned sheet.",
  },
];

export default function LoimuPage() {
  return (
    <ComponentDoc
      slug="loimu"
      client
      description={
        <>
          light arrives from something enormous and off-frame, drawn into long
          parallel streamers that decay to nothing before the edge. it expects a
          scrim over it, keeping one diagonal wedge and cutting the rest:{" "}
          <b>the scrim does that work, never the atmosphere</b>.
        </>
      }
      composition={{
        ok: [
          "the ground of a hero or a full page, with the page's own scrim on top",
          "content goes in as children, above the sheet in normal flow",
        ],
        no: [
          "never unmasked full-frame: without the scrim it lies about where the light lives",
          "not inside a Card or a panel. it is the room, one per page",
        ],
      }}
      a11y={
        <>
          the canvas is <code className="font-mono text-xs">aria-hidden</code> ·
          reduced motion paints one static developed frame · without WebGL2 the
          canvas never mounts
        </>
      }
      dependencies={
        <>
          <code className="font-mono text-xs">ogl</code> · atmospheres-core{" "}
          <span className="text-muted">from the same package</span>
        </>
      }
    >
      <GroundNote name="loimu" />

      <LoimuPlayground />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="loimu"
        usage={`import { Loimu } from "@matt-pasek/usva/atmospheres/loimu";

<Loimu className="relative min-h-svh">
  <div aria-hidden className="pointer-events-none absolute inset-0" style={{ backgroundImage: SCRIM }} />
  <Hero className="relative" />
</Loimu>`}
      />
    </ComponentDoc>
  );
}
