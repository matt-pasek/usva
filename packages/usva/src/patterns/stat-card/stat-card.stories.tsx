import type { Meta, StoryObj } from "@storybook/react-vite";
import { StatCard } from "./stat-card.js";

const meta: Meta<typeof StatCard> = {
  title: "Patterns/StatCard",
  component: StatCard,
  tags: ["autodocs"],
  parameters: { layout: "centered" },
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["sm", "md"],
    },
    tone: {
      control: { type: "select" },
      options: ["neutral", "accent", "accent-alt"],
    },
    trend: {
      control: { type: "select" },
      options: ["up", "down", "flat"],
    },
    surface: {
      control: { type: "select" },
      options: ["elevated", "flat", "glass", "outline"],
    },
    featured: { control: { type: "boolean" } },
  },
  args: {
    label: "Monthly revenue",
    value: "48,209",
    unit: "USD",
    size: "md",
    tone: "neutral",
    surface: "elevated",
    featured: false,
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

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-4">
      {(["sm", "md"] as const).map((size) => (
        <StatCard
          key={size}
          size={size}
          label={size}
          value="48,209"
          unit="USD"
          className="w-56"
        />
      ))}
    </div>
  ),
};

export const Tones: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-4">
      {(["neutral", "accent", "accent-alt"] as const).map((tone) => (
        <StatCard
          key={tone}
          tone={tone}
          label={tone}
          value="48,209"
          unit="USD"
          className="w-56"
        />
      ))}
    </div>
  ),
};

export const Trends: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-4">
      {(["up", "down", "flat"] as const).map((trend) => (
        <StatCard
          key={trend}
          trend={trend}
          label={trend}
          value="48,209"
          note="12.4% vs last month"
          className="w-56"
        />
      ))}
    </div>
  ),
};

export const Surfaces: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-4">
      {(["elevated", "flat", "glass", "outline"] as const).map((surface) => (
        <StatCard
          key={surface}
          surface={surface}
          label={surface}
          value="48,209"
          unit="USD"
          className="w-56"
        />
      ))}
    </div>
  ),
};
