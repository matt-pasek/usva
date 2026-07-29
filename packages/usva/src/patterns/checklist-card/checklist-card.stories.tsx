import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChecklistCard } from "./checklist-card.js";

const items = [
  "Runs entirely on your machine",
  "No tracking, no analytics, no accounts",
  "Open source, end to end",
];

const meta: Meta<typeof ChecklistCard> = {
  title: "Patterns/ChecklistCard",
  component: ChecklistCard,
  tags: ["autodocs"],
  args: { items },
};
export default meta;

type Story = StoryObj<typeof ChecklistCard>;

export const Default: Story = {
  args: { items },
};

export const WithTitle: Story = {
  args: { title: "Privacy", items },
};

export const CustomMarker: Story = {
  args: {
    items,
    marker: <span className="font-mono text-xs">&rarr;</span>,
  },
};
