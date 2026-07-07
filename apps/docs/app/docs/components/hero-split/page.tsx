import {
  Avatar,
  AvatarGroup,
  Button,
  Card,
  CardBody,
  CardHeader,
  HeroSplit,
} from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";

export const metadata: Metadata = {
  title: "Hero Split",
  description:
    "The landing hero: copy on one side, a product visual on the other, over an optional background slot.",
};

const props = [
  { name: "title", type: "React.ReactNode", desc: "The hero headline." },
  {
    name: "titleAccent",
    type: "React.ReactNode",
    desc: "Second phrase of the title, carrying the accent color.",
  },
  {
    name: "accentColor",
    type: "string",
    desc: "Any CSS color, keyed to the product. Falls back to the accent-alt token.",
  },
  {
    name: "headingLevel",
    type: '"h1" | "h2"',
    desc: "Defaults to h1. One per page.",
  },
  {
    name: "badge",
    type: "React.ReactNode",
    desc: "Pill above the title. Pass an Announcement or a Badge.",
  },
  { name: "body", type: "React.ReactNode", desc: "The lede." },
  {
    name: "actions",
    type: "React.ReactNode",
    desc: "The call to action row. Pass Buttons.",
  },
  {
    name: "proof",
    type: "React.ReactNode",
    desc: "Social proof under the actions. An AvatarGroup with a label does this.",
  },
  { name: "note", type: "React.ReactNode", desc: "Small print." },
  {
    name: "visual",
    type: "React.ReactNode",
    desc: "The product shot. Beside the copy on wide screens, stacked below on narrow.",
  },
  {
    name: "background",
    type: "React.ReactNode",
    desc: "Painted behind everything, under a scrim. A slot, not a built-in effect.",
  },
];

const usage = `import { AvatarGroup, Button, HeroSplit } from "@matt-pasek/usva";

<HeroSplit
  title="Your whole degree,"
  titleAccent="in one place."
  body="Four registries reconciled into one planner."
  actions={<Button>Add to Chrome</Button>}
  proof={<AvatarGroup max={3} label="2,400 active users">{avatars}</AvatarGroup>}
  visual={<MockupShowcase>{/* screenshot */}</MockupShowcase>}
/>`;

const visual = (
  <div className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl bg-ink/[0.04] text-sm text-muted">
    product shot
  </div>
);

export default function HeroSplitPage() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Hero Split</h1>
        <p className="text-muted">
          The landing hero. Copy on one side, a product visual on the other.
          Every part but the title is optional, so it collapses to a headline
          and a button.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody>
          <HeroSplit
            className="px-0 py-4 sm:px-0"
            headingLevel="h2"
            title="Your whole degree,"
            titleAccent="in one place."
            body="Four registries reconciled into one planner. Nothing to configure."
            actions={
              <>
                <Button>Add to Chrome</Button>
                <Button variant="onSurface">Source code</Button>
              </>
            }
            proof={
              <AvatarGroup max={3} tone="accent" label="2,400 active users">
                <Avatar alt="Mateusz Pasek" />
                <Avatar alt="Anna Korhonen" />
                <Avatar alt="Jussi Laine" />
                <Avatar alt="Liisa Virtanen" />
              </AvatarGroup>
            }
            visual={visual}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>The background is a slot</CardHeader>
        <CardBody>
          <p className="text-sm text-muted">
            sisu paints a WebGL <code>Plasma</code> behind this hero. That
            component is provenance-locked, so <code>background</code> is a slot
            rather than a built-in effect. Whatever you pass sits under a scrim
            built from the <code>bg</code> token, so the copy stays legible over
            it. No background, no scrim.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>The proof row is just AvatarGroup</CardHeader>
        <CardBody>
          <p className="text-sm text-muted">
            sisu hand-rolls an avatar stack with a <code>+</code> chip and a
            line of copy. <code>AvatarGroup</code> already collapses overflow
            into <code>+N</code> with <code>max</code>, and already takes a{" "}
            <code>label</code>. No new component was needed.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody>
          <InstallBlock registryName="hero-split" />
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
          <SourceView filePath="packages/usva/src/patterns/hero-split/hero-split.tsx" />
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
