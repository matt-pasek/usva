"use client";
import {
  type RoadmapMilestone,
  RoadmapTimeline,
  type RoadmapTone,
} from "@matt-pasek/usva/patterns/roadmap-timeline";
import { Playground } from "@/components/docs/playground";

const HEADING_LEVELS = ["h2", "h3", "h4"] as const;

type Config = {
  current: number;
  headingLevel: (typeof HEADING_LEVELS)[number];
  hideTrack: boolean;
  showItems: boolean;
};

const base: Config = {
  current: 2,
  headingLevel: "h3",
  hideTrack: false,
  showItems: true,
};

const templates: Record<string, Config> = {
  "in progress": base,
  "just kicked off": { ...base, current: 1 },
  "shipping soon": { ...base, current: 3 },
  "no track": { ...base, hideTrack: true },
};

type Seed = {
  version: string;
  title: string;
  body: string;
  items: { label: string; featured?: boolean }[];
};

const seeds: Seed[] = [
  {
    version: "0.1",
    title: "Foundations",
    body: "Tokens, themes, and the first five primitives.",
    items: [
      { label: "Semantic token roles" },
      { label: "kajo and sisu themes" },
      { label: "Registry pipeline" },
    ],
  },
  {
    version: "0.2",
    title: "Patterns",
    body: "Composed blocks extracted from two live apps.",
    items: [
      { label: "Bento grid" },
      { label: "Page header", featured: true },
      { label: "Roadmap timeline" },
    ],
  },
  {
    version: "0.3",
    title: "Showcase",
    body: "The motion layer.",
    items: [{ label: "Fog sphere" }, { label: "Page transitions" }],
  },
];

const toneFor = (index: number, current: number): RoadmapTone => {
  const currentIdx = current - 1;
  if (index < currentIdx) return "done";
  if (index === currentIdx) return "current";
  return "planned";
};

const statusFor = (tone: RoadmapTone): string =>
  tone === "done" ? "Shipped" : tone === "current" ? "In progress" : "Planned";

const buildMilestones = (c: Config): RoadmapMilestone[] =>
  seeds.map((seed, index) => {
    const tone = toneFor(index, c.current);
    return {
      version: seed.version,
      status: statusFor(tone),
      title: seed.title,
      body: seed.body,
      tone,
      ...(c.showItems ? { items: seed.items } : {}),
    };
  });

const stringifyItems = (
  items: { label: string; featured?: boolean }[],
): string =>
  items
    .map((item) =>
      item.featured
        ? `{ label: "${item.label}", featured: true }`
        : `{ label: "${item.label}" }`,
    )
    .join(", ");

const snippetFor = (c: Config): string => {
  const milestones = buildMilestones(c);
  const rows = milestones
    .map((m, index) => {
      const seed = seeds[index];
      const items =
        c.showItems && seed ? `, items: [${stringifyItems(seed.items)}]` : "";
      return `    { version: "${m.version}", status: "${m.status}", title: "${m.title}", tone: "${m.tone}"${items} },`;
    })
    .join("\n");
  const attrs = [
    c.headingLevel !== "h3" && `\n  headingLevel="${c.headingLevel}"`,
    c.hideTrack && "\n  hideTrack",
  ]
    .filter(Boolean)
    .join("");
  return `import { RoadmapTimeline } from "@matt-pasek/usva/patterns/roadmap-timeline";

<RoadmapTimeline${attrs}
  milestones={[
${rows}
  ]}
/>`;
};

export function RoadmapTimelineDemo() {
  return (
    <Playground<Config>
      templates={templates}
      stageClassName="w-full"
      fields={[
        {
          kind: "slider",
          key: "current",
          label: "current",
          sub: "which milestone is in progress; earlier ones ship, later ones wait",
          min: 1,
          max: 3,
          step: 1,
        },
        {
          kind: "switch",
          key: "showItems",
          label: "items",
          sub: "the checklist inside each card",
        },
        {
          kind: "switch",
          key: "hideTrack",
          label: "hideTrack",
          sub: "drops the connector track above the cards",
        },
        {
          kind: "select",
          key: "headingLevel",
          label: "headingLevel",
          sub: "level of each milestone title",
          options: HEADING_LEVELS,
        },
      ]}
      snippet={snippetFor}
      render={(c) => (
        <RoadmapTimeline
          milestones={buildMilestones(c)}
          headingLevel={c.headingLevel}
          hideTrack={c.hideTrack}
        />
      )}
    />
  );
}
