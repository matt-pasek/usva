import type { Metadata } from "next";
import { GroundNote } from "@/components/dark-stage";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { LoimuPlayground } from "./loimu-demo";

export const metadata: Metadata = {
  title: "Loimu",
  description:
    "Light from something enormous and off-frame, drawn into long streamers that fade before the edge.",
};

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
    desc: "adds a vortex to the curl field at the eased cursor; the streamers bend toward it from a distance.",
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
          light arrives from something enormous and off-frame, already organised
          into long parallel streamers advected by a curl field, and decays to
          nothing before the frame edge. it is designed to sit under a
          three-layer CSS scrim that keeps one diagonal wedge and destroys the
          rest: <b>the scrim does the cutting, never the shader</b>.
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
      <GroundNote name="Loimu" />

      <LoimuPlayground />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="loimu"
        usage={`import { Loimu } from "@matt-pasek/usva";

<Loimu className="relative min-h-svh">
  <div aria-hidden className="pointer-events-none absolute inset-0" style={{ backgroundImage: SCRIM }} />
  <Hero className="relative" />
</Loimu>`}
      />
    </ComponentDoc>
  );
}
