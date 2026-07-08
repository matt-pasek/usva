import {
  Card,
  CardBody,
  CardHeader,
  type RoadmapMilestone,
  RoadmapTimeline,
} from "@matt-pasek/usva";
import type { Metadata } from "next";
import { InstallBlock } from "@/components/install-block";
import { SourceView } from "@/components/source-view";

export const metadata: Metadata = {
  title: "Roadmap Timeline",
  description:
    "A status board of milestones, joined by a connector track that fills up to wherever you are now.",
};

const milestones: RoadmapMilestone[] = [
  {
    version: "0.1",
    status: "Shipped",
    title: "Foundations",
    body: "Tokens, themes, and the first five primitives.",
    tone: "done",
    items: [
      { label: "Semantic token roles" },
      { label: "kajo and sisu themes" },
      { label: "Registry pipeline" },
    ],
  },
  {
    version: "0.2",
    status: "In progress",
    title: "Patterns",
    body: "Composed blocks extracted from two live apps.",
    tone: "current",
    items: [
      { label: "Bento grid" },
      { label: "Page header", featured: true },
      { label: "Roadmap timeline" },
    ],
  },
  {
    version: "0.3",
    status: "Planned",
    title: "Showcase",
    body: "The motion layer.",
    tone: "planned",
    items: [{ label: "Fog sphere" }, { label: "Page transitions" }],
  },
];

const props = [
  {
    name: "milestones",
    type: "RoadmapMilestone[]",
    desc: "Each one is { version, status, title, body, items, tone }.",
  },
  {
    name: "tone",
    type: '"done" | "current" | "planned"',
    desc: "Per milestone. Semantic, not decorative: it drives the connector fill.",
  },
  {
    name: "items",
    type: "{ label, featured? }[]",
    desc: "A featured item drops its marker and gets its own accent card.",
  },
  {
    name: "markerIcon",
    type: "React.ReactNode",
    desc: "Replaces the tick drawn inside a shipped item's marker.",
  },
  {
    name: "headingLevel",
    type: '"h2" | "h3" | "h4"',
    desc: "Level of each milestone title. Defaults to h3.",
  },
  {
    name: "hideTrack",
    type: "boolean",
    desc: "Hides the connector track above the cards.",
  },
];

const usage = `import { RoadmapTimeline } from "@matt-pasek/usva";

<RoadmapTimeline
  milestones={[
    { version: "0.1", status: "Shipped", title: "Foundations", tone: "done",
      items: [{ label: "Semantic token roles" }] },
    { version: "0.2", status: "In progress", title: "Patterns", tone: "current",
      items: [{ label: "Page header", featured: true }] },
    { version: "0.3", status: "Planned", title: "Showcase", tone: "planned" },
  ]}
/>`;

export default function RoadmapTimelinePage() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 p-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold text-ink">Roadmap Timeline</h1>
        <p className="text-muted">
          A status board of what shipped, what is being built, and what comes
          next. The cards are an ordered list, and a connector track above them
          fills up to wherever you are now.
        </p>
      </div>

      <Card>
        <CardHeader>Demo</CardHeader>
        <CardBody className="bg-bg">
          <RoadmapTimeline milestones={milestones} />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>The track is derived, not hardcoded</CardHeader>
        <CardBody>
          <p className="text-sm text-muted">
            Node positions come from the milestone count, so four columns work
            as well as three. The filled segment runs to the{" "}
            <code>current</code> milestone, or to the last <code>done</code> one
            if nothing is current, and does not draw at all before anything has
            shipped. The whole track is <code>aria-hidden</code>: the status
            pills already say the same thing in words.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Tone is semantic</CardHeader>
        <CardBody>
          <p className="text-sm text-muted">
            <code>tone</code> is a three-way union, not a color. It says where a
            milestone stands, and the component decides how that looks: the
            current card is accented and slightly larger, planned items lose
            their tick and drop to <code>faint</code>.
          </p>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>Install</CardHeader>
        <CardBody>
          <InstallBlock registryName="roadmap-timeline" />
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
          <SourceView filePath="packages/usva/src/patterns/roadmap-timeline/roadmap-timeline.tsx" />
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
