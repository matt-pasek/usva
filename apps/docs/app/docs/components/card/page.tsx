import {
  Button,
  Card,
  CardActions,
  CardBadge,
  CardBody,
  CardEyebrow,
  CardFooter,
  CardHeader,
  CardIcon,
  CardTitle,
} from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";

export const metadata: Metadata = {
  title: "Card",
  description:
    "A composable surface with header, body, and footer regions plus eyebrow, title, icon, badge, and action parts.",
};

const props = [
  {
    name: "interactive",
    type: "boolean",
    desc: "Lift the card on hover with a translate + shadow transition. Defaults to false.",
  },
  {
    name: "row (CardHeader)",
    type: "boolean",
    desc: "Lay the header out as a horizontal row (icon + title + actions) instead of stacked.",
  },
];

const usageSnippet = `import {
  Card, CardHeader, CardIcon, CardEyebrow, CardTitle,
  CardActions, CardBadge, CardBody, CardFooter,
} from "@matt-pasek/usva";

<Card interactive>
  <CardHeader row>
    <CardIcon><BoltIcon /></CardIcon>
    <div className="flex flex-col gap-1">
      <CardEyebrow>Deployment</CardEyebrow>
      <CardTitle>Production build</CardTitle>
    </div>
    <CardActions>
      <CardBadge tone="success">live</CardBadge>
    </CardActions>
  </CardHeader>
  <CardBody>Shipped 4 minutes ago.</CardBody>
  <CardFooter>
    <Button size="sm" variant="outline">View logs</Button>
  </CardFooter>
</Card>`;

export default function CardPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Card</h1>
        <p className="text-muted">
          A composable surface. Combine <code>CardHeader</code> (with the{" "}
          <code>row</code> layout prop), <code>CardBody</code>, and{" "}
          <code>CardFooter</code> with the content parts{" "}
          <code>CardEyebrow</code>, <code>CardTitle</code>,{" "}
          <code>CardIcon</code>, <code>CardActions</code>, and{" "}
          <code>CardBadge</code>. Set <code>interactive</code> to lift the card
          on hover.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody>
          <div className="flex flex-col gap-4">
            <Card interactive>
              <CardHeader row>
                <CardIcon>
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"
                      fill="currentColor"
                    />
                  </svg>
                </CardIcon>
                <div className="flex flex-col gap-1">
                  <CardEyebrow>Deployment</CardEyebrow>
                  <CardTitle>Production build</CardTitle>
                </div>
                <CardActions>
                  <CardBadge tone="success">live</CardBadge>
                </CardActions>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-muted">
                  Shipped 4 minutes ago. Hover to see the interactive lift.
                </p>
              </CardBody>
              <CardFooter>
                <Button size="sm" variant="outline">
                  View logs
                </Button>
                <Button size="sm" variant="ghost">
                  Roll back
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardEyebrow>Overview</CardEyebrow>
                <CardTitle>Stacked header</CardTitle>
              </CardHeader>
              <CardBody>
                <p className="text-sm text-muted">
                  A plain, non-interactive card with a stacked header.
                </p>
              </CardBody>
            </Card>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody>
          <InstallBlock registryName="card" />
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
          <SourceView filePath="packages/usva/src/primitives/card/card.tsx" />
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
