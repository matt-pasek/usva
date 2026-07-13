import type { Meta, StoryObj } from "@storybook/react-vite";
import { MockupShowcase } from "./mockup-showcase.js";

const Placeholder = () => (
  <div className="grid h-full w-full place-items-center bg-accent-tint font-mono text-xs text-on-tint">
    your screenshot here
  </div>
);

const meta: Meta<typeof MockupShowcase> = {
  title: "Patterns/MockupShowcase",
  component: MockupShowcase,
  tags: ["autodocs"],
  argTypes: {
    frame: {
      control: { type: "select" },
      options: ["browser", "device", "none"],
    },
  },
  args: {
    frame: "browser",
    url: "usva.dev",
    aspect: "16/10",
    children: <Placeholder />,
  },
};

export default meta;
type Story = StoryObj<typeof MockupShowcase>;

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

export const Frames: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-6">
      {(["browser", "device", "none"] as const).map((frame) => (
        <div key={frame} className="flex w-72 flex-col gap-2">
          <span className="font-mono text-xs text-muted">{frame}</span>
          <MockupShowcase frame={frame} url="usva.dev">
            <Placeholder />
          </MockupShowcase>
        </div>
      ))}
    </div>
  ),
};
