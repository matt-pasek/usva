import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button.js";

const meta: Meta<typeof Button> = {
  title: "Primitives/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    children: "Button",
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Solid: Story = {
  args: { variant: "solid" },
};

export const Soft: Story = {
  args: { variant: "soft" },
};

export const Ghost: Story = {
  args: { variant: "ghost" },
};

export const Outline: Story = {
  args: { variant: "outline" },
};

export const Small: Story = {
  args: { size: "sm" },
};

export const Medium: Story = {
  args: { size: "md" },
};

export const Large: Story = {
  args: { size: "lg" },
};

export const Disabled: Story = {
  args: { disabled: true },
};

export const AsChild: Story = {
  args: {
    asChild: true,
    children: <a href="#usva">Link styled as button</a>,
  },
};
