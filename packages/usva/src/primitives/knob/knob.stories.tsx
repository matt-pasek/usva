import type { Meta, StoryObj } from "@storybook/react-vite";
import { Knob } from "./knob.js";

const meta: Meta<typeof Knob> = {
  title: "Primitives/Knob",
  component: Knob,
  tags: ["autodocs"],
  argTypes: {
    size: { control: { type: "select" }, options: ["sm", "md", "lg"] },
    min: { control: { type: "number" } },
    max: { control: { type: "number" } },
    step: { control: { type: "number" } },
    disabled: { control: { type: "boolean" } },
    showValue: { control: { type: "boolean" } },
  },
  args: {
    label: "Volume",
    defaultValue: 59,
    min: 0,
    max: 100,
    step: 1,
    size: "md",
    disabled: false,
    showValue: true,
  },
};
export default meta;

type Story = StoryObj<typeof Knob>;

export const Default: Story = {};

export const Disabled: Story = {
  args: { disabled: true },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-end gap-8">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Knob key={size} size={size} label={size} defaultValue={59} showValue />
      ))}
    </div>
  ),
};

export const Formatted: Story = {
  args: {
    label: "Volume",
    formatValue: (v) => `${v} %`,
  },
};

export const CoarseSteps: Story = {
  args: {
    label: "Gain",
    defaultValue: 6,
    min: -12,
    max: 12,
    step: 3,
    formatValue: (v) => `${v > 0 ? "+" : ""}${v} dB`,
  },
};

export const Row: Story = {
  render: () => (
    <div className="flex gap-8">
      {[
        { label: "Input", value: 82 },
        { label: "Output", value: 59 },
        { label: "Mix", value: 18 },
      ].map(({ label, value }) => (
        <Knob
          key={label}
          label={label}
          defaultValue={value}
          showValue
          formatValue={(v) => `${v} %`}
        />
      ))}
    </div>
  ),
};
