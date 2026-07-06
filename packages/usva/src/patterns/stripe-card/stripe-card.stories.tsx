import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "../../primitives/badge/badge.js";
import { StripeCard } from "./stripe-card.js";

const meta: Meta<typeof StripeCard> = {
  title: "Patterns/StripeCard",
  component: StripeCard,
  tags: ["autodocs"],
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
