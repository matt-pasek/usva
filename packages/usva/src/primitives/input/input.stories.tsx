import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./input.js";

const meta: Meta<typeof Input> = {
  title: "Primitives/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    disabled: { control: { type: "boolean" } },
    required: { control: { type: "boolean" } },
    readOnly: { control: { type: "boolean" } },
  },
  args: {
    placeholder: "you@example.com",
    disabled: false,
    required: false,
    readOnly: false,
  },
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
