import type { Meta, StoryObj } from "@storybook/react-vite";
import { Avatar } from "./avatar.js";
import { AvatarGroup } from "./avatar-group.js";

const meta: Meta<typeof AvatarGroup> = {
  title: "Primitives/AvatarGroup",
  component: AvatarGroup,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AvatarGroup>;

export const Default: Story = {
  render: () => (
    <AvatarGroup max={4} label="+128 students">
      <Avatar alt="Ada" fallback="MP" />
      <Avatar alt="Blaise" fallback="AK" />
      <Avatar alt="Curie" fallback="JL" />
      <Avatar alt="Dijkstra" fallback="RS" />
      <Avatar alt="Euler" fallback="TN" />
      <Avatar alt="Fermat" fallback="OK" />
    </AvatarGroup>
  ),
};
