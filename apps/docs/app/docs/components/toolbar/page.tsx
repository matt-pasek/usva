import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Toolbar,
  ToolbarActions,
  ToolbarGroup,
} from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";

export const metadata: Metadata = {
  title: "Toolbar",
  description:
    "A horizontal action bar with role=toolbar, grouped controls on the left and a right-aligned actions cluster.",
};

const props = [
  {
    name: "role",
    type: "string",
    desc: 'Defaults to "toolbar" for assistive tech; override when the bar is purely presentational.',
  },
  {
    name: "className",
    type: "string",
    desc: "Merged onto the flex row (wraps, bottom border, surface background).",
  },
  {
    name: "...div props",
    type: "HTMLAttributes<HTMLDivElement>",
    desc: "Standard div attributes are forwarded to the root.",
  },
];

const usageSnippet = `import {
  Toolbar,
  ToolbarGroup,
  ToolbarActions,
  Button,
  Badge,
} from "@matt-pasek/usva";

<Toolbar>
  <ToolbarGroup>
    <Button size="sm" variant="ghost">Filter</Button>
    <Badge tone="accent">3 active</Badge>
  </ToolbarGroup>
  <ToolbarActions>
    <Button size="sm">New</Button>
  </ToolbarActions>
</Toolbar>`;

export default function ToolbarPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Toolbar</h1>
        <p className="text-muted">
          A horizontal action bar. <code>Toolbar</code> is the{" "}
          <code>role=&quot;toolbar&quot;</code> row; <code>ToolbarGroup</code>{" "}
          clusters related controls, and <code>ToolbarActions</code> pushes a
          trailing group to the right with <code>ml-auto</code>.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody>
          <div className="overflow-hidden rounded-lg border border-border">
            <Toolbar>
              <ToolbarGroup>
                <Button size="sm" variant="ghost">
                  Filter
                </Button>
                <Button size="sm" variant="ghost">
                  Sort
                </Button>
                <Badge tone="accent">3 active</Badge>
              </ToolbarGroup>
              <ToolbarGroup>
                <Badge tone="neutral" mono>
                  All
                </Badge>
                <Badge tone="success">Live</Badge>
                <Badge tone="warning">Draft</Badge>
              </ToolbarGroup>
              <ToolbarActions>
                <Button size="sm" variant="soft">
                  Export
                </Button>
                <Button size="sm">New project</Button>
              </ToolbarActions>
            </Toolbar>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody>
          <InstallBlock registryName="toolbar" />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Usage</CardHeader>
        <CardBody>
          <pre className="overflow-x-auto rounded-md border border-border bg-surface-2 p-3 text-xs text-ink">
            <code>{usageSnippet}</code>
          </pre>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Source</CardHeader>
        <CardBody>
          <SourceView filePath="packages/usva/src/patterns/toolbar/toolbar.tsx" />
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
