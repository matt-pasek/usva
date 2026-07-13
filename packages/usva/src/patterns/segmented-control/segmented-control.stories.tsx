import type { Meta, StoryObj } from "@storybook/react-vite";
import * as React from "react";
import { SegmentedControl } from "./segmented-control.js";

const viewItems = [
  { value: "board", label: "Board" },
  { value: "list", label: "List" },
  { value: "timeline", label: "Timeline" },
];

const meta: Meta<typeof SegmentedControl> = {
  title: "Patterns/SegmentedControl",
  component: SegmentedControl,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["sm", "md"],
    },
  },
  args: {
    items: viewItems,
    defaultValue: "board",
    size: "md",
  },
};

export default meta;
type Story = StoryObj<typeof SegmentedControl>;

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

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col items-start gap-4">
      {(["sm", "md"] as const).map((size) => (
        <div key={size} className="flex items-center gap-3">
          <span className="w-8 font-mono text-xs text-muted">{size}</span>
          <SegmentedControl
            size={size}
            items={viewItems}
            defaultValue="board"
          />
        </div>
      ))}
    </div>
  ),
};

function Dot() {
  return (
    <svg viewBox="0 0 8 8" className="h-2 w-2" aria-hidden="true">
      <circle cx="4" cy="4" r="4" fill="currentColor" />
    </svg>
  );
}
