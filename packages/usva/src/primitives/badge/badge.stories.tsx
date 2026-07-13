import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./badge.js";

const meta: Meta<typeof Badge> = {
  title: "Primitives/Badge",
  component: Badge,
  tags: ["autodocs"],
  argTypes: {
    tone: {
      control: { type: "select" },
      options: [
        "neutral",
        "accent",
        "accent-alt",
        "success",
        "warning",
        "danger",
      ],
    },
    mono: { control: { type: "boolean" } },
    live: { control: { type: "boolean" } },
  },
  args: {
    children: "Badge",
    tone: "neutral",
    mono: false,
    live: false,
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Neutral: Story = {
  args: { tone: "neutral" },
};

export const Accent: Story = {
  args: { tone: "accent" },
};

export const Success: Story = {
  args: { tone: "success" },
};

export const Warning: Story = {
  args: { tone: "warning" },
};

export const Danger: Story = {
  args: { tone: "danger" },
};

export const Tones: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {(
        [
          "neutral",
          "accent",
          "accent-alt",
          "success",
          "warning",
          "danger",
        ] as const
      ).map((tone) => (
        <Badge {...args} key={tone} tone={tone}>
          {tone}
        </Badge>
      ))}
    </div>
  ),
};
