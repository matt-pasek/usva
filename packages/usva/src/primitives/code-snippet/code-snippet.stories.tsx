import type { Meta, StoryObj } from "@storybook/react-vite";
import { CodeSnippet } from "./code-snippet.js";

const CODE = `import { Button } from "usva";

export function Save() {
  return <Button variant="solid">save</Button>;
}`;

const meta: Meta<typeof CodeSnippet> = {
  title: "Primitives/CodeSnippet",
  component: CodeSnippet,
  tags: ["autodocs"],
  argTypes: {
    language: {
      control: { type: "select" },
      options: ["tsx", "typescript", "xml", "bash", "css", "json", "plain"],
    },
    label: { control: { type: "text" } },
    note: { control: { type: "text" } },
    copyable: { control: { type: "boolean" } },
  },
  args: {
    code: CODE,
    language: "tsx",
    label: "usage",
    note: "",
    copyable: true,
  },
};

export default meta;
type Story = StoryObj<typeof CodeSnippet>;

export const Default: Story = {};

export const Bare: Story = {
  args: { label: undefined, note: undefined },
};

export const PlainText: Story = {
  args: { language: "plain", label: "output" },
};
