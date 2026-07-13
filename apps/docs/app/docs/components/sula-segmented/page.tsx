import { Card, CardBody, CardHeader } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";
import { SulaSegmentedDemo } from "./sula-segmented-demo";

export const metadata: Metadata = {
  title: "Sula Segmented",
  description:
    "Sula Segmented: a segmented control whose active indicator is a liquid droplet. It pinches off the old segment, travels, and merges into the new one.",
};

const props = [
  {
    name: "items",
    type: "SulaSegmentedItem[]",
    desc: "Each entry is { value, label, icon? }. The segments are real buttons, measured at rest.",
  },
  {
    name: "value",
    type: "string",
    desc: "Controlled: the selected value. Drive it from your own state.",
  },
  {
    name: "defaultValue",
    type: "string",
    desc: "Uncontrolled: the value selected on mount. Defaults to the first item.",
  },
  {
    name: "onValueChange",
    type: "(value: string) => void",
    desc: "Fires when a segment is picked, by click or by arrow key.",
  },
  {
    name: "size",
    type: '"sm" | "md"',
    desc: "The segment height and padding. Defaults to md.",
  },
  {
    name: "fluid",
    type: "boolean",
    desc: "false renders the plain sliding pill and mounts no canvas. Defaults to true.",
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
    name: "accentColor",
    type: "string",
    desc: "Rim light and glow. Defaults to the accent token.",
  },
  {
    name: "shine",
    type: "number",
    desc: "0 is flat matte glass, 1 is the full neon rim. Defaults to the theme.",
  },
];

const usage = `import { SulaSegmented } from "@matt-pasek/usva";

<SulaSegmented
  items={[
    { value: "kajo", label: "Kajo" },
    { value: "sisu", label: "Sisu" },
    { value: "system", label: "System" },
  ]}
  value={theme}
  onValueChange={setTheme}
/>`;

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

export default function SulaSegmentedPage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Sula Segmented</h1>
        <p className="text-muted">
          A segmented control whose active indicator is a liquid droplet. Pick a
          new segment and a drop pinches off the old pill, travels across on a
          thinning neck, and merges into the new one. The segments themselves
          are crisp DOM buttons; only the indicator is painted by the field.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody className="bg-bg pt-0!">
          <SulaSegmentedDemo />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>This is the brand-surface control</CardHeader>
        <CardBody>
          <p className="text-sm text-muted">
            I reach for this on a brand surface: a theme switcher on a
            portfolio, a view toggle on a hero. It mirrors the plain{" "}
            <code>SegmentedControl</code> exactly, keyboard and semantics and
            all, so it stays a segmented control first and a liquid effect
            second. For dense or task-bound UI, a dashboard filter or a settings
            row, use the plain <code>SegmentedControl</code>. That is where the
            effect would be noise, not delight.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>It falls back to a plain pill</CardHeader>
        <CardBody className="flex flex-col gap-3">
          <p className="text-sm text-muted">
            With <code>fluid={"{false}"}</code>, a{" "}
            <code>prefers-reduced-motion</code> preference, or a machine with no
            WebGL2, no canvas mounts and the indicator becomes a plain
            absolutely positioned pill that slides on a transition. Fully usable
            with zero WebGL, and the server always renders this path so there is
            no hydration mismatch.
          </p>
          <div className="rounded-lg border border-border bg-bg p-4">
            <SulaSegmentedDemo fluid={false} />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>It costs nothing at rest</CardHeader>
        <CardBody>
          <p className="text-sm text-muted">
            The render loop parks itself the moment the switch settles, and
            wakes on a resize, a font swap, or the next selection. At rest the
            field paints a single firm pill under the active segment and then
            stops.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody className="flex flex-col gap-3">
          <InstallBlock registryName="sula-segmented" />
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
          <SourceView filePath="packages/usva/src/sula/sula-segmented/sula-segmented.tsx" />
          <SourceView filePath="packages/usva/src/sula/sula-segmented/segmented-geometry.ts" />
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
