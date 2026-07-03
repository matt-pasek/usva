import type { Meta, StoryObj } from "@storybook/react-vite";
import { Chip } from "./chip.js";

const meta: Meta<typeof Chip> = {
  title: "Primitives/Chip",
  component: Chip,
  tags: ["autodocs"],
  args: { children: "React" },
};

export default meta;
type Story = StoryObj<typeof Chip>;

export const Default: Story = {};

export const WithValue: Story = {
  args: { children: "Credits", value: "1,240", tone: "accent" },
};

export const Removable: Story = {
  args: { children: "TypeScript", tone: "accent-alt", onRemove: () => {} },
};

export const Tones: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Chip tone="default">default</Chip>
      <Chip tone="accent">accent</Chip>
      <Chip tone="accent-alt">accent-alt</Chip>
      <Chip tone="success">success</Chip>
      <Chip tone="warning">warning</Chip>
      <Chip tone="danger">danger</Chip>
    </div>
  ),
};
