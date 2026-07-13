import type { Meta, StoryObj } from "@storybook/react-vite";
import { IconButton } from "../icon-button/icon-button.js";
import { NotificationBadge } from "./notification-badge.js";

const Bell = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.5}
    aria-hidden="true"
  >
    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a2 2 0 0 0 3.4 0" />
  </svg>
);

const meta: Meta<typeof NotificationBadge> = {
  title: "Primitives/NotificationBadge",
  component: NotificationBadge,
  tags: ["autodocs"],
  argTypes: {
    tone: {
      control: { type: "select" },
      options: ["accent", "accent-alt", "danger", "warning"],
    },
    dot: { control: { type: "boolean" } },
    showZero: { control: { type: "boolean" } },
    count: { control: { type: "number" } },
    max: { control: { type: "number" } },
  },
  args: { count: 3, max: 9, tone: "danger", dot: false, showZero: false },
};

export default meta;
type Story = StoryObj<typeof NotificationBadge>;

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-5">
      <NotificationBadge count={3}>
        <IconButton aria-label="Notifications">
          <Bell />
        </IconButton>
      </NotificationBadge>
      <NotificationBadge count={42}>
        <IconButton aria-label="Notifications">
          <Bell />
        </IconButton>
      </NotificationBadge>
      <NotificationBadge dot tone="accent-alt">
        <IconButton aria-label="Notifications">
          <Bell />
        </IconButton>
      </NotificationBadge>
    </div>
  ),
};

export const Tones: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-8">
      {(["accent", "accent-alt", "danger", "warning"] as const).map((tone) => (
        <div key={tone} className="flex flex-col items-center gap-2">
          <NotificationBadge count={5} tone={tone}>
            <IconButton aria-label="Notifications">
              <Bell />
            </IconButton>
          </NotificationBadge>
          <span className="font-mono text-xs text-muted">{tone}</span>
        </div>
      ))}
    </div>
  ),
};
