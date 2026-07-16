import { Card, CardBody, CardHeader } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";
import { RoutaDemo } from "./routa-demo";

export const metadata: Metadata = {
  title: "Routa",
  description:
    "Routa: ground frost heaving low cells from underneath and cracking the seams between them.",
};

const props = [
  {
    name: "children",
    type: "ReactNode",
    desc: "Rendered above the frozen ground, in normal flow.",
  },
  {
    name: "speed",
    type: "number",
    desc: "Domain drift multiplier. Defaults to 1 and remains barely perceptible.",
  },
  {
    name: "mode",
    type: '"emissive" | "absorptive"',
    desc: "Overrides the material. By default a light ground stains its fissures and a dark ground catches the raking key.",
  },
  {
    name: "light",
    type: "{ direction?; color? }",
    desc: "The low raking key. Colour only affects the dark-ground reading.",
  },
  {
    name: "opacity",
    type: "number",
    desc: "Overall opacity, 0 to 1. Defaults to 1.",
  },
  {
    name: "params",
    type: "Partial<RoutaParams>",
    desc: "The frost field: cellScale, heave, crackWidth, crackDepth, unevenScale, uneven, drift, growthRate, slope, rough, ambient, key, and dither.",
  },
];

const usage = `import { Routa } from "@matt-pasek/usva";

<Routa className="min-h-svh">
  <Article />
</Routa>`;

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
          {props.map((prop) => (
            <tr key={prop.name} className="border-b border-border/50">
              <td className="py-2 pr-4 font-mono text-xs text-ink">
                {prop.name}
              </td>
              <td className="py-2 pr-4 font-mono text-xs text-muted">
                {prop.type}
              </td>
              <td className="py-2 text-muted">{prop.desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function RoutaPage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Routa</h1>
        <p className="text-muted">
          Routa is ground frost. Water freezes below the surface, lifts the clay
          into low uneven cells, then breaks it along the walls between them. It
          is relief first and almost still. Nothing floats above the page and
          nothing breathes like fog.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody className="bg-bg pt-0!">
          <RoutaDemo />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>It belongs to savi, not only to savi</CardHeader>
        <CardBody className="flex flex-col gap-3">
          <p className="text-sm text-muted">
            On savi the fissures hold warm dark pigment and the untouched clay
            stays exactly transparent. On a dark ground the same height field
            catches a cold raking key along the lifted cells. The second reading
            works, but the first is why routa exists.
          </p>
          <RoutaDemo
            mode="emissive"
            caption="the same heave on dark ground, caught only where the low key reaches it"
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Cracks, not a cell pattern</CardHeader>
        <CardBody className="flex flex-col gap-3">
          <p className="text-sm text-muted">
            The field uses the distance between the first and second Worley
            neighbours. That value reaches zero on a cell wall, so the seam is
            the structure and the cell interior becomes the heave. Broad noise
            changes how far each patch rises without drawing another pattern on
            top.
          </p>
          <RoutaDemo
            params={{ cellScale: 5.2, crackWidth: 0.038, uneven: 0.5 }}
            caption="smaller cells, finer seams, and a less even lift"
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Almost no motion</CardHeader>
        <CardBody>
          <p className="text-sm text-muted">
            Frost heave is not an ambient pulse. Fissures propagate across the
            first half-minute, then settle instead of looping or breathing. A
            nearly invisible domain drift keeps the final surface from becoming
            a still image. Reduced motion paints the mature frame at
            twenty-seven seconds and stops there.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody className="flex flex-col gap-3">
          <InstallBlock registryName="routa" />
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
          <SourceView filePath="packages/usva/src/atmospheres/routa/routa.tsx" />
          <SourceView filePath="packages/usva/src/atmospheres/routa/routa-field.ts" />
          <SourceView filePath="packages/usva/src/atmospheres/routa/routa-uniforms.ts" />
          <SourceView filePath="packages/usva/src/atmospheres/routa/routa-shader.ts" />
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
