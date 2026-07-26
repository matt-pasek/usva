import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";
import { RoutaPlayground } from "./routa-demo";

export const metadata: Metadata = pageMetadata("/docs/components/routa", {
  title: "Routa",
  description:
    "Ground frost heaving low cells from underneath and cracking the seams between them.",
});

const props = [
  {
    name: "children",
    type: "ReactNode",
    desc: "rendered above the frozen ground, in normal flow.",
  },
  {
    name: "speed",
    type: "number",
    defaultValue: "1",
    desc: "domain drift multiplier. barely perceptible either way.",
  },
  {
    name: "mode",
    type: '"emissive" | "absorptive"',
    desc: "forces the material. by default a light ground stains its fissures and a dark ground catches the raking key.",
  },
  {
    name: "light",
    type: "{ direction?; color? }",
    defaultValue: "[-0.68, 0.46, 0.38]",
    desc: (
      <>
        the low raking key. <b>keep z low</b>, the heave only reads when the key
        rakes across it. color only affects the dark-ground reading.
      </>
    ),
  },
  {
    name: "opacity",
    type: "number",
    defaultValue: "1",
    desc: "overall opacity, 0 to 1.",
  },
  {
    name: "params",
    type: "Partial<RoutaParams>",
    desc: "the frost field: cellScale, heave, crackWidth, crackDepth, unevenScale, uneven, drift, growthRate, slope, rough, ambient, key, relief, and dither. relief is the damp a light ground holds in the lee of a heave, and does nothing on a dark one.",
  },
];

export default function RoutaPage() {
  return (
    <ComponentDoc
      slug="routa"
      client
      description={
        <>
          ground frost. water freezes below the surface, lifts the clay into low
          cells, then breaks it along the walls between them. it is relief first
          and almost still: fissures propagate across the first half-minute,
          settle, and never loop or breathe.
        </>
      }
      composition={{
        ok: [
          "wraps a whole region; content sits above the ground in normal flow",
          "savi is its home: the fissures hold pigment there. dark grounds get the raking key instead",
        ],
        no: [
          "one atmosphere per page. it is the room, nothing layers over it",
          "not an ambient pulse. it does not float above the page or breathe like fog",
        ],
      }}
      a11y={
        <>
          the canvas layer is{" "}
          <code className="font-mono text-xs">aria-hidden</code> and
          pointer-transparent · reduced motion paints the mature frame at
          twenty-seven seconds and stops
        </>
      }
      dependencies={
        <>
          <code className="font-mono text-xs">ogl</code> · atmospheres-core{" "}
          <span className="text-muted">from the same package</span>
        </>
      }
    >
      <RoutaPlayground />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="routa"
        usage={`import { Routa } from "@matt-pasek/usva/atmospheres/routa";

<Routa className="min-h-svh">
  <Article />
</Routa>`}
      />
    </ComponentDoc>
  );
}
