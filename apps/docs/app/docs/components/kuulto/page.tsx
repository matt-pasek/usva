import type { Metadata } from "next";
import { GroundNote } from "@/components/dark-stage";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { KuultoPlayground } from "./kuulto-demo";

export const metadata: Metadata = {
  title: "Kuulto",
  description:
    "Creased silk on a scale you stand inside, lit from three sides so its colour is only what the light does to the folds.",
};

const props = [
  {
    name: "children",
    type: "ReactNode",
    desc: "rendered above the drape, in normal flow.",
  },
  {
    name: "speed",
    type: "number",
    defaultValue: "1",
    desc: "drift and drape rate multiplier.",
  },
  {
    name: "interactive",
    type: "boolean",
    defaultValue: "true",
    desc: "the cursor swings the key lamp and the folds re-catch it.",
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
    desc: (
      <>
        forces the blend. by default a dark ground emits and a light ground
        stains, <b>the only way this survives a light theme</b>.
      </>
    ),
  },
  {
    name: "colors",
    type: "{ key?; fill?; rim? }",
    desc: "the three lamps: key reads accent, fill reads accent-2, rim reads accent-alt. omitted lamps read their token.",
  },
  {
    name: "params",
    type: "Partial<KuultoParams>",
    desc: "the drape: scale, relief, crease, creaseWidth, drift, drape, drapeScale, sheen, gloss, wrap, contrast, purity, key, fill, rim, tilt, gain.",
  },
];

export default function KuultoPage() {
  return (
    <ComponentDoc
      slug="kuulto"
      client
      description={
        <>
          a sheet of silk far larger than the frame, creased three times and lit
          by three coloured lamps. everything you see is the lighting: a fold
          takes the hue of whichever lamp it turns toward, and the ground is
          black because no light reaches it. nothing is painted.
        </>
      }
      composition={{
        ok: [
          "wraps a hero or a full section; children sit above the drape in normal flow",
          "recolour through colors: the hues are lamps, so it is native to no theme and at home in all",
        ],
        no: [
          "not on savi. light in a void needs a dark ground; reach for kynnös or väre there",
          "never behind dense reading surfaces. it is the room, not a texture",
        ],
      }}
      a11y={
        <>
          the canvas sits in an{" "}
          <code className="font-mono text-xs">aria-hidden</code> wrapper behind
          the content · reduced motion paints one static frame · no WebGL2, no
          canvas
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
        <GroundNote name="kuulto" />
      </div>

      <KuultoPlayground />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="kuulto"
        usage={`import { Kuulto } from "@matt-pasek/usva";

<Kuulto className="min-h-svh">
  <Hero />
</Kuulto>`}
      />
    </ComponentDoc>
  );
}
