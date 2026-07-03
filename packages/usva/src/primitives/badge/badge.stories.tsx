import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./badge.js";

const meta: Meta<typeof Badge> = {
  title: "Primitives/Badge",
  component: Badge,
  tags: ["autodocs"],
  args: {
    children: "Badge",
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
