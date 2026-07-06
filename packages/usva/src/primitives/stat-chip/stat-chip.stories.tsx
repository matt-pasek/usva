import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatChip } from "./stat-chip.js";

const meta: Meta<typeof StatChip> = {
  title: "Primitives/StatChip",
  component: StatChip,
  tags: ["autodocs"],
  args: { label: "credits", value: "142", unit: "cr" },
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
