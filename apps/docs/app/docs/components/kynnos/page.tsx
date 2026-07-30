import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";
import { KynnosDemo } from "./kynnos-demo";

export const metadata: Metadata = pageMetadata("/docs/components/kynnos", {
  title: "Kynnös",
  description:
    "Freshly turned earth, turning far slower than you notice, lit by one low raking light.",
});

const props = [
  {
    name: "children",
    type: "ReactNode",
    desc: "rendered above the surface, in normal flow.",
  },
  {
    name: "speed",
    type: "number",
    defaultValue: "1",
    desc: "wheel and drift rate multiplier. 1 is about ninety seconds per revolution.",
  },
  {
    name: "mode",
    type: '"emissive" | "absorptive"',
    desc: "overrides the material. by default the ground decides: light clay on a light theme, brushed metal on a dark one.",
  },
  {
    name: "light",
    type: "{ direction?; color? }",
    desc: (
      <>
        the key light. <b>keep direction z low</b> or the grooves stop throwing
        shadows. colour defaults to the theme: warm daylight on clay, the accent
        on metal.
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
    type: "Partial<KynnosParams>",
    desc: (
      <>
        the surface escape hatch: origin, spin, furrowFreq, warpAmt, breakAmt,
        depth, microAmt, crackAmt and friends. origin is pushed off-frame and
        warpAmt is clamped to roughly 2 to 4.5 furrow spacings, so the rings can
        never read as a vinyl record.
      </>
    ),
  },
];

export default function KynnosPage() {
  return (
    <ComponentDoc
      slug="kynnos"
      client
      description={
        <>
          freshly turned earth, still spinning on a wheel far slower than you
          first notice. one low raking light does all of it, and the ground
          keeps no shine of its own. swap the theme and the same furrows read as
          clay, or as brushed metal.
        </>
      }
      composition={{
        ok: [
          "the ground under a hero or a full page region, children in normal flow",
          "tune the key with light; it changes more than any params tweak",
        ],
        no: [
          "not a panel fill. it is the room, never a texture inside a card",
          "no blend mode on top: unlike the emissive atmospheres it composites normally",
        ],
      }}
      a11y={
        <>
          the canvas is <code className="font-mono text-xs">aria-hidden</code>{" "}
          and pointer-events-none · reduced motion paints one still frame · no
          WebGL2 and it never mounts
        </>
      }
      dependencies={
        <>
          <code className="font-mono text-xs">ogl</code> · atmospheres-core{" "}
          <span className="text-muted">from the same package</span>
        </>
      }
    >
      <KynnosDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="kynnos"
        usage={`import { Kynnos } from "@usva-ui/react/atmospheres/kynnos";

<Kynnos className="min-h-svh">
  <Hero />
</Kynnos>`}
      />
    </ComponentDoc>
  );
}
