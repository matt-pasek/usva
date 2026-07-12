import { Card, CardBody, CardHeader } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";
import { HolviDemo } from "./holvi-demo";

export const metadata: Metadata = {
  title: "Holvi",
  description:
    "Holvi: the aurora as a cathedral vault, seen from underneath. A ceiling of folded light that arches over the viewport and thins to black at the apex.",
};

const props = [
  {
    name: "children",
    type: "ReactNode",
    desc: "Rendered above the vault, in normal flow.",
  },
  {
    name: "speed",
    type: "number",
    desc: "Rate of the streaming rays and the fold drift. Defaults to 1.",
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
    type: "{ low?; high?; star? }",
    desc: "Overrides the altitude ramp: green low and distant, violet climbing the folds, cold stars behind. Omitted stops read their token.",
  },
  {
    name: "params",
    type: "Partial<VaultParams>",
    desc: "The field itself: pitch, curve, fold, foldScale, warp, offset, width, detail, threshold, drift, rayFreq, raySpeed, far, exposure, stars, corridor, corridorY, corridorH.",
  },
];

const usage = `import { Holvi } from "@matt-pasek/usva";

<Holvi className="min-h-svh">
  <Hero />
</Holvi>`;

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

export default function HolviPage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Holvi</h1>
        <p className="text-muted">
          Holvi is Finnish for a vault. This is the aurora as a cathedral
          ceiling, seen from underneath: a curved roof of light arching over the
          viewport and running off past both edges, converging overhead rather
          than standing in front of you. Ribbons folded like fabric seen
          edge-on, bright where a fold turns and you look through more of it. It
          is the kajo showpiece, and the heaviest effect in the library.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody className="bg-bg pt-0!">
          <HolviDemo />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>A roof, not a curtain</CardHeader>
        <CardBody>
          <p className="text-sm text-muted">
            The density is a curtain function on a large spherical shell marched
            from the inside, with its noise domain stretched along the ribbon
            tangent. That anisotropy is the whole thing. Isotropic noise on
            near-black gives coloured clouds, which is the shape everyone
            already recognises; folds only stay folds because the warp runs on
            one axis.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Most of the frame stays empty</CardHeader>
        <CardBody>
          <p className="text-sm text-muted">
            The vault occupies a band and the rest of the frame is meant to stay
            black. A corridor of low density is cut through the field for the
            header type, so the words sit in real negative space rather than on
            top of a busy sky. <code>params.corridor</code>,{" "}
            <code>corridorY</code> and <code>corridorH</code> move and resize
            it.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>The corridor can close</CardHeader>
        <CardBody className="flex flex-col gap-3">
          <p className="text-sm text-muted">
            With the corridor at zero the field runs uncut. Useful to see what
            the cut is doing, and a bad place to put text.
          </p>
          <HolviDemo
            params={{ corridor: 0 }}
            caption="no corridor, and the type has to fight the field for contrast"
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Ramp and sky</CardHeader>
        <CardBody className="flex flex-col gap-3">
          <p className="text-sm text-muted">
            By default <code>low</code> reads accent-alt, <code>high</code>{" "}
            reads accent and <code>star</code> reads ink, so a theme swap
            repaints it. Pass any stop to retune it. <code>params.stars</code>{" "}
            at zero gives a clean sky.
          </p>
          <HolviDemo
            colors={{ low: "#1f9e8a", high: "#5b6cff", star: "#dfe6ff" }}
            params={{ stars: 0.9 }}
            caption="a retuned ramp, and the star field turned up"
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>It can step back</CardHeader>
        <CardBody className="flex flex-col gap-3">
          <p className="text-sm text-muted">
            <code>opacity</code> dials the whole vault down, and{" "}
            <code>speed</code> slows the rays that stream up the folds.
          </p>
          <HolviDemo
            opacity={0.55}
            speed={0.5}
            caption="dimmer and slower, for a page with a lot to read"
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>It falls back to a still, or to nothing</CardHeader>
        <CardBody>
          <p className="text-sm text-muted">
            A <code>prefers-reduced-motion</code> preference paints one static
            frame with no loop, and the loop stops when the vault scrolls
            offscreen or the tab is backgrounded. With no WebGL2 the canvas
            never mounts and the background is just the surface. The canvas is
            hidden from assistive tech either way.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody className="flex flex-col gap-3">
          <InstallBlock registryName="holvi" />
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
          <SourceView filePath="packages/usva/src/effects/holvi/holvi.tsx" />
          <SourceView filePath="packages/usva/src/effects/holvi/vault.ts" />
          <SourceView filePath="packages/usva/src/effects/holvi/vault-shader.ts" />
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
