import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./input.js";

const meta: Meta<typeof Input> = {
  title: "Primitives/Input",
  component: Input,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    defaultValue: "Hello usva.",
  },
};

export const Placeholder: Story = {
  args: {
    placeholder: "you@example.com",
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "Disabled input",
    disabled: true,
  },
};

export const Invalid: Story = {
  args: {
    defaultValue: "not-an-email",
    "aria-invalid": true,
  },
};
