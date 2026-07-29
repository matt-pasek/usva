import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "../../primitives/badge/badge.js";
import { ProgressRow } from "./progress-row.js";

const meta: Meta<typeof ProgressRow> = {
  title: "Patterns/ProgressRow",
  component: ProgressRow,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ProgressRow>;

export const Default: Story = {
  args: {
    label: "Computer Science",
    value: 12,
    max: 30,
    unit: "cr",
  },
};

export const Stack: Story = {
  render: () => (
    <div className="divide-y divide-border">
      <ProgressRow
        label="Computer Science"
        value={30}
        max={30}
        unit="cr"
        barColor="#8b5cf6"
        status={<Badge tone="success">Complete</Badge>}
      />
      <ProgressRow
        label="Mathematics"
        value={12}
        max={30}
        unit="cr"
        barColor="#52c989"
        status={<Badge tone="warning">In progress</Badge>}
      />
      <ProgressRow label="Electives" value={0} max={15} unit="cr" />
    </div>
  ),
};
