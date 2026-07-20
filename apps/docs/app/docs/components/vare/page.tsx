import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { VarePlayground } from "./vare-demo";

export const metadata: Metadata = {
  title: "Väre",
  description:
    "Broad wavefronts crossing the frame: crests that glow on dark ground, damp troughs pressed into clay on savi.",
};

const props = [
  {
    name: "children",
    type: "ReactNode",
    desc: "rendered above the bands, in normal flow.",
  },
  {
    name: "speed",
    type: "number",
    defaultValue: "1",
    desc: "wave rate multiplier.",
  },
  {
    name: "interactive",
    type: "boolean",
    defaultValue: "true",
    desc: "a lens in phase space follows the eased cursor and bends the bands as it passes.",
  },
  {
    name: "opacity",
    type: "number",
    defaultValue: "1",
    desc: "overall opacity of the bands, 0 to 1.",
  },
  {
    name: "mode",
    type: '"emissive" | "absorptive"',
    desc: "forces the blend. by default a dark ground emits and a light ground stains, which is the only way this survives a light theme.",
  },
  {
    name: "colors",
    type: "{ body?; deep?; edge? }",
    desc: "on dark ground, the front-to-back ramp. on savi, body combines with theme ink to make the trough pigment. omitted stops read their token.",
  },
  {
    name: "params",
    type: "Partial<VareParams>",
    desc: "the field: angle, spread, wavenumber, speed, warp, warpScale, jitter, soft, detail, node, gain, source, falloff, span, lens, lensSigma.",
  },
];

export default function VarePage() {
  return (
    <ComponentDoc
      slug="vare"
      client
      description={
        <>
          a few broad wavefronts cross the frame from off-frame right and
          interfere. on a dark ground the iso-phase crests emit; on savi the
          same phases become relief pressed into clay, troughs holding a warm
          damp pigment. <b>the failure mode is moire</b>: the domain warp, the
          per-front jitter and the thickness noise are the defences, and taking
          them to zero snaps the bands into a diagram.
        </>
      }
      composition={{
        ok: [
          "a hero or full-page room, its content as children in normal flow",
          "dark and light themes both work; the blend resolves itself per ground",
        ],
        no: [
          "never behind dense reading surfaces or another atmosphere",
          "not a card texture. it is a room, one per page",
        ],
      }}
      a11y={
        <>
          the canvas layer is{" "}
          <code className="font-mono text-xs">aria-hidden</code> and
          pointer-events-none · reduced motion paints one still frame · without
          WebGL2 the canvas never mounts
        </>
      }
      dependencies={
        <>
          <code className="font-mono text-xs">ogl</code> · atmospheres-core{" "}
          <span className="text-muted">from the same package</span>
        </>
      }
    >
      <VarePlayground />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="vare"
        usage={`import { Vare } from "@matt-pasek/usva";

<Vare className="min-h-svh">
  <Hero />
</Vare>`}
      />
    </ComponentDoc>
  );
}
