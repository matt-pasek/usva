import type { Meta, StoryObj } from "@storybook/react-vite";
import { themeModes } from "../../../.storybook/modes.js";
import { Chip } from "./chip.js";

const meta: Meta<typeof Chip> = {
  parameters: {
    chromatic: { modes: themeModes },
  },
  title: "Primitives/Chip",
  component: Chip,
  tags: ["autodocs"],
  argTypes: {
    tone: {
      control: { type: "select" },
      options: [
        "default",
        "accent",
        "accent-alt",
        "success",
        "warning",
        "danger",
      ],
    },
    size: { control: { type: "select" }, options: ["sm", "md"] },
    selected: { control: { type: "boolean" } },
  },
  args: { children: "React", tone: "default", size: "md", selected: false },
};

export default meta;
type Story = StoryObj<typeof Chip>;

export const Default: Story = {};

export const WithValue: Story = {
  args: { children: "Credits", value: "1,240", tone: "accent" },
};

export const Removable: Story = {
  args: { children: "TypeScript", tone: "accent-alt", onRemove: () => {} },
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-2">
      {(["sm", "md"] as const).map((size) => (
        <Chip {...args} key={size} size={size}>
          {size}
        </Chip>
      ))}
    </div>
  ),
};

export const Tones: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Chip tone="default">default</Chip>
      <Chip tone="accent">accent</Chip>
      <Chip tone="accent-alt">accent-alt</Chip>
      <Chip tone="success">success</Chip>
      <Chip tone="warning">warning</Chip>
      <Chip tone="danger">danger</Chip>
    </div>
  ),
};
