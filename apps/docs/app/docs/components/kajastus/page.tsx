import type { Metadata } from "next";
import { GroundNote } from "@/components/dark-stage";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";
import { KajastusPlayground } from "./kajastus-demo";

export const metadata: Metadata = pageMetadata("/docs/components/kajastus", {
  title: "Kajastus",
  description:
    "The glow spreading along a horizon, arrived overhead as a curved roof of folded light over the viewport.",
});

const props = [
  {
    name: "children",
    type: "ReactNode",
    desc: "rendered above the vault, in normal flow.",
  },
  {
    name: "speed",
    type: "number",
    defaultValue: "1",
    desc: "rate of the streaming rays and the fold drift.",
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
    type: "{ low?; high?; star? }",
    defaultValue: "accent-alt · accent · ink",
    desc: "the altitude ramp: green low and distant, violet climbing the folds, cold stars behind. omitted stops read their token.",
  },
  {
    name: "params",
    type: "Partial<KajastusParams>",
    defaultValue: "KAJASTUS_DEFAULTS",
    desc: (
      <>
        the field itself: pitch, curve, fold, foldScale, warp, offset, width,
        detail, threshold, drift, rayFreq, raySpeed, far, exposure, stars, and
        the corridor cut (<code>corridor</code>, <code>corridorY</code>,{" "}
        <code>corridorH</code>) that keeps the type on real negative space.
      </>
    ),
  },
];

export default function KajastusPage() {
  return (
    <ComponentDoc
      slug="kajastus"
      client
      description={
        <>
          the glow spreading along the horizon, arrived overhead: a curved roof
          of folded light arching over the viewport and running off past both
          edges, bright where a fold turns and you look through more of it. a
          corridor of low density runs through the middle, so header type keeps
          its ground.
        </>
      }
      composition={{
        ok: [
          "behind a hero or a full section, children in normal flow above it",
          "the header type sits in the corridor, not on top of the folds",
        ],
        no: [
          "never on a ground it cannot outshine. on savi it renders nothing",
          "one vault per page. it is the room, nothing else competes",
          "the most expensive of the eight to draw. give it a page worth the cost, and do not pair it with a second moving field",
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
        <GroundNote name="kajastus" />
      </div>

      <KajastusPlayground />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="kajastus"
        usage={`import { Kajastus } from "@matt-pasek/usva/atmospheres/kajastus";

<Kajastus className="min-h-svh">
  <Hero />
</Kajastus>`}
      />
    </ComponentDoc>
  );
}
