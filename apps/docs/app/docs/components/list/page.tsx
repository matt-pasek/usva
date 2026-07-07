import { Card, CardBody, CardHeader, List, ListItem } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";

export const metadata: Metadata = {
  title: "List",
  description:
    "A semantic list with a decorative marker slot and an optional divider between items.",
};

const props = [
  {
    name: "as",
    type: '"ul" | "ol"',
    desc: 'The list element. Defaults to "ul". Pick by whether the order carries meaning.',
  },
  {
    name: "marker",
    type: "React.ReactNode",
    desc: "Decorative marker rendered on every item, hidden from assistive tech. An item may override it.",
  },
  {
    name: "divided",
    type: "boolean",
    desc: "Rule between items, stopping at the last one.",
  },
  {
    name: "ListItem marker",
    type: "React.ReactNode",
    desc: "Overrides the list's shared marker for this item alone.",
  },
];

const usage = `import { List, ListItem } from "@matt-pasek/usva";

<List marker={<CheckIcon />} divided>
  <ListItem>Runs entirely on your machine</ListItem>
  <ListItem>No tracking, no analytics</ListItem>
</List>`;

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <title>Check</title>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export default function ListPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">List</h1>
        <p className="text-muted">
          A real <code>ul</code> or <code>ol</code>. The marker is decoration
          and is hidden from screen readers, so the text carries the meaning on
          its own.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody>
          <List marker={<CheckIcon />} divided>
            <ListItem>Runs entirely on your machine</ListItem>
            <ListItem>No tracking, no analytics</ListItem>
            <ListItem>Open source, end to end</ListItem>
          </List>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>The marker is not content</CardHeader>
        <CardBody>
          <p className="text-sm text-muted">
            A tick beside "No tracking" means the item is true, and a screen
            reader that announces the tick as an image adds nothing. The marker
            is <code>aria-hidden</code>. If the marker is the only thing
            distinguishing two items, it is content, and it belongs in the text.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody>
          <InstallBlock registryName="list" />
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
          <SourceView filePath="packages/usva/src/primitives/list/list.tsx" />
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
