import { Card, CardBody, CardHeader, Pullquote } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";

export const metadata: Metadata = {
  title: "Pullquote",
  description:
    "A centered pull quote with an optional attribution and a decorative ornament slot above it.",
};

const props = [
  {
    name: "children",
    type: "React.ReactNode",
    desc: "The quote. Rendered as a blockquote.",
  },
  {
    name: "attribution",
    type: "React.ReactNode",
    desc: "When present the whole thing becomes a figure, and this becomes its figcaption.",
  },
  {
    name: "ornament",
    type: "React.ReactNode",
    desc: "Decorative flourish above the quote. Hidden from assistive tech.",
  },
];

const usage = `import { Pullquote } from "@matt-pasek/usva";

<Pullquote attribution="usva, design principles">
  Beauty that stays usable.
</Pullquote>

// kajo passes its FogSphere into the ornament slot
<Pullquote ornament={<FogSphere />}>...</Pullquote>`;

export default function PullquotePage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Pullquote</h1>
        <p className="text-muted">
          A centered pull quote. It renders a bare <code>blockquote</code> when
          unattributed, and a <code>figure</code> with a <code>figcaption</code>{" "}
          when attributed, so the attribution is tied to the quote rather than
          floating beneath it.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody>
          <Pullquote attribution="usva, design principles">
            Beauty that stays usable.
          </Pullquote>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>With an ornament</CardHeader>
        <CardBody>
          <Pullquote
            attribution="usva, design principles"
            ornament={
              <div className="size-full rounded-full bg-accent-tint [filter:drop-shadow(var(--usva-glow-accent))]" />
            }
          >
            Beauty that stays usable.
          </Pullquote>
          <p className="mt-3 text-sm text-muted">
            The ornament is a slot rather than a built-in. kajo puts a WebGL fog
            sphere here, which is Pro-licensed and cannot ship from this
            package. Keeping it a slot is exactly what lets the quote itself be
            public.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody>
          <InstallBlock registryName="pullquote" />
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
          <SourceView filePath="packages/usva/src/patterns/pullquote/pullquote.tsx" />
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
