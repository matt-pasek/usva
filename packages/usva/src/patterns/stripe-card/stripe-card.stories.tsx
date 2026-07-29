import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "../../primitives/badge/badge.js";
import { StripeCard } from "./stripe-card.js";

const meta: Meta<typeof StripeCard> = {
  title: "Patterns/StripeCard",
  component: StripeCard,
  tags: ["autodocs"],
  argTypes: {
    surface: {
      control: { type: "select" },
      options: ["elevated", "flat", "glass", "outline"],
    },
    selected: { control: { type: "boolean" } },
  },
  args: {
    heading: "Algorithms & Data Structures",
    metaLeft: "CS-201",
    metaRight: "5 cr",
    stripeColor: "var(--color-accent)",
    surface: "elevated",
    selected: false,
  },
};

export default meta;
type Story = StoryObj<typeof StripeCard>;

export const Default: Story = {
  render: () => (
    <div className="grid max-w-2xl gap-3 sm:grid-cols-2">
      <StripeCard
        heading="Algorithms & Data Structures"
        metaLeft="CS-201"
        metaRight="5 cr"
        stripeColor="var(--color-accent)"
        badge={<Badge tone="accent-alt">enrolled</Badge>}
        footer="Autumn 2026 · Prof. Turing"
      />
      <StripeCard
        heading="Discrete Mathematics"
        metaLeft="MA-140"
        metaRight="4 cr"
        stripeColor="var(--color-accent-alt)"
        selected
      />
    </div>
  ),
};

const stripeTones = [
  { name: "neutral", color: undefined },
  { name: "accent", color: "var(--color-accent)" },
  { name: "accent-alt", color: "var(--color-accent-alt)" },
  { name: "success", color: "var(--color-success)" },
  { name: "warning", color: "var(--color-warning)" },
  { name: "danger", color: "var(--color-danger)" },
];

export const StripeTones: Story = {
  render: () => (
    <div className="grid max-w-3xl gap-3 sm:grid-cols-3">
      {stripeTones.map((tone) => (
        <StripeCard
          key={tone.name}
          heading={tone.name}
          metaLeft="stripe"
          stripeColor={tone.color}
        />
      ))}
    </div>
  ),
};
