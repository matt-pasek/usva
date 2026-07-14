import { Card, CardBody, CardHeader } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";
import { VareDemo } from "./vare-demo";

export const metadata: Metadata = {
  title: "Väre",
  description:
    "Väre: drifting luminous iso-phase bands. Light sits on the boundaries of a few broad travelling wavefronts, never on the wave bodies.",
};

const props = [
  {
    name: "children",
    type: "ReactNode",
    desc: "Rendered above the bands, in normal flow.",
  },
  {
    name: "speed",
    type: "number",
    desc: "Wave rate multiplier. Defaults to 1.",
  },
  {
    name: "interactive",
    type: "boolean",
    desc: "When on, a lens in phase space follows the eased cursor and visibly bends the bands as it passes. Defaults to true.",
  },
  {
    name: "opacity",
    type: "number",
    desc: "Overall opacity of the bands, 0 to 1. Defaults to 1.",
  },
  {
    name: "mode",
    type: '"emissive" | "absorptive"',
    desc: "Forces the blend. By default a dark ground emits and a light ground stains, which is the only way this survives a light theme.",
  },
  {
    name: "colors",
    type: "{ body?; deep?; edge? }",
    desc: "The front-to-back ramp: body reads accent, deep reads accent-2 on the oldest bands, edge reads accent-alt on the freshest. Omitted stops read their token.",
  },
  {
    name: "params",
    type: "Partial<VareParams>",
    desc: "The field: angle, spread, wavenumber, speed, warp, warpScale, jitter, detail, node, gain, source, falloff, span, lens, lensSigma.",
  },
];

const usage = `import { Vare } from "@matt-pasek/usva";

<Vare className="min-h-svh">
  <Hero />
</Vare>`;

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

export default function VarePage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Väre</h1>
        <p className="text-muted">
          Väre is Finnish for a ripple. A few broad, near-parallel wavefronts
          cross the frame from off-frame right and interfere, and the light is
          emitted from narrow bands around their iso-phase lines rather than
          from the wave bodies. What you see is a set of drifting luminous
          boundaries: the folded edges of a curtain seen from very far away.
          Where two fronts cross there is a brief brighter node. Between the
          bands is void.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody className="bg-bg pt-0!">
          <VareDemo />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>The failure mode is moire</CardHeader>
        <CardBody className="flex flex-col gap-3">
          <p className="text-sm text-muted">
            Sine interference is a few parameters from a diagram. Every defence
            against that is a param: the domain warp that bends the whole field,
            the per-front phase <code>jitter</code> that stops two fronts lining
            up, the wavenumber scatter, and the thickness noise. Take them to
            zero and the bands snap into a regular grid.
          </p>
          <VareDemo
            params={{ warp: 0, jitter: 0, detail: 0 }}
            caption="no warp, no jitter, no thickness noise: this is what it must never look like"
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>The pointer is a lens in phase space</CardHeader>
        <CardBody className="flex flex-col gap-3">
          <p className="text-sm text-muted">
            With <code>interactive</code> on, the cursor perturbs the phase
            locally and the bands bend around it as it passes.{" "}
            <code>params.lens</code> sets the strength and{" "}
            <code>lensSigma</code> its reach. Off, the fronts just travel.
          </p>
          <VareDemo
            interactive={false}
            caption="interactive off: the fronts travel and ignore the pointer"
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Band spacing and travel</CardHeader>
        <CardBody className="flex flex-col gap-3">
          <p className="text-sm text-muted">
            <code>wavenumber</code> sets how tightly the bands stack,{" "}
            <code>angle</code> and <code>spread</code> the shared travel
            direction and the fan of k-vectors around it, and{" "}
            <code>source</code> the off-frame origin the light falls off from.
          </p>
          <VareDemo
            params={{ wavenumber: 8.5, spread: 0.6, node: 1.4 }}
            caption="more bands, a wider fan, brighter nodes where they cross"
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Quieter, or recoloured</CardHeader>
        <CardBody className="flex flex-col gap-3">
          <p className="text-sm text-muted">
            <code>opacity</code> and <code>speed</code> pull it back, and{" "}
            <code>colors</code> retunes the front-to-back ramp.
          </p>
          <VareDemo
            opacity={0.7}
            speed={0.6}
            colors={{ body: "#419648", deep: "#123246", edge: "#dff0b0" }}
            caption="the sisu green, dimmed and slowed"
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>It falls back to a still, or to nothing</CardHeader>
        <CardBody>
          <p className="text-sm text-muted">
            A <code>prefers-reduced-motion</code> preference paints one static
            frame, taken far enough in that the fronts have separated. The loop
            pauses offscreen and on a backgrounded tab. With no WebGL2 the
            canvas never mounts. The canvas is hidden from assistive tech.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody className="flex flex-col gap-3">
          <InstallBlock registryName="vare" />
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
          <SourceView filePath="packages/usva/src/atmospheres/vare/vare.tsx" />
          <SourceView filePath="packages/usva/src/atmospheres/vare/vare-field.ts" />
          <SourceView filePath="packages/usva/src/atmospheres/vare/vare-uniforms.ts" />
          <SourceView filePath="packages/usva/src/atmospheres/vare/vare-shader.ts" />
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
