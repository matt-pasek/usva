import { Card, CardBody, CardHeader } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";
import { SulaFrameDemo } from "./sula-frame-demo";
import { SulaFrameFixedToggle } from "./sula-frame-fixed-toggle";

export const metadata: Metadata = {
  title: "Sula Frame",
  description:
    "Liquid Frame: an animated liquid border that wraps a card or frames the whole page, leaning toward the cursor.",
};

const props = [
  {
    name: "children",
    type: "ReactNode",
    desc: "Wrapped content, in normal flow above the canvas. Optional in fixed mode.",
  },
  {
    name: "fixed",
    type: "boolean",
    desc: "false wraps its own box; true is a position:fixed frame around the whole viewport. Defaults to false.",
  },
  {
    name: "radius",
    type: "number",
    desc: "Corner radius in px. Wrapper mode reads the box's computed border-radius by default; fixed mode scales with the viewport width.",
  },
  {
    name: "thickness",
    type: "number",
    desc: "Band width in px. Defaults to 2.",
  },
  {
    name: "inset",
    type: "number",
    desc: "Gap between the frame and the edge in px. In fixed mode this is the viewport margin. Defaults to 0.",
  },
  {
    name: "fluid",
    type: "boolean",
    desc: "false mounts no canvas; a reduced-motion preference paints the static border instead. Defaults to true.",
  },
  {
    name: "intro",
    type: "boolean",
    desc: "A one-time reveal ramp on mount, so the frame emerges rather than snapping in. Skipped under reduced motion. Defaults to true.",
  },
  {
    name: "accentColor",
    type: "string",
    desc: "Rim light and glow. Defaults to the accent token.",
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
    desc: "0 is flat matte, 1 is the full neon rim. Defaults to the theme.",
  },
];

const usage = `import { SulaFrame } from "@matt-pasek/usva";

// wrap a card
<SulaFrame radius={20} className="rounded-[20px] bg-surface p-8">
  <Pricing />
</SulaFrame>

// or frame the whole page
<SulaFrame fixed inset={12} />`;

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

export default function SulaFramePage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Sula Frame</h1>
        <p className="text-muted">
          A liquid border that hugs a rounded rectangle, calm at rest and coming
          alive under the cursor. Wrap a card to give it a glowing brand edge,
          or set it fixed to frame the whole page. It is the sula family's
          frame, descended from the liquid border on my own site and painted by
          the same field as the rest.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody className="bg-bg pt-0!">
          <SulaFrameDemo />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Two ways to wear it</CardHeader>
        <CardBody>
          <p className="text-sm text-muted">
            By default it is a wrapper: a relative box with the liquid edge
            hugging its measured rounded rect, so the frame tracks the card as
            it resizes. Set <code>fixed</code> and the same edge becomes a{" "}
            <code>position: fixed</code> frame around the viewport, the
            page-chrome use, inset by <code>inset</code>. One liquid surface per
            view is the right dose; it is a wow moment, not dense product
            chrome.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Frame the whole page</CardHeader>
        <CardBody className="flex flex-col gap-3">
          <p className="text-sm text-muted">
            With <code>fixed</code>, the same liquid edge becomes a{" "}
            <code>position: fixed</code> frame around the entire viewport, the
            page-chrome use. Toggle it on and the border wraps this whole tab.
          </p>
          <SulaFrameFixedToggle />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>It leans toward the cursor and the focus</CardHeader>
        <CardBody>
          <p className="text-sm text-muted">
            As the pointer nears an edge, that edge necks and bulges toward it,
            an eased pull so a fast move pushes a wave through the glass rather
            than teleporting it. Focus a control inside a wrapped card and the
            whole ring wakes: it brightens, wobbles, and a highlight sweeps the
            perimeter. Away from the pointer and the focus, it settles to a
            still, faint band.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>The content stays on top and untouched</CardHeader>
        <CardBody>
          <p className="text-sm text-muted">
            The frame is a canvas behind your children, hidden from assistive
            tech and holding no meaning of its own. Everything you wrap renders
            in normal flow above it, fully interactive. It pauses when it
            scrolls offscreen or the tab is backgrounded, so an idle frame costs
            nothing.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>It falls back to a still border, or to nothing</CardHeader>
        <CardBody className="flex flex-col gap-3">
          <p className="text-sm text-muted">
            A <code>prefers-reduced-motion</code> preference,{" "}
            <code>fluid={"{false}"}</code>, or a machine with no WebGL2 paints a
            plain accent border with a soft glow instead of the canvas. The
            frame still reads; it just stops moving.
          </p>
          <SulaFrameDemo fluid={false} />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody className="flex flex-col gap-3">
          <InstallBlock registryName="sula-frame" />
          <p className="text-sm text-muted">
            Pulls in <code>ogl</code> for the renderer, alongside the shared{" "}
            <code>sula-motion</code> and <code>sula-core</code> foundation it
            borrows the material from.
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
          <SourceView filePath="packages/usva/src/sula/sula-frame/sula-frame.tsx" />
          <SourceView filePath="packages/usva/src/sula/sula-frame/frame-geometry.ts" />
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
