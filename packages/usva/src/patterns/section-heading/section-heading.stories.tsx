import type { Meta, StoryObj } from "@storybook/react-vite";
import { SectionHeading } from "./section-heading.js";

const meta: Meta<typeof SectionHeading> = {
  title: "Patterns/SectionHeading",
  component: SectionHeading,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SectionHeading>;

export const Default: Story = {
  args: {
    eyebrow: "The problem",
    title: "Students could not see their whole degree.",
  },
};

export const Toned: Story = {
  args: {
    tone: "accent",
    eyebrow: "Outcome",
    title: "One planner, four systems reconciled.",
  },
};

export const Bare: Story = {
  args: { title: "No eyebrow, just the heading." },
};
