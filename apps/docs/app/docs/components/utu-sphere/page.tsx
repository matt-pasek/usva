import { Card, CardBody, CardHeader } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";
import { UtuSphereDemo } from "./utu-sphere-demo";

export const metadata: Metadata = {
  title: "Utu Sphere",
  description:
    "Utu Sphere: a luminous fog volume of stacked glowing contour-shells that slowly turns and breathes behind your content.",
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
];

const usage = `import { UtuSphere } from "@matt-pasek/usva";

<UtuSphere className="min-h-svh">
  <Hero />
</UtuSphere>`;

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

export default function UtuSpherePage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Utu Sphere</h1>
        <p className="text-muted">
          Utu is Finnish for the thin haze that hangs at dawn or dusk. This is
          that, made into a hero. A single body of luminous fog, raymarched as
          stacked glowing contour-shells you can see through, slowly turning and
          breathing. It is emissive light, not glass, so it glows from within
          rather than catching a highlight.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody className="bg-bg pt-0!">
          <UtuSphereDemo />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>A brand beat, not a surface to work on</CardHeader>
        <CardBody>
          <p className="text-sm text-muted">
            I reach for this on a landing hero, a splash, a moment meant to be
            felt. It is the loudest wow the library has, so it gets one spot per
            view and never sits behind a table, a form, or anything someone is
            trying to read for long. It is decoration with no meaning of its
            own; hide it and the page still works.
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
          <UtuSphereDemo interactive />
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
          <UtuSphereDemo bands={12} />
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
          <UtuSphereDemo
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
          <UtuSphereDemo opacity={0.5} />
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
          <InstallBlock registryName="utu-sphere" />
          <p className="text-sm text-muted">
            A standalone effect. It pulls in <code>ogl</code> and depends on
            nothing else from the library, so it copies in clean.
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
          <SourceView filePath="packages/usva/src/effects/utu-sphere/utu-sphere.tsx" />
          <SourceView filePath="packages/usva/src/effects/utu-sphere/sphere-shader.ts" />
          <SourceView filePath="packages/usva/src/effects/utu-sphere/sphere.ts" />
          <SourceView filePath="packages/usva/src/effects/utu-sphere/sphere-geometry.ts" />
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
