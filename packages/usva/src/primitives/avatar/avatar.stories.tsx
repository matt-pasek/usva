import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "./avatar.js";

const meta: Meta<typeof Avatar> = {
  title: "Primitives/Avatar",
  component: Avatar,
  args: { alt: "Jane Doe", fallback: "JD" },
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
