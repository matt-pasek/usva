import { Badge, Card, CardBody, CardHeader, Panel } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";

export const metadata: Metadata = {
  title: "Panel",
  description:
    "The dashboard panel — a full-height card with a mono eyebrow header, icon tile, badge/actions slots, and a loading state.",
};

const props = [
  { name: "title", type: "React.ReactNode", desc: "Panel heading." },
  {
    name: "eyebrow",
    type: "React.ReactNode",
    desc: "Mono uppercase label above the title.",
  },
  {
    name: "icon",
    type: "React.ReactNode",
    desc: "Leading icon, shown in a tile.",
  },
  {
    name: "badge",
    type: "React.ReactNode",
    desc: "Right-aligned status slot.",
  },
  {
    name: "actions",
    type: "React.ReactNode",
    desc: "Right-aligned controls slot.",
  },
  { name: "loading", type: "boolean", desc: "Swaps the body for a spinner." },
  {
    name: "loadingSlot",
    type: "React.ReactNode",
    desc: "Custom loading content.",
  },
];

const usage = `import { Panel, Badge, IconButton } from "@matt-pasek/usva";

<Panel
  eyebrow="overview"
  title="Deployments"
  icon={<RocketIcon />}
  badge={<Badge tone="accent-alt" live>live</Badge>}
  actions={<IconButton aria-label="Refresh"><RefreshIcon /></IconButton>}
>
  {/* body scrolls; panel fills its grid cell */}
</Panel>`;

export default function PanelPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Panel</h1>
        <p className="text-muted">
          The dashboard workhorse — a full-height card with a mono eyebrow
          header, an icon tile, <code>badge</code>/<code>actions</code> slots,
          and a <code>loading</code> state. Built to sit in a grid cell: it
          fills its box and scrolls its own body.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody>
          <div className="h-72">
            <Panel
              eyebrow="overview"
              title="Deployments"
              badge={
                <Badge tone="accent-alt" live>
                  live
                </Badge>
              }
            >
              <p className="text-sm text-muted">
                The header stays fixed; this body scrolls when it overflows.
                Drop it into a bento cell and it fills the height.
              </p>
            </Panel>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody>
          <InstallBlock registryName="panel" />
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
          <SourceView filePath="packages/usva/src/patterns/panel/panel.tsx" />
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
