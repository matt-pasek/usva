import type { Meta, StoryObj } from "@storybook/react-vite";
import { RevealGroup } from "../../motion/reveal.js";
import { StatBento } from "./stat-bento.js";

const meta: Meta<typeof StatBento> = {
  title: "Patterns/StatBento",
  component: StatBento,
};
export default meta;

type Story = StoryObj<typeof StatBento>;

const stats = [
  { value: "40", suffix: "%", label: "faster builds" },
  { value: "2.4", suffix: "k", label: "active users" },
  { value: "99.9", suffix: "%", label: "uptime" },
];

export const Default: Story = {
  args: { stats },
};

export const WithoutSuffixes: Story = {
  args: {
    stats: [
      { value: "12", label: "services" },
      { value: "3", label: "regions" },
      { value: "48", label: "contributors" },
    ],
  },
};

/**
 * The stagger is not baked in. RevealGroup animates its direct children, so it has to
 * be the grid itself rather than wrap it.
 */
export const Staggered: Story = {
  render: () => (
    <StatBento as={RevealGroup} stagger={0.08} force stats={stats} />
  ),
};
