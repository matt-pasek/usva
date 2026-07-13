import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "./avatar.js";

const meta: Meta<typeof Avatar> = {
  title: "Primitives/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  argTypes: {
    size: { control: { type: "select" }, options: ["sm", "md", "lg"] },
    tone: {
      control: { type: "select" },
      options: ["solid", "accent", "neutral"],
    },
    status: {
      control: { type: "select" },
      options: ["online", "away", "busy", "offline"],
    },
  },
  args: { alt: "Jane Doe", fallback: "JD", size: "md", tone: "solid" },
};
export default meta;

type Story = StoryObj<typeof Avatar>;

export const Image: Story = {
  args: {
    src: "https://i.pravatar.cc/150?img=12",
  },
};

export const InitialsFallback: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex items-center gap-4">
      <Avatar {...args} size="sm" />
      <Avatar {...args} size="md" />
      <Avatar {...args} size="lg" />
    </div>
  ),
};

export const Tones: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-6">
      {(["solid", "accent", "neutral"] as const).map((tone) => (
        <div key={tone} className="flex flex-col items-center gap-2">
          <Avatar {...args} tone={tone} />
          <span className="text-xs text-muted">{tone}</span>
        </div>
      ))}
    </div>
  ),
};

export const Statuses: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-6">
      {(["online", "away", "busy", "offline"] as const).map((status) => (
        <div key={status} className="flex flex-col items-center gap-2">
          <Avatar {...args} status={status} />
          <span className="text-xs text-muted">{status}</span>
        </div>
      ))}
    </div>
  ),
};

export const GroupStack: Story = {
  render: () => (
    <div className="flex">
      <Avatar
        alt="Ada Lovelace"
        fallback="AL"
        className="ring-2 ring-surface"
      />
      <Avatar
        alt="Grace Hopper"
        fallback="GH"
        className="-ml-3 ring-2 ring-surface"
      />
      <Avatar
        alt="Katherine Johnson"
        fallback="KJ"
        className="-ml-3 ring-2 ring-surface"
      />
    </div>
  ),
};
