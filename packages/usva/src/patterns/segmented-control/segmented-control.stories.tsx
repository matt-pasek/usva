import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { SegmentedControl } from "./segmented-control.js";

const meta: Meta<typeof SegmentedControl> = {
  title: "Patterns/SegmentedControl",
  component: SegmentedControl,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof SegmentedControl>;

const viewItems = [
  { value: "board", label: "Board" },
  { value: "list", label: "List" },
  { value: "timeline", label: "Timeline" },
];

export const Default: Story = {
  render: () => {
    const [value, setValue] = React.useState("board");
    return (
      <SegmentedControl
        items={viewItems}
        value={value}
        onValueChange={setValue}
      />
    );
  },
};

export const Uncontrolled: Story = {
  render: () => <SegmentedControl items={viewItems} defaultValue="list" />,
};

export const Small: Story = {
  render: () => (
    <SegmentedControl
      size="sm"
      defaultValue="day"
      items={[
        { value: "day", label: "Day" },
        { value: "week", label: "Week" },
        { value: "month", label: "Month" },
      ]}
    />
  ),
};

export const WithIcons: Story = {
  render: () => (
    <SegmentedControl
      defaultValue="grid"
      items={[
        { value: "grid", label: "Grid", icon: <Dot /> },
        { value: "rows", label: "Rows", icon: <Dot /> },
      ]}
    />
  ),
};

function Dot() {
  return (
    <svg viewBox="0 0 8 8" className="h-2 w-2" aria-hidden="true">
      <circle cx="4" cy="4" r="4" fill="currentColor" />
    </svg>
  );
}
