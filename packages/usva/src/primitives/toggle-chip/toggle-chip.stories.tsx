import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { ToggleChip, ToggleChipGroup } from "./toggle-chip.js";

const meta: Meta<typeof ToggleChipGroup> = {
  title: "Primitives/ToggleChip",
  component: ToggleChipGroup,
  tags: ["autodocs"],
  argTypes: {
    type: { control: { type: "select" }, options: ["single", "multiple"] },
    disabled: { control: { type: "boolean" } },
  },
  args: { type: "multiple", disabled: false, value: [] },
};
export default meta;

type Story = StoryObj<typeof ToggleChipGroup>;

const STATS = [
  ["grade-avg", "Grade avg."],
  ["active-courses", "Active courses"],
  ["credits-left", "Credits left"],
  ["study-right", "Study right"],
  ["urgent-deadlines", "Urgent deadlines"],
  ["completion", "Completion"],
] as const;

const PANELS = [
  ["progress-ring", "Progress ring"],
  ["upcoming", "Upcoming"],
  ["grade-trend", "Grade trend"],
  ["credit-trajectory", "Credit trajectory"],
] as const;

export const Multiple: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>([
      "grade-avg",
      "active-courses",
      "credits-left",
    ]);
    return (
      <ToggleChipGroup value={value} onValueChange={setValue} ariaLabel="Stats">
        {STATS.map(([id, label]) => (
          <ToggleChip key={id} value={id}>
            {label}
          </ToggleChip>
        ))}
      </ToggleChipGroup>
    );
  },
};

export const Bounded: Story = {
  name: "Bounded (min 2, max 4)",
  render: () => {
    const [value, setValue] = useState<string[]>([
      "grade-avg",
      "active-courses",
    ]);
    return (
      <ToggleChipGroup
        value={value}
        onValueChange={setValue}
        min={2}
        max={4}
        ariaLabel="Stats"
      >
        {STATS.map(([id, label]) => (
          <ToggleChip key={id} value={id}>
            {label}
          </ToggleChip>
        ))}
      </ToggleChipGroup>
    );
  },
};

export const Single: Story = {
  render: () => {
    const [value, setValue] = useState("credit-trajectory");
    return (
      <ToggleChipGroup
        type="single"
        value={value}
        onValueChange={setValue}
        label="Panel view"
      >
        {PANELS.map(([id, label]) => (
          <ToggleChip key={id} value={id}>
            {label}
          </ToggleChip>
        ))}
      </ToggleChipGroup>
    );
  },
};

export const Types: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-6">
      <ToggleChipGroup type="single" value="progress-ring" label="single">
        {PANELS.slice(0, 3).map(([id, label]) => (
          <ToggleChip key={id} value={id}>
            {label}
          </ToggleChip>
        ))}
      </ToggleChipGroup>
      <ToggleChipGroup
        type="multiple"
        value={["grade-avg", "credits-left"]}
        label="multiple"
      >
        {STATS.slice(0, 3).map(([id, label]) => (
          <ToggleChip key={id} value={id}>
            {label}
          </ToggleChip>
        ))}
      </ToggleChipGroup>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <ToggleChipGroup disabled value={["grade-avg"]} ariaLabel="Stats">
      {STATS.slice(0, 3).map(([id, label]) => (
        <ToggleChip key={id} value={id}>
          {label}
        </ToggleChip>
      ))}
    </ToggleChipGroup>
  ),
};
