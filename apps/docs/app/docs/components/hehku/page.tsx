import type { Metadata } from "next";
import { GroundNote } from "@/components/dark-stage";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { HehkuPlayground } from "./hehku-demo";

export const metadata: Metadata = {
  title: "Hehku",
  description:
    "One incandescent filament coiling through the dark, cold violet where it runs thin and blooming where it folds over itself.",
};

const props = [
  {
    name: "children",
    type: "ReactNode",
    desc: "rendered above the coil, in normal flow.",
  },
  {
    name: "speed",
    type: "number",
    defaultValue: "1",
    desc: "rate of the coil's wander and spin. it is meant to stay slow.",
  },
  {
    name: "opacity",
    type: "number",
    defaultValue: "1",
    desc: "overall strength, 0 to 1.",
  },
  {
    name: "mode",
    type: '"emissive" | "absorptive"',
    defaultValue: "resolved bg",
    desc: "forces the blend. by default a dark ground emits and a light ground stains.",
  },
  {
    name: "colors",
    type: "{ cool?; hot? }",
    defaultValue: "accent · accent-alt",
    desc: "the two ends of the heat ramp. cool sinks under accent, hot lifts accent-alt toward white.",
  },
  {
    name: "params",
    type: "Partial<FilamentParams>",
    defaultValue: "FILAMENT_DEFAULTS",
    desc: (
      <>
        the curve: segments, radius, winding, scale, drift, driftRate, spin,
        tilt, thickness, glow. <b>the windings must stay coprime integers</b> or
        the knot degenerates into one circle traced several times.
      </>
    ),
  },
  {
    name: "view",
    type: "Partial<FilamentView>",
    defaultValue: "FILAMENT_VIEW",
    desc: "the camera and the ramp: dist, focal, offset, bloom, exposure. the offset holds the eye off-axis so the coil crops at the frame.",
  },
];

export default function HehkuPage() {
  return (
    <ComponentDoc
      slug="hehku"
      client
      description={
        <>
          one continuous ribbon of light heated like a filament, coiling slowly
          through the void with no ends and no seam. thin runs are cold violet;
          where the coil bunches and looks through itself the light gathers and
          blooms toward white.
        </>
      }
      composition={{
        ok: [
          "behind a hero or a full section, children in normal flow above it",
          "one figure per view. it is the environment, not a decoration",
        ],
        no: [
          "never on a ground it cannot outshine. on savi it renders nothing",
          "not a card or panel background. it needs a void to coil through",
        ],
      }}
      a11y={
        <>
          the canvas is <code className="font-mono text-xs">aria-hidden</code>{" "}
          and pointer-transparent · reduced motion paints one still frame · with
          no WebGL2 the canvas never mounts
        </>
      }
      dependencies={
        <>
          <code className="font-mono text-xs">ogl</code> · atmospheres-core{" "}
          <span className="text-muted">from the same package</span>
        </>
      }
    >
      <div className="mt-9">
        <GroundNote name="hehku" />
      </div>

      <HehkuPlayground />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="hehku"
        usage={`import { Hehku } from "@matt-pasek/usva";

<Hehku className="min-h-svh">
  <Hero />
</Hehku>`}
      />
    </ComponentDoc>
  );
}
