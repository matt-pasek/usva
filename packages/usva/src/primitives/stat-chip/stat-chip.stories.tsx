import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatChip } from "./stat-chip.js";

const meta: Meta<typeof StatChip> = {
  title: "Primitives/StatChip",
  component: StatChip,
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
    size: { control: { type: "select" }, options: ["sm", "md"] },
  },
  args: {
    label: "credits",
    value: "142",
    unit: "cr",
    tone: "neutral",
    size: "md",
  },
};

export default meta;
type Story = StoryObj<typeof StatChip>;

export const Default: Story = {};

export const Tones: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <StatChip label="total" value="1,240" />
      <StatChip tone="accent" label="active" value="86" />
      <StatChip tone="accent-alt" label="done" value="99" unit="%" />
      <StatChip tone="warning" label="due" value="4" />
      <StatChip tone="danger" label="failed" value="2" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      {(["sm", "md"] as const).map((size) => (
        <StatChip
          key={size}
          size={size}
          tone="accent"
          label={size}
          value="142"
          unit="cr"
        />
      ))}
    </div>
  ),
};
