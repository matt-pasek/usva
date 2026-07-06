import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconButton } from "./icon-button.js";

const Gear = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2" />
  </svg>
);

const meta: Meta<typeof IconButton> = {
  title: "Primitives/IconButton",
  component: IconButton,
  tags: ["autodocs"],
  args: { "aria-label": "Settings", children: <Gear />, tooltip: "Settings" },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Default: Story = {};

export const Active: Story = {
  args: { active: true, tooltip: "Grid view" },
};

export const Row: Story = {
  render: () => (
    <div className="inline-flex items-center gap-2">
      <IconButton aria-label="Settings" tooltip="Settings">
        <Gear />
      </IconButton>
      <IconButton aria-label="Grid" tooltip="Grid" active>
        <Gear />
      </IconButton>
      <IconButton aria-label="Small" tooltip="Small" size="sm">
        <Gear />
      </IconButton>
    </div>
  ),
};
