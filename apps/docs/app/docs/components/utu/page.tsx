import { Card, CardBody, CardHeader } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";
import { UtuDemo } from "./utu-demo";

export const metadata: Metadata = {
  title: "Utu",
  description:
    "Utu: luminous contour fog on dark ground, reinterpreted as damp soaking into savi clay.",
};

const props = [
  {
    name: "children",
    type: "ReactNode",
    desc: "Rendered on top of the field, in normal flow. Omit it for a bare hero orb you position yourself.",
  },
  {
    name: "speed",
    type: "number",
    desc: "Rotation and breath rate multiplier. Higher turns faster. Defaults to 1.",
  },
  {
    name: "interactive",
    type: "boolean",
    desc: "When on, the volume leans toward the eased cursor. Off by default, because a hero should not chase the pointer.",
  },
  {
    name: "bands",
    type: "number",
    desc: "How many glowing contour-shells stack through the body. Defaults to about 5.",
  },
  {
    name: "colors",
    type: "{ deep?; mid?; hot? }",
    desc: "Override any stop of the dawn gradient with a CSS colour. By default the sphere runs violet valleys, a magenta body, and warm-gold cores, a glow on the horizon rather than one flat tint.",
  },
  {
    name: "accentColor",
    type: "string",
    desc: "Collapse the dawn gradient to a single brand colour instead, sunk to black in the valleys and blown toward white at the cores.",
  },
  {
    name: "opacity",
    type: "number",
    desc: "Overall opacity of the fog, 0 to 1. Lower lets more of the page through. Defaults to 1.",
  },
  {
    name: "mode",
    type: '"emissive" | "absorptive"',
    desc: "Overrides the material. By default a dark ground emits fog and a light ground holds a damp stain.",
  },
];

const usage = `import { Utu } from "@matt-pasek/usva";

<Utu className="min-h-svh">
  <Hero />
</Utu>`;

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

export default function UtuPage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Utu</h1>
        <p className="text-muted">
          Utu is light water vapor suspended in the air, especially in the early
          morning or lingering over lakes and fields. This is that, made into a
          field. On dark ground it is a single body of luminous fog, raymarched
          as stacked contour-shells you can see through. On savi the same
          density becomes damp soaking into clay, darker where the fog was
          thickest and exactly transparent where the ground stayed dry.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody className="bg-bg pt-0!">
          <UtuDemo />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Fog in the dark, damp in daylight</CardHeader>
        <CardBody className="flex flex-col gap-3">
          <p className="text-sm text-muted">
            The marcher already tracks how much light survives each density
            sample. On savi that optical depth becomes stain coverage instead of
            a radiance sum. There is no normal field and no relief because a
            volume has no single surface to light.
          </p>
          <UtuDemo
            mode="absorptive"
            caption="the same density read as quiet damp, with no pale fog painted over the clay"
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>The luminous version is a brand beat</CardHeader>
        <CardBody>
          <p className="text-sm text-muted">
            On a dark theme I reach for this on a landing hero, a splash, or a
            moment meant to be felt. The glow gets one spot per view and never
            sits behind a table or form. The savi stain is the quieter material
            double, calm enough to sit behind longer reading.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>The content stays on top and untouched</CardHeader>
        <CardBody>
          <p className="text-sm text-muted">
            The fog is a canvas behind your children, hidden from assistive
            tech. Everything you pass renders in normal flow above it, fully
            interactive and crisp, exactly as it would with no sphere at all.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>It turns and breathes on its own</CardHeader>
        <CardBody>
          <p className="text-sm text-muted">
            The body rotates on a slow helix and inhales gently, its contours
            warping as the noise field drifts through them. The loop stops when
            the sphere scrolls offscreen and when the tab is backgrounded, and
            picks back up when it returns.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>It can lean toward the cursor</CardHeader>
        <CardBody className="flex flex-col gap-3">
          <p className="text-sm text-muted">
            With <code>interactive</code>, the volume eases a lean toward the
            pointer, so it feels alive under the hand without chasing it. It is
            off by default because the hero should frame the content, not
            compete with it.
          </p>
          <UtuDemo interactive />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>You can stack the shells tighter</CardHeader>
        <CardBody className="flex flex-col gap-3">
          <p className="text-sm text-muted">
            <code>bands</code> sets how many glowing contour-shells the body
            reads as. More bands is a denser, more topographic weave; fewer is
            broad and calm.
          </p>
          <UtuDemo bands={12} />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Dawn by default, or any palette you like</CardHeader>
        <CardBody className="flex flex-col gap-3">
          <p className="text-sm text-muted">
            Out of the box it runs a dawn gradient: cool violet in the valleys,
            magenta through the body, warm gold at the cores, so it reads as a
            glow on the horizon rather than one flat colour. Pass{" "}
            <code>colors</code> to retune any stop, or <code>accentColor</code>{" "}
            to collapse it to a single brand hue.
          </p>
          <UtuDemo
            colors={{ deep: "#0f2a4a", mid: "#1f9e8a", hot: "#eaf39a" }}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>It can step back so the content leads</CardHeader>
        <CardBody className="flex flex-col gap-3">
          <p className="text-sm text-muted">
            <code>opacity</code> dials the whole fog down, letting more of the
            page through when the sphere should be a whisper behind dense words
            rather than the loudest thing on screen.
          </p>
          <UtuDemo opacity={0.5} />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>It falls back to a still, or to nothing</CardHeader>
        <CardBody>
          <p className="text-sm text-muted">
            A <code>prefers-reduced-motion</code> preference paints one static
            frame with no loop. On a machine with no WebGL2 the canvas never
            mounts and the background is just the surface. The content reads the
            same either way.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody className="flex flex-col gap-3">
          <InstallBlock registryName="utu" />
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
          <SourceView filePath="packages/usva/src/atmospheres/utu/utu.tsx" />
          <SourceView filePath="packages/usva/src/atmospheres/utu/utu-shader.ts" />
          <SourceView filePath="packages/usva/src/atmospheres/utu/utu-uniforms.ts" />
          <SourceView filePath="packages/usva/src/atmospheres/utu/utu-field.ts" />
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
