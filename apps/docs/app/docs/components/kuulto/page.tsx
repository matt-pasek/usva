import { Card, CardBody, CardHeader } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";
import { KuultoDemo } from "./kuulto-demo";

export const metadata: Metadata = {
  title: "Kuulto",
  description:
    "Kuulto: a vast sheet of silk, creased and lit from three sides. The colour is what the light does to the folds, never a sampled palette.",
};

const props = [
  {
    name: "children",
    type: "ReactNode",
    desc: "Rendered above the drape, in normal flow.",
  },
  {
    name: "speed",
    type: "number",
    desc: "Drift and drape rate multiplier. Defaults to 1.",
  },
  {
    name: "interactive",
    type: "boolean",
    desc: "When on, the cursor swings the key lamp and the folds re-catch it. Defaults to true.",
  },
  {
    name: "opacity",
    type: "number",
    desc: "Overall opacity of the sheet, 0 to 1. Defaults to 1.",
  },
  {
    name: "mode",
    type: '"emissive" | "absorptive"',
    desc: "Forces the blend. By default a dark ground emits and a light ground stains, which is the only way this survives a light theme.",
  },
  {
    name: "colors",
    type: "{ key?; fill?; rim? }",
    desc: "The three lamps: key reads accent, fill reads accent-2 and holds the shadow side off black, rim reads accent-alt and grazes the crests. Omitted lamps read their token.",
  },
  {
    name: "params",
    type: "Partial<KuultoParams>",
    desc: "The drape: scale, relief, crease, creaseWidth, drift, drape, drapeScale, sheen, gloss, wrap, contrast, purity, key, fill, rim, tilt, gain.",
  },
];

const usage = `import { Kuulto } from "@matt-pasek/usva";

<Kuulto className="min-h-svh">
  <Hero />
</Kuulto>`;

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

export default function KuultoPage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Kuulto</h1>
        <p className="text-muted">
          Kuulto is translucency, the state of being dimly visible: something
          light passes through or reflects softly. It is a sheet of silk far
          larger than the frame, creased three times and lit by three coloured
          lamps. Everything you see is the lighting: a fold turning toward the
          key lamp takes its hue, the same fold rolling away catches the fill, a
          crest grazed by the rim picks up a thin sheen, and the ground is black
          because no light reaches it. Nothing is painted.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody className="bg-bg pt-0!">
          <KuultoDemo />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Relief is the whole look</CardHeader>
        <CardBody className="flex flex-col gap-3">
          <p className="text-sm text-muted">
            <code>relief</code> decides how steeply the surface normal turns
            across a fold, so it decides how fast a fold travels through the
            lamps. Low and the sheet is a soft wash of one hue. High and every
            fold sweeps the full set, which is where the chroma comes from.
          </p>
          <KuultoDemo
            params={{ relief: 4.5, crease: 1.3 }}
            caption="steeper folds, so each one sweeps through all three lamps"
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Sheen is what makes it cloth</CardHeader>
        <CardBody className="flex flex-col gap-3">
          <p className="text-sm text-muted">
            <code>sheen</code> is the specular exponent and <code>gloss</code>{" "}
            its weight. A tight, heavy glint reads as satin; take{" "}
            <code>gloss</code> to zero and the sheet goes matte, which is the
            difference between silk and paper.
          </p>
          <KuultoDemo
            params={{ gloss: 0, wrap: 0.6 }}
            caption="no specular term: the folds are still there, but the cloth is gone"
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>The pointer turns the silk in the light</CardHeader>
        <CardBody className="flex flex-col gap-3">
          <p className="text-sm text-muted">
            With <code>interactive</code> on, the cursor swings the key lamp
            rather than dragging a glow about, so the folds re-catch the light
            as it moves. <code>params.tilt</code> sets how far it swings. The
            lamp is floored in front of the sheet, because one that swung past
            the horizon would light it from behind and the folds would invert.
          </p>
          <KuultoDemo
            interactive={false}
            caption="interactive off: the lamps hold still and the drape simply drifts"
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Quieter, or recoloured</CardHeader>
        <CardBody className="flex flex-col gap-3">
          <p className="text-sm text-muted">
            <code>opacity</code> and <code>speed</code> pull it back, and{" "}
            <code>colors</code> replaces the lamps. Because the hues are lamps
            rather than a two-colour ramp, the effect is native to no theme and
            at home in all of them.
          </p>
          <KuultoDemo
            opacity={0.75}
            speed={0.6}
            colors={{ key: "#7c3aed", fill: "#155e75", rim: "#22c55e" }}
            caption="violet key, teal fill, a green rim on the crests"
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>It falls back to a still, or to nothing</CardHeader>
        <CardBody>
          <p className="text-sm text-muted">
            A <code>prefers-reduced-motion</code> preference paints one static
            frame, taken far enough in that the pleats have travelled off their
            seed positions. The loop pauses offscreen and on a backgrounded tab.
            With no WebGL2 the canvas never mounts. The canvas is hidden from
            assistive tech.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody className="flex flex-col gap-3">
          <InstallBlock registryName="kuulto" />
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
          <SourceView filePath="packages/usva/src/effects/kuulto/kuulto.tsx" />
          <SourceView filePath="packages/usva/src/effects/kuulto/kuulto-field.ts" />
          <SourceView filePath="packages/usva/src/effects/kuulto/kuulto-uniforms.ts" />
          <SourceView filePath="packages/usva/src/effects/kuulto/kuulto-shader.ts" />
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
