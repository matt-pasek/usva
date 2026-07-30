import type { Meta, StoryObj } from "@storybook/react-vite";
import { Terminal } from "./terminal.js";

const meta: Meta<typeof Terminal> = {
  title: "Primitives/Terminal",
  component: Terminal,
  tags: ["autodocs"],
  argTypes: {
    command: { control: { type: "text" } },
    prompt: { control: { type: "text" } },
    copyable: { control: { type: "boolean" } },
  },
  args: {
    command: "bun add @usva-ui/react",
    prompt: "$",
    copyable: true,
  },
};

export default meta;
type Story = StoryObj<typeof Terminal>;

export const Default: Story = {};

export const RegistryAdd: Story = {
  args: { command: "npx shadcn add https://usva.dev/r/button.json" },
};
