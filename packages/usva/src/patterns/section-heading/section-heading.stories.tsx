import type { Meta, StoryObj } from "@storybook/react-vite";
import { SectionHeading } from "./section-heading.js";

const meta: Meta<typeof SectionHeading> = {
  title: "Patterns/SectionHeading",
  component: SectionHeading,
  tags: ["autodocs"],
  argTypes: {
    tone: {
      control: { type: "select" },
      options: ["accent", "accent-alt"],
    },
    as: {
      control: { type: "select" },
      options: ["h1", "h2", "h3"],
    },
  },
  args: {
    as: "h2",
    tone: "accent-alt",
    eyebrow: "The problem",
    title: "Students could not see their whole degree.",
  },
};

export default meta;
type Story = StoryObj<typeof SectionHeading>;

export const Default: Story = {};

export const Toned: Story = {
  args: {
    tone: "accent",
    eyebrow: "Outcome",
    title: "One planner, four systems reconciled.",
  },
};

export const Bare: Story = {
  args: { eyebrow: undefined, title: "No eyebrow, just the heading." },
};

export const Tones: Story = {
  render: () => (
    <div className="flex flex-col gap-6">
      {(["accent", "accent-alt"] as const).map((tone) => (
        <SectionHeading
          key={tone}
          tone={tone}
          eyebrow={tone}
          title="The eyebrow carries the tone."
        />
      ))}
    </div>
  ),
};
