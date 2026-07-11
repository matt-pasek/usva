import { Card, CardBody, CardHeader } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";
import { SulaFabDemo } from "./sula-fab-demo";

export const metadata: Metadata = {
  title: "Sula Fab",
  description:
    "Sula Fab: a floating action button whose child actions emerge as liquid beads that neck off the trigger, travel to their slots, and settle.",
};

const props = [
  {
    name: "actions",
    type: "SulaFabAction[]",
    desc: "Each entry is { icon, label, onClick?, href? }. The beads are icon-only; the label is the accessible name and the tooltip.",
  },
  {
    name: "icon",
    type: "ReactNode",
    desc: "The trigger glyph. Defaults to a plus.",
  },
  {
    name: "label",
    type: "string",
    desc: 'The trigger\'s accessible name. Defaults to "Actions".',
  },
  {
    name: "open",
    type: "boolean",
    desc: "Controlled: whether the speed dial is open. Drive it from your own state.",
  },
  {
    name: "defaultOpen",
    type: "boolean",
    desc: "Uncontrolled: whether it starts open. Defaults to false.",
  },
  {
    name: "onOpenChange",
    type: "(open: boolean) => void",
    desc: "Fires whenever the open state changes, by click, by Escape, or on an action.",
  },
  {
    name: "layout",
    type: '"line" | "arc"',
    desc: "line stacks the beads along direction; arc fans them upward. Defaults to line.",
  },
  {
    name: "direction",
    type: '"up" | "down" | "left" | "right"',
    desc: "Which way a line layout opens. Defaults to up.",
  },
  {
    name: "tooltipPosition",
    type: '"left" | "right" | "top"',
    desc: "Where action tooltips appear. Defaults to left for line layouts and top for arc layouts.",
  },
  {
    name: "gap",
    type: "number",
    desc: "Constant edge gap in px between the trigger and beads, and between beads. Defaults to 12. Raise it for touch. Bead size itself comes from the action button classes, not this prop.",
  },
  {
    name: "fluid",
    type: "boolean",
    desc: "false renders a plain stacked menu and mounts no canvas. Defaults to true.",
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
    desc: "Rim light and glow on the beads. Defaults to the accent token.",
  },
  {
    name: "shine",
    type: "number",
    desc: "0 is flat matte glass, 1 is the full neon rim. Defaults to the theme.",
  },
];

const usage = `import { SulaFab } from "@matt-pasek/usva";

<SulaFab
  label="Create"
  actions={[
    { icon: <PlusIcon />, label: "New note", onClick: newNote },
    { icon: <ListIcon />, label: "New list", onClick: newList },
    { icon: <MailIcon />, label: "Message", href: "/compose" },
  ]}
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

export default function SulaFabPage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Sula Fab</h1>
        <p className="text-muted">
          A floating action button whose child actions are liquid beads. Open it
          and each bead necks off the trigger, travels to its slot on a thinning
          thread, and settles; close it and the beads pinch back in. The beads
          are icon-only, and each one names itself with a tooltip on hover and
          focus.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody className="bg-bg pt-0!">
          <SulaFabDemo />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>This is a brand-surface primary action</CardHeader>
        <CardBody>
          <p className="text-sm text-muted">
            I reach for this when a page has one clear thing to do and I want the
            doing of it to feel good: a compose button on a writing app, a create
            button on a portfolio dashboard. It is a single primary action with a
            few close relatives. It is not for dense toolbars or a drawer of a
            dozen commands, where a plain menu reads faster and the liquid becomes
            noise.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>The beads are real buttons</CardHeader>
        <CardBody>
          <p className="text-sm text-muted">
            Each action is a real <code>button</code> (or an <code>a</code> when
            you pass <code>href</code>), positioned at its slot and moved to match
            its blob every frame. While the dial is closed the beads are{" "}
            <code>inert</code> and hidden from assistive tech, so they never land
            in the tab order. Open it and focus moves to the first action;{" "}
            <code>Escape</code> closes it and returns focus to the trigger.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>It falls back to a plain menu</CardHeader>
        <CardBody className="flex flex-col gap-3">
          <p className="text-sm text-muted">
            With <code>fluid={"{false}"}</code>, a{" "}
            <code>prefers-reduced-motion</code> preference, or a machine with no
            WebGL2, no canvas mounts. The actions become a plain stacked menu that
            fades and slides in along <code>direction</code>. Fully operable with
            zero WebGL, and the server always renders this path so there is no
            hydration mismatch.
          </p>
          <div className="rounded-lg border border-border bg-bg p-4">
            <SulaFabDemo fluid={false} />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Line or arc</CardHeader>
        <CardBody className="flex flex-col gap-3">
          <p className="text-sm text-muted">
            A line stacks the beads along <code>direction</code>; an arc fans them
            across a span around it. Spacing is a constant edge gap: the{" "}
            <code>gap</code> prop is the px between the trigger and the first bead,
            and between each bead, whatever their sizes. The slot geometry is
            derived from the count, never authored per action, so adding an action
            just reflows the fan.
          </p>
          <p className="text-sm text-muted">
            Bead size comes from the action button classes, and the trigger from
            its own, so the field measures the real elements and lays them out to
            match. For touch, raise <code>gap</code> and enlarge those targets;
            this demo widens the gap on small, coarse-pointer screens.
          </p>
          <div className="rounded-lg border border-border bg-bg p-4">
            <SulaFabDemo layout="arc" />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>It costs nothing at rest</CardHeader>
        <CardBody>
          <p className="text-sm text-muted">
            The render loop parks itself the moment the open or close spring
            settles, and wakes on the next toggle, a resize, or a font swap. A
            closed dial paints one pill and stops.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody className="flex flex-col gap-3">
          <InstallBlock registryName="sula-fab" />
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
          <SourceView filePath="packages/usva/src/sula/sula-fab/sula-fab.tsx" />
          <SourceView filePath="packages/usva/src/sula/sula-fab/fab-geometry.ts" />
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
