import type { Meta, StoryObj } from "@storybook/react-vite";
import type { RoadmapMilestone } from "./roadmap-timeline.js";
import { RoadmapTimeline } from "./roadmap-timeline.js";

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

const meta: Meta<typeof RoadmapTimeline> = {
  title: "Patterns/RoadmapTimeline",
  component: RoadmapTimeline,
  tags: ["autodocs"],
  argTypes: {
    headingLevel: {
      control: { type: "select" },
      options: ["h2", "h3", "h4"],
    },
    hideTrack: { control: { type: "boolean" } },
  },
  args: {
    milestones,
    headingLevel: "h3",
    hideTrack: false,
  },
};
export default meta;

type Story = StoryObj<typeof RoadmapTimeline>;

export const Default: Story = {};

export const FourColumns: Story = {
  args: {
    milestones: [
      ...milestones,
      {
        version: "1.0",
        status: "Planned",
        title: "Launch",
        tone: "planned",
        items: [{ label: "Docs polish" }],
      },
    ],
  },
};

export const NothingShippedYet: Story = {
  args: {
    milestones: milestones.map((milestone) => ({
      ...milestone,
      tone: "planned" as const,
      status: "Planned",
    })),
  },
};

export const WithoutTrack: Story = {
  args: { milestones, hideTrack: true },
};

export const Tones: Story = {
  args: {
    milestones: (["done", "current", "planned"] as const).map((tone) => ({
      version: tone,
      status: tone,
      title: `Milestone (${tone})`,
      body: "Every tone keeps the body at the same weight. The tone speaks through the title, the border and the node.",
      tone,
      items: [{ label: "First item" }, { label: "Second item" }],
    })),
  },
};
