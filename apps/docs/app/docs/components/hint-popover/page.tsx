import { Card, CardBody, CardHeader } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";
import { PlainHintDemo, WarningHintDemo } from "./hint-popover-demo";

export const metadata: Metadata = {
  title: "Hint Popover",
  description:
    "A hover and focus popover that may hold interactive content, such as a dismiss button a tooltip could never carry.",
};

const props = [
  {
    name: "trigger",
    type: "React.ReactNode",
    desc: "The element the hint hangs off.",
  },
  { name: "title", type: "React.ReactNode", desc: "Optional bold first line." },
  {
    name: "action",
    type: "React.ReactNode",
    desc: "Interactive footer, typically a dismiss Button.",
  },
  {
    name: "tone",
    type: '"neutral" | "accent" | "success" | "warning" | "danger" | "info"',
    desc: "Tints the panel and the icon.",
  },
  {
    name: "openDelay",
    type: "number",
    desc: "Hover dwell before opening. Defaults to 120ms.",
  },
  {
    name: "closeDelay",
    type: "number",
    desc: "Grace period after the pointer leaves, so it can cross the gap into the panel. Defaults to 200ms.",
  },
];

const usage = `import { HintPopover, Button } from "@matt-pasek/usva";

<HintPopover
  tone="warning"
  title="Prerequisite not met"
  trigger={<Badge tone="warning">2 warnings</Badge>}
  action={<Button size="sm" variant="ghost">Dismiss</Button>}
>
  MATH-201 must be completed before MATH-305.
</HintPopover>`;

export default function HintPopoverPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Hint Popover</h1>
        <p className="text-muted">
          A hover and focus popover that can hold a button. This is not a{" "}
          <code>Tooltip</code> and must not be one: a tooltip is announced
          through <code>aria-describedby</code> and its contents are unreachable
          by keyboard, so a dismiss button inside one is a trap.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody>
          <div className="flex min-h-40 flex-wrap items-center justify-center gap-6">
            <WarningHintDemo />
            <PlainHintDemo />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Why the delays exist</CardHeader>
        <CardBody>
          <p className="text-sm text-muted">
            The panel sits 8px off its trigger. Without a close delay it would
            shut while the pointer crosses that gap, and the action inside would
            be unclickable. Pointer entering the panel cancels the pending
            close. Hover is ignored for touch pointers, where the press opens it
            instead.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody>
          <InstallBlock registryName="hint-popover" />
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
        <CardBody>
          <SourceView filePath="packages/usva/src/primitives/hint-popover/hint-popover.tsx" />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Props</CardHeader>
        <CardBody>
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
                    <td className="py-2 pr-4 font-mono text-xs text-ink">
                      {p.name}
                    </td>
                    <td className="py-2 pr-4 font-mono text-xs text-muted">
                      {p.type}
                    </td>
                    <td className="py-2 text-muted">{p.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </main>
  );
}
