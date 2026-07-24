import type { Metadata } from "next";
import { AcquireSection } from "@/components/docs/acquire-section";
import { ComponentDoc } from "@/components/docs/component-doc";
import { PropsTable } from "@/components/docs/props-table";
import { pageMetadata } from "@/lib/site";
import { RoadmapTimelineDemo } from "./roadmap-timeline-demo";

export const metadata: Metadata = pageMetadata(
  "/docs/components/roadmap-timeline",
  {
    title: "Roadmap Timeline",
    description:
      "What shipped, what is in flight, what is planned, joined by a connector track that fills up to wherever you are now.",
  },
);

const props = [
  {
    name: "milestones",
    type: "RoadmapMilestone[]",
    desc: "each one is { version, status, title, body, items, tone }.",
  },
  {
    name: "tone",
    type: '"done" | "current" | "planned"',
    defaultValue: '"planned"',
    desc: (
      <>
        per milestone. <b>semantic, not decorative</b>: it drives the connector
        fill, the card weight and the marker.
      </>
    ),
  },
  {
    name: "items",
    type: "{ label, featured? }[]",
    desc: "a featured item drops its marker and gets its own accent card.",
  },
  {
    name: "markerIcon",
    type: "ReactNode",
    desc: "replaces the tick drawn inside a shipped item's marker.",
  },
  {
    name: "headingLevel",
    type: '"h2" | "h3" | "h4"',
    defaultValue: '"h3"',
    desc: "level of each milestone title. pick it to fit the page outline.",
  },
  {
    name: "hideTrack",
    type: "boolean",
    defaultValue: "false",
    desc: "hides the connector track above the cards.",
  },
];

export default function RoadmapTimelinePage() {
  return (
    <ComponentDoc
      slug="roadmap-timeline"
      description={
        <>
          shipped, in progress and next, as one row of cards under a connector
          track that fills up to where you are now.
        </>
      }
      composition={{
        ok: [
          "a landing page roadmap or a docs release board",
          "any milestone count; node positions come from the count",
        ],
        no: [
          "not a changelog. a milestone holds a handful of items, not a log",
          "at most one current milestone. the fill stops at the first it finds",
        ],
      }}
      a11y={
        <>
          milestones are an ordered list with real headings · the track is{" "}
          <code className="font-mono text-xs">aria-hidden</code>, the status
          pills say the same thing in words
        </>
      }
    >
      <RoadmapTimelineDemo />

      <PropsTable rows={props} />

      <AcquireSection
        registryName="roadmap-timeline"
        usage={`import { RoadmapTimeline } from "@matt-pasek/usva";

<RoadmapTimeline
  milestones={[
    { version: "0.1", status: "Shipped", title: "Foundations", tone: "done" },
    { version: "0.2", status: "In progress", title: "Patterns", tone: "current" },
    { version: "0.3", status: "Planned", title: "Showcase", tone: "planned" },
  ]}
/>`}
      />
    </ComponentDoc>
  );
}
