import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "./label.js";

const meta: Meta<typeof Label> = {
  title: "Primitives/Label",
  component: Label,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
  args: {
    htmlFor: "email",
    children: "Email address",
  },
};

export const Mono: Story = {
  args: {
    htmlFor: "token",
    mono: true,
    children: "API token",
  },
};

export const Disabled: Story = {
  args: {
    htmlFor: "locked",
    disabled: true,
    children: "Unavailable field",
  },
};
