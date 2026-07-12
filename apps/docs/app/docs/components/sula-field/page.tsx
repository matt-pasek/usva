import { Card, CardBody, CardHeader } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";
import { SulaFieldDemo } from "./sula-field-demo";

export const metadata: Metadata = {
  title: "Sula Field",
  description:
    "Sula Field: an edge-composed veil of slow liquid-glass masses around your content.",
};

const props = [
  {
    name: "children",
    type: "ReactNode",
    desc: "Rendered on top of the field, in normal flow. Omit it for a bare background layer you position yourself.",
  },
  {
    name: "speed",
    type: "number",
    desc: "Drift-rate multiplier. Higher drifts faster. Defaults to 1.",
  },
  {
    name: "interactive",
    type: "boolean",
    desc: "When on, the field leans toward the eased cursor. Off by default, because a background should not compete with what sits on it.",
  },
  {
    name: "seed",
    type: "number",
    desc: "Reproduces the same wander for a given value, so the drift is stable across renders and SSR. Defaults to 0.",
  },
  {
    name: "fluid",
    type: "boolean",
    desc: "false mounts no canvas; a reduced-motion preference paints one static frame instead. Defaults to true.",
  },
  {
    name: "accentColor",
    type: "string",
    desc: "Rim light and glow on the blobs. Defaults to the accent token.",
  },
  {
    name: "backdrop",
    type: "string",
    desc: "The colour the glass tints against. Defaults to the bg token.",
  },
  {
    name: "tint",
    type: "string",
    desc: "The glass itself. Defaults to the surface-2 token.",
  },
  {
    name: "shine",
    type: "number",
    desc: "0 is flat matte glass, 1 is the full neon rim. Defaults to the theme.",
  },
];

const usage = `import { SulaField } from "@matt-pasek/usva";

<SulaField className="min-h-svh">
  <Hero />
</SulaField>`;

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

export default function SulaFieldPage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Sula Field</h1>
        <p className="text-muted">
          An ambient background composed around your content in two layers. Dark
          anchors heave slowly behind, lit actors and glints drift and kiss in
          front, and a faint aurora glows from one corner. Your children stay
          crisp, interactive, and in normal flow above the field.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody className="bg-bg pt-0!">
          <SulaFieldDemo />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>This is atmosphere, not a surface to work on</CardHeader>
        <CardBody>
          <p className="text-sm text-muted">
            I reach for this behind a landing hero, a section break, a splash, a
            place where I want depth and a little life. It is a mood, and it is
            the loudest thing sula does, so it gets one spot per view. It is not
            for a background you read against for long, or anywhere someone is
            trying to get work done. The drift is soft on purpose, but a moving
            field behind a table is still a moving field behind a table.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>The content stays on top and untouched</CardHeader>
        <CardBody>
          <p className="text-sm text-muted">
            The field is a canvas behind your children, hidden from assistive
            tech and holding no meaning of its own. Everything you pass renders
            in normal flow above it, fully interactive, exactly as it would with
            no field at all. Switch the field off and the layout does not move.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>It drifts, but it is not greedy</CardHeader>
        <CardBody>
          <p className="text-sm text-muted">
            An ambient field is the one part of sula that never parks; it keeps
            drifting while it is in view. So it watches: the loop stops when the
            field scrolls offscreen and when the tab is backgrounded, and picks
            back up when it returns. The drift is seeded, so a given{" "}
            <code>seed</code> always wanders the same way, which keeps the
            server and the client in agreement.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>It can lean toward the cursor</CardHeader>
        <CardBody className="flex flex-col gap-3">
          <p className="text-sm text-muted">
            With <code>interactive</code>, the nearby surface leans toward the
            eased pointer, so it feels alive under the hand without chasing it.
            It is off by default because the field should frame the content, not
            compete with it. Turn it on for a hero where the material is part of
            the moment.
          </p>
          <SulaFieldDemo interactive />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>It falls back to a still, or to nothing</CardHeader>
        <CardBody className="flex flex-col gap-3">
          <p className="text-sm text-muted">
            A <code>prefers-reduced-motion</code> preference paints one static
            composed frame with no loop: a calm picture instead of a calm drift.
            With <code>fluid={"{false}"}</code>, or on a machine with no WebGL2,
            no canvas mounts at all and the background is just the surface. The
            content reads the same either way.
          </p>
          <SulaFieldDemo fluid={false} />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody className="flex flex-col gap-3">
          <InstallBlock registryName="sula-field" />
          <p className="text-sm text-muted">
            Pulls in <code>ogl</code> for the field, alongside the shared{" "}
            <code>sula-motion</code> and <code>sula-core</code> foundation.
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
          <SourceView filePath="packages/usva/src/sula/sula-field/sula-field.tsx" />
          <SourceView filePath="packages/usva/src/sula/sula-field/field-geometry.ts" />
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
