import {
  Badge,
  Card,
  CardBody,
  CardHeader,
  StripeCard,
} from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";

export const metadata: Metadata = {
  title: "Stripe Card",
  description:
    "A compact entity row-card with a leading color stripe, heading, mono meta, badge, and footer — flat at rest, lifts on hover.",
};

const props = [
  { name: "heading", type: "React.ReactNode", desc: "The primary title." },
  {
    name: "metaLeft",
    type: "React.ReactNode",
    desc: "Mono meta, left (e.g. a code).",
  },
  {
    name: "metaRight",
    type: "React.ReactNode",
    desc: "Mono meta, right — accent-colored.",
  },
  { name: "badge", type: "React.ReactNode", desc: "Top-right badge slot." },
  { name: "footer", type: "React.ReactNode", desc: "Bottom bar slot." },
  {
    name: "stripeColor",
    type: "string",
    desc: "Leading stripe color (any CSS color).",
  },
  { name: "selected", type: "boolean", desc: "Swaps to the accent glow ring." },
];

const usage = `import { StripeCard, Badge } from "@matt-pasek/usva";

<StripeCard
  heading="Algorithms & Data Structures"
  metaLeft="CS-201"
  metaRight="5 cr"
  stripeColor="var(--color-accent)"
  badge={<Badge tone="accent-alt">enrolled</Badge>}
  footer="Autumn 2026 · Prof. Turing"
/>`;

export default function StripeCardPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Stripe Card</h1>
        <p className="text-muted">
          A compact entity row-card: a leading color stripe categorizes it, a
          heading + mono meta identify it, and <code>badge</code>/
          <code>footer</code> slots round it out. Flat at rest, it lifts on
          hover; <code>selected</code> swaps to the accent glow ring.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody>
          <div className="grid gap-3 sm:grid-cols-2">
            <StripeCard
              heading="Algorithms & Data Structures"
              metaLeft="CS-201"
              metaRight="5 cr"
              stripeColor="var(--color-accent)"
              badge={<Badge tone="accent-alt">enrolled</Badge>}
              footer="Autumn 2026 · Prof. Turing"
            />
            <StripeCard
              heading="Discrete Mathematics"
              metaLeft="MA-140"
              metaRight="4 cr"
              stripeColor="var(--color-accent-alt)"
              selected
            />
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody>
          <InstallBlock registryName="stripe-card" />
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
          <SourceView filePath="packages/usva/src/patterns/stripe-card/stripe-card.tsx" />
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
