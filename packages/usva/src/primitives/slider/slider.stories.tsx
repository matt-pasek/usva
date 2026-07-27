import type { Meta, StoryObj } from "@storybook/react-vite";
import { themeModes } from "../../../.storybook/modes.js";
import { Slider } from "./slider.js";

const meta: Meta<typeof Slider> = {
  parameters: {
    chromatic: { modes: themeModes },
  },
  title: "Primitives/Slider",
  component: Slider,
  tags: ["autodocs"],
  argTypes: {
    size: { control: { type: "select" }, options: ["sm", "md"] },
    min: { control: { type: "number" } },
    max: { control: { type: "number" } },
    step: { control: { type: "number" } },
    disabled: { control: { type: "boolean" } },
    showValue: { control: { type: "boolean" } },
  },
  args: {
    label: "Speed",
    defaultValue: 40,
    min: 0,
    max: 100,
    step: 1,
    size: "md",
    disabled: false,
    showValue: true,
  },
  decorators: [
    (Story) => (
      <div className="w-72">
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Slider>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Small: Story = {
  args: { size: "sm" },
};

export const Medium: Story = {
  args: { size: "md" },
};

export const Formatted: Story = {
  args: {
    label: "Duration",
    defaultValue: 2,
    min: 0,
    max: 10,
    step: 0.5,
    formatValue: (v) => `${v}s`,
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-6">
      {(["sm", "md"] as const).map((size) => (
        <Slider
          key={size}
          size={size}
          label={size}
          defaultValue={40}
          showValue
        />
      ))}
    </div>
  ),
};
