import type { Meta, StoryObj } from "@storybook/react-vite";
import { MockupShowcase } from "./mockup-showcase.js";

const meta: Meta<typeof MockupShowcase> = {
  title: "Patterns/MockupShowcase",
  component: MockupShowcase,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof MockupShowcase>;

const Placeholder = () => (
  <div className="grid h-full w-full place-items-center bg-accent-tint font-mono text-xs text-on-tint">
    your screenshot here
  </div>
);

export const Browser: Story = {
  render: () => (
    <MockupShowcase frame="browser" url="usva.dev">
      <Placeholder />
    </MockupShowcase>
  ),
};

export const Device: Story = {
  render: () => (
    <MockupShowcase frame="device" aspect="9/16" className="max-w-64">
      <Placeholder />
    </MockupShowcase>
  ),
};

export const Bare: Story = {
  render: () => (
    <MockupShowcase frame="none" aspect="21/9">
      <Placeholder />
    </MockupShowcase>
  ),
};
