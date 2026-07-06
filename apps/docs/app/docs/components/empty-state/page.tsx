import {
  Button,
  Card,
  CardBody,
  CardHeader,
  EmptyState,
} from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";

export const metadata: Metadata = {
  title: "Empty State",
  description:
    "A centered placeholder for empty views, with an optional icon, description, action slot, and solid or dashed variant.",
};

const props = [
  {
    name: "icon",
    type: "React.ReactNode",
    desc: "Optional glyph shown in a rounded badge above the title.",
  },
  {
    name: "title",
    type: "React.ReactNode",
    desc: "The primary message.",
  },
  {
    name: "description",
    type: "React.ReactNode",
    desc: "Optional supporting copy below the title.",
  },
  {
    name: "action",
    type: "React.ReactNode",
    desc: "Optional call-to-action rendered below the description.",
  },
  {
    name: "variant",
    type: '"solid" | "dashed"',
    desc: 'Solid surface or a dashed transparent outline. Defaults to "solid".',
  },
];

const usageSnippet = `import { Button, EmptyState } from "@matt-pasek/usva";

<EmptyState
  title="No projects yet"
  description="Create your first project to get started."
  action={<Button>New project</Button>}
/>`;

export default function EmptyStatePage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Empty State</h1>
        <p className="text-muted">
          A centered placeholder for zero-data views — an optional{" "}
          <code>icon</code> badge, a <code>title</code>, supporting{" "}
          <code>description</code>, and an <code>action</code> slot. The{" "}
          <code>dashed</code> variant reads as an invitation to fill.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody>
          <div className="flex flex-col gap-6">
            <EmptyState
              icon={
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                </svg>
              }
              title="No projects yet"
              description="Create your first project to see it show up here."
              action={<Button>New project</Button>}
            />
            <EmptyState
              variant="dashed"
              title="Nothing pinned"
              description="Pin an item and it will appear in this space."
              action={
                <Button variant="ghost" size="sm">
                  Browse items
                </Button>
              }
            />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody>
          <InstallBlock registryName="empty-state" />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Usage</CardHeader>
        <CardBody>
          <pre className="overflow-x-auto rounded-md border border-border bg-sunken p-3 text-xs text-on-sunken">
            <code>{usageSnippet}</code>
          </pre>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Source</CardHeader>
        <CardBody>
          <SourceView filePath="packages/usva/src/patterns/empty-state/empty-state.tsx" />
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
