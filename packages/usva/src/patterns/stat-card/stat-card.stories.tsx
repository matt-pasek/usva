import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatCard } from "./stat-card.js";

const meta: Meta<typeof StatCard> = {
  title: "Patterns/StatCard",
  component: StatCard,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  args: {
    label: "Monthly revenue",
    value: "48,209",
    unit: "USD",
  },
};

export default meta;
type Story = StoryObj<typeof StatCard>;

export const Default: Story = {};

export const TrendUp: Story = {
  args: { note: "12.4% vs last month", trend: "up" },
};

export const TrendDown: Story = {
  args: {
    label: "Bounce rate",
    value: "34.1",
    unit: "%",
    note: "2.1%",
    trend: "down",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
    label: "Active users",
    value: "1,204",
    trend: "flat",
    note: "steady",
  },
};

export const WithSpark: Story = {
  args: {
    label: "Sessions",
    value: "9,832",
    trend: "up",
    note: "8.0%",
    spark: (
      <div className="h-1.5 rounded-full bg-surface-2">
        <div className="h-full w-2/3 rounded-full bg-accent" />
      </div>
    ),
  },
};
