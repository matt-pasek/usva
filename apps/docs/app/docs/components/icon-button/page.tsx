import { Card, CardBody, CardHeader, IconButton } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";

export const metadata: Metadata = {
  title: "Icon Button",
  description:
    "A square icon-only button with a self-contained tooltip and an active toggle state, for toolbars and control clusters.",
};

const Gear = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" />
  </svg>
);

const props = [
  {
    name: "aria-label",
    type: "string",
    desc: "Required accessible label (the button is icon-only).",
  },
  {
    name: "tooltip",
    type: "React.ReactNode",
    desc: "Optional visible tooltip on hover/focus.",
  },
  {
    name: "side",
    type: '"top" | "bottom" | "left" | "right"',
    desc: "Tooltip placement. Defaults to top.",
  },
  {
    name: "active",
    type: "boolean",
    desc: "Toggled state — glow ring + accent text.",
  },
  { name: "size", type: '"sm" | "md"', desc: "Defaults to md." },
];

const usage = `import { IconButton } from "@matt-pasek/usva";

<IconButton aria-label="Grid view" tooltip="Grid view" active>
  <GridIcon />
</IconButton>`;

export default function IconButtonPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Icon Button</h1>
        <p className="text-muted">
          A square icon-only button with a built-in tooltip and an{" "}
          <code>active</code> toggle state — the toolbar control that usva
          otherwise only had as separate Button + Tooltip parts.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody>
          <div className="inline-flex items-center gap-2">
            <IconButton aria-label="Settings" tooltip="Settings">
              <Gear />
            </IconButton>
            <IconButton aria-label="Grid" tooltip="Grid view" active>
              <Gear />
            </IconButton>
            <IconButton aria-label="Small" tooltip="Small" size="sm">
              <Gear />
            </IconButton>
            <IconButton
              aria-label="Below"
              tooltip="Tooltip below"
              side="bottom"
            >
              <Gear />
            </IconButton>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody>
          <InstallBlock registryName="icon-button" />
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
          <SourceView filePath="packages/usva/src/primitives/icon-button/icon-button.tsx" />
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
