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
  argTypes: {
    size: {
      control: { type: "select" },
      options: ["sm", "md"],
    },
    side: {
      control: { type: "select" },
      options: ["top", "bottom", "left", "right"],
    },
    active: { control: { type: "boolean" } },
    loading: { control: { type: "boolean" } },
    disabled: { control: { type: "boolean" } },
  },
  args: {
    "aria-label": "Settings",
    children: <Gear />,
    tooltip: "Settings",
    size: "md",
    side: "top",
    active: false,
    loading: false,
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Default: Story = {};

export const Active: Story = {
  args: { active: true, tooltip: "Grid view" },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-end gap-6">
      {(["sm", "md"] as const).map((size) => (
        <div key={size} className="flex flex-col items-center gap-2">
          <IconButton aria-label={`Settings ${size}`} size={size}>
            <Gear />
          </IconButton>
          <span className="font-mono text-xs text-muted">{size}</span>
        </div>
      ))}
    </div>
  ),
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
