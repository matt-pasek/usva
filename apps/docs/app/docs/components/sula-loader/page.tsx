import { Card, CardBody, CardHeader, SulaLoader } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";
import { SulaLoaderDemo } from "./sula-loader-demo";

export const metadata: Metadata = {
  title: "Sula Loader",
  description:
    "Sula Loader: expressive liquid-glass loading moments built from recoil, gathering, and momentum exchange.",
};

const props = [
  {
    name: "size",
    type: "number",
    desc: "Square side in px. Defaults to 96. The blobs scale off it, so this is the only sizing knob.",
  },
  {
    name: "motion",
    type: '"orbit" | "cluster" | "twin"',
    desc: "orbit relays a released bead; cluster gathers three unequal drops; twin exchanges momentum between two masses. Defaults to orbit.",
  },
  {
    name: "speed",
    type: "number",
    desc: "Loop-rate multiplier. Higher is faster. Defaults to 1.",
  },
  {
    name: "label",
    type: "string",
    desc: 'The status text a screen reader announces. Defaults to "Loading".',
  },
  {
    name: "fluid",
    type: "boolean",
    desc: "false renders a static still and mounts no canvas. Defaults to true.",
  },
  {
    name: "accentColor",
    type: "string",
    desc: "Rim light and glow on the droplets. Defaults to the accent token.",
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

const usage = `import { SulaLoader } from "@matt-pasek/usva";

{isPending ? <SulaLoader label="Loading dashboard" /> : <Dashboard />}`;

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

export default function SulaLoaderPage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Sula Loader</h1>
        <p className="text-muted">
          A loading moment made of liquid glass. Each loop stages one physical
          event on the same field the rest of sula uses: a bead tears free and
          returns, unequal drops gather and scatter, or two masses exchange
          momentum through a bridge.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody className="bg-bg pt-0!">
          <SulaLoaderDemo />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>This is for the big loading moment</CardHeader>
        <CardBody>
          <p className="text-sm text-muted">
            I reach for this when a whole view is waiting: a route change, a
            splash, a panel that has nothing yet, a hero settling in. It is a
            wow beat, so it gets one place on the screen and no more. It is not
            the spinner for a button, a table row, or a field that is
            validating. That work belongs to the plain <code>Spinner</code>,
            which reads faster and does not pull the eye. Keep the liquid for
            where you want the eye pulled.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>It announces itself</CardHeader>
        <CardBody>
          <p className="text-sm text-muted">
            The field is decoration and hidden from assistive tech. The
            component is a <code>role="status"</code> that announces its{" "}
            <code>label</code>, so a screen reader hears "Loading" when it
            appears without ever seeing the glass. Give it a specific label when
            you can: "Loading dashboard" tells someone more than "Loading".
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>It stops when it should</CardHeader>
        <CardBody className="flex flex-col gap-3">
          <p className="text-sm text-muted">
            Unlike the rest of sula, a loader does not settle to rest; it loops
            while it is on screen. So it is careful about it: the loop pauses
            when the tab is backgrounded, and a loader lives only as long as the
            thing it is waiting on, so it unmounts the moment the work lands.
            There is no field left spinning behind a finished page.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>It falls back to a still</CardHeader>
        <CardBody className="flex flex-col gap-3">
          <p className="text-sm text-muted">
            With <code>fluid={"{false}"}</code>, a{" "}
            <code>prefers-reduced-motion</code> preference, or no WebGL2, no
            canvas mounts and no frame loops. You get a single merged still of
            the same droplets, and the status label still announces. A calm
            picture instead of a calm motion.
          </p>
          <div className="flex items-center gap-8 rounded-lg border border-border bg-bg p-6">
            <SulaLoader size={72} motion="orbit" fluid={false} />
            <SulaLoader size={72} motion="cluster" fluid={false} />
            <SulaLoader size={72} motion="twin" fluid={false} />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody className="flex flex-col gap-3">
          <InstallBlock registryName="sula-loader" />
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
          <SourceView filePath="packages/usva/src/sula/sula-loader/sula-loader.tsx" />
          <SourceView filePath="packages/usva/src/sula/sula-loader/loader-geometry.ts" />
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
