import { Card, CardBody, CardHeader } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";
import { KynnosDemo } from "./kynnos-demo";

export const metadata: Metadata = {
  title: "Kynnös",
  description:
    "Kynnös: freshly turned earth, land newly broken by the plough. A vast clay surface turning on a wheel, lit by one raking key, with no specular anywhere.",
};

const props = [
  {
    name: "children",
    type: "ReactNode",
    desc: "Rendered above the surface, in normal flow.",
  },
  {
    name: "speed",
    type: "number",
    desc: "Wheel and drift rate multiplier. Defaults to 1, about ninety seconds per revolution.",
  },
  {
    name: "mode",
    type: '"emissive" | "absorptive"',
    desc: "Overrides the material. By default the ground decides: light clay on a light theme, brushed metal on a dark one.",
  },
  {
    name: "light",
    type: "{ direction?; color? }",
    desc: "The key light. Keep direction z low or the grooves stop throwing shadows. Colour defaults to the theme: a warm daylight on clay, the accent on metal.",
  },
  {
    name: "opacity",
    type: "number",
    desc: "Overall opacity, 0 to 1. Defaults to 1.",
  },
  {
    name: "params",
    type: "Partial<KynnosParams>",
    desc: "The surface: origin, spin, furrowFreq, warpAmt, warpFreq, breakAmt, ridgeShape, depth, slope, microScale, microAmt, crackScale, crackAmt, ao, rough, ambient, key, drift, dither. Origin and warpAmt are clamped, see below.",
  },
];

const usage = `import { Kynnos } from "@matt-pasek/usva";

<Kynnos className="min-h-svh">
  <Hero />
</Kynnos>`;

function PropsTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border text-muted">
            <th className="py-2 pr-4 font-medium">Prop</th>
            <th className="py-2 pr-4 font-medium">Type</th>
            <th className="py-2 font-medium">Description</th>
          </tr>
        </thead>
        <tbody>
          {props.map((p) => (
            <tr key={p.name} className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-xs text-ink">{p.name}</td>
              <td className="py-2 pr-4 font-mono text-xs text-muted">
                {p.type}
              </td>
              <td className="py-2 text-muted">{p.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function KynnosPage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Kynnös</h1>
        <p className="text-muted">
          Kynnös is freshly turned earth; land newly broken by the plough. One
          vast clay surface seen from above, still turning on a wheel far slower
          than you first notice. Concentric thumb-drawn grooves wobble, thicken,
          break and re-form, each holding a crescent of warm shadow on one side
          and a dry pale ridge on the other. It is the savi background, and the
          cheapest atmosphere here: a screen-space heightfield, no raymarch.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody className="bg-bg pt-0!">
          <KynnosDemo />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Clay on light, metal on dark</CardHeader>
        <CardBody className="flex flex-col gap-3">
          <p className="text-sm text-muted">
            A theme swap flips the lighting model rather than the shader. On a
            light ground the relief is pigment: nothing brighter than surface-2,
            nothing darker than an occlusion shadow. On a dark ground the same
            relief becomes brushed metal, lit by a grazing accent key that only
            the crests catch. This page is dark, so the demo above is the metal.{" "}
            <code>mode</code> forces either.
          </p>
          <KynnosDemo
            mode="absorptive"
            caption="mode forced to absorptive: the clay reading, on a ground it was not built for"
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>The light is the dial</CardHeader>
        <CardBody className="flex flex-col gap-3">
          <p className="text-sm text-muted">
            One raking key, Oren-Nayar diffuse, crevice occlusion, and no
            specular term anywhere. A groove two centimetres deep only throws a
            shadow because the light grazes it, so keep the z component of{" "}
            <code>light.direction</code> low.
          </p>
          <KynnosDemo
            light={{ direction: [0.86, -0.42, 0.28], color: "#ffd8a8" }}
            caption="the key swung round to the other side, and warmed"
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Circles that stop being legible as circles</CardHeader>
        <CardBody className="flex flex-col gap-3">
          <p className="text-sm text-muted">
            Concentric rings are one bad parameter from a vinyl record, so two
            defences are floored in code rather than left to the props. The
            radial domain warp (<code>warpAmt</code>, measured in furrow
            spacings) is clamped to roughly 2 to 4.5: below that the rings only
            wobble, above it the grooves fold back on themselves. And the wheel{" "}
            <code>origin</code> is pushed off-frame at every aspect ratio,
            because a visible convergence point is the record label.
          </p>
          <KynnosDemo
            params={{ furrowFreq: 26, breakAmt: 0.4, depth: 0.045 }}
            caption="tighter, deeper furrows that break more often"
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Grain and craquelure</CardHeader>
        <CardBody className="flex flex-col gap-3">
          <p className="text-sm text-muted">
            <code>microAmt</code> is high-frequency grain that perturbs only the
            normal and never the height, which is what reads as grog rather than
            latex. <code>crackAmt</code> adds the craquelure that settles in the
            furrow floors. Turn both down and the surface goes smooth and
            synthetic.
          </p>
          <KynnosDemo
            params={{ microAmt: 0.05, crackAmt: 0 }}
            caption="no grain, no cracks: the same relief, and it stops being clay"
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>It falls back to a still, or to nothing</CardHeader>
        <CardBody>
          <p className="text-sm text-muted">
            A <code>prefers-reduced-motion</code> preference paints one static
            frame, which for a surface turning this slowly loses almost nothing.
            The loop pauses offscreen and on a backgrounded tab. With no WebGL2
            the canvas never mounts. Unlike the emissive atmospheres there is no
            blend mode on the canvas: kynnos is the ground, not a stain on it,
            so it composites normally.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody className="flex flex-col gap-3">
          <InstallBlock registryName="kynnos" />
          <p className="text-sm text-muted">
            Pulls in <code>ogl</code> and the shared{" "}
            <code>atmospheres-core</code> shell, which the registry adds for
            you.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Usage</CardHeader>
        <CardBody>
          <pre className="overflow-x-auto rounded-md border border-border bg-sunken p-3 text-xs text-on-sunken">
            <code>{usage}</code>
          </pre>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Source</CardHeader>
        <CardBody className="flex flex-col gap-4">
          <SourceView filePath="packages/usva/src/atmospheres/kynnos/kynnos.tsx" />
          <SourceView filePath="packages/usva/src/atmospheres/kynnos/kynnos-field.ts" />
          <SourceView filePath="packages/usva/src/atmospheres/kynnos/kynnos-uniforms.ts" />
          <SourceView filePath="packages/usva/src/atmospheres/kynnos/kynnos-shader.ts" />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Props</CardHeader>
        <CardBody>
          <PropsTable />
        </CardBody>
      </Card>
    </main>
  );
}
