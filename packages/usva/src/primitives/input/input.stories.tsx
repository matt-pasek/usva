import type { Meta, StoryObj } from "@storybook/react-vite";
import { themeModes } from "../../../.storybook/modes.js";
import { Input } from "./input.js";

const meta: Meta<typeof Input> = {
  parameters: {
    chromatic: { modes: themeModes },
  },
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

export const Hover: Story = {
  parameters: { pseudo: { hover: true } },
};

export const FocusVisible: Story = {
  parameters: { pseudo: { focusVisible: true } },
};
