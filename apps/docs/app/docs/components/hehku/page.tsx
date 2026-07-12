import { Card, CardBody, CardHeader } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";
import { HehkuDemo } from "./hehku-demo";

export const metadata: Metadata = {
  title: "Hehku",
  description:
    "Hehku: one incandescent filament coiling through void, cold and violet where it runs thin, blooming where the coil bunches and self-occludes.",
};

const props = [
  {
    name: "children",
    type: "ReactNode",
    desc: "Rendered above the coil, in normal flow.",
  },
  {
    name: "speed",
    type: "number",
    desc: "Rate of the coil's wander and spin. Defaults to 1. It is meant to stay slow.",
  },
  {
    name: "opacity",
    type: "number",
    desc: "Overall strength, 0 to 1. Defaults to 1.",
  },
  {
    name: "mode",
    type: '"emissive" | "absorptive"',
    desc: "Forces the blend. By default a dark ground emits and a light ground stains.",
  },
  {
    name: "colors",
    type: "{ cool?; hot? }",
    desc: "The two ends of the heat ramp. Cool defaults to accent held under its token; hot defaults to accent-alt lifted toward white.",
  },
  {
    name: "params",
    type: "Partial<FilamentParams>",
    desc: "The curve: segments, radius, winding, scale, drift, driftRate, spin, tilt, thickness, glow. The windings must stay coprime integers or the knot degenerates.",
  },
  {
    name: "view",
    type: "Partial<FilamentView>",
    desc: "The camera and the ramp: dist, focal, offset, bloom, exposure. The offset holds the eye off-axis so the coil crops at the frame.",
  },
];

const usage = `import { Hehku } from "@matt-pasek/usva";

<Hehku className="min-h-svh">
  <Hero />
</Hehku>`;

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

export default function HehkuPage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Hehku</h1>
        <p className="text-muted">
          Hehku is Finnish for incandescence. One continuous ribbon of light, a
          single long curve heated like a filament, coiling slowly through void
          and passing behind and in front of itself. Thin and cold runs violet;
          where the coil bunches and looks through itself, the accumulated light
          blooms toward white. One object, sculptural, and the quieter of the
          two kajo backgrounds.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody className="bg-bg pt-0!">
          <HehkuDemo />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>One closed curve, no ends</CardHeader>
        <CardBody>
          <p className="text-sm text-muted">
            The filament is a chain of capsules whose endpoints sample a torus
            knot with a slow drift on top. Every term is periodic in the curve
            parameter, so the last knot lands exactly on the first: the ribbon
            has no ends and no seam. There is no march either: the ray integral
            of the gaussian core around each capsule has a closed form, and its
            geometry factor makes a ray that runs along the filament collect
            more light, which is why the coil blooms where it turns toward the
            eye or bunches against itself.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Thicker, tighter, colder</CardHeader>
        <CardBody className="flex flex-col gap-3">
          <p className="text-sm text-muted">
            <code>params.thickness</code> sets the radius of the emitting core
            and <code>params.glow</code> the falloff around it. A larger glow is
            a tighter, colder line; a smaller one spreads the heat into the void
            around the coil.
          </p>
          <HehkuDemo
            params={{ thickness: 0.06, glow: 16 }}
            caption="a thinner core with a looser falloff"
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>A different figure</CardHeader>
        <CardBody className="flex flex-col gap-3">
          <p className="text-sm text-muted">
            The windings decide how the curve knots itself. They have to stay
            coprime integers, or the knot collapses into one circle traced
            several times.
          </p>
          <HehkuDemo
            params={{ winding: [3, 4], radius: [1.9, 0.95] }}
            view={{ dist: 3.6, offset: [0.9, 1.3] }}
            caption="a busier figure, coiling tighter through the frame"
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>The heat ramp</CardHeader>
        <CardBody className="flex flex-col gap-3">
          <p className="text-sm text-muted">
            <code>colors.cool</code> and <code>colors.hot</code> are the two
            ends of the ramp; <code>view.bloom</code> decides how much
            accumulated light it takes to reach the hot end, and{" "}
            <code>view.exposure</code> scales the whole thing.
          </p>
          <HehkuDemo
            colors={{ cool: "#3a2a6e", hot: "#ffb45e" }}
            view={{ bloom: 2.8, exposure: 1.7 }}
            caption="a warmer hot end, reached sooner"
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>It falls back to a still, or to nothing</CardHeader>
        <CardBody>
          <p className="text-sm text-muted">
            A <code>prefers-reduced-motion</code> preference paints one static
            frame of the coil with no loop. The loop pauses offscreen and on a
            backgrounded tab. With no WebGL2 the canvas never mounts. The canvas
            is hidden from assistive tech, and the children stay interactive
            above it.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody className="flex flex-col gap-3">
          <InstallBlock registryName="hehku" />
          <p className="text-sm text-muted">
            Pulls in <code>ogl</code> and the shared <code>effects-core</code>{" "}
            shell, which the registry adds for you.
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
          <SourceView filePath="packages/usva/src/effects/hehku/hehku.tsx" />
          <SourceView filePath="packages/usva/src/effects/hehku/filament-curve.ts" />
          <SourceView filePath="packages/usva/src/effects/hehku/filament.ts" />
          <SourceView filePath="packages/usva/src/effects/hehku/filament-shader.ts" />
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
