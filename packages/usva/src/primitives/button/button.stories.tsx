import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./button.js";

const meta: Meta<typeof Button> = {
  title: "Primitives/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["solid", "soft", "ghost", "outline", "onSurface"],
    },
    size: { control: { type: "select" }, options: ["sm", "md", "lg"] },
    status: {
      control: { type: "select" },
      options: ["idle", "loading", "success", "error"],
    },
    disabled: { control: { type: "boolean" } },
    asChild: { control: { type: "boolean" } },
  },
  args: {
    children: "Button",
    variant: "solid",
    size: "md",
    status: "idle",
    disabled: false,
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {};

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

export const OnSurface: Story = {
  args: { variant: "onSurface", children: "View on GitHub" },
  decorators: [
    (Story) => (
      <div className="rounded-xl bg-gradient-accent p-10">
        <Story />
      </div>
    ),
  ],
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

export const Variants: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {(["solid", "soft", "ghost", "outline", "onSurface"] as const).map(
        (variant) => (
          <Button {...args} key={variant} variant={variant}>
            {variant}
          </Button>
        ),
      )}
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Button {...args} key={size} size={size}>
          {size}
        </Button>
      ))}
    </div>
  ),
};

export const Statuses: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {(["idle", "loading", "success", "error"] as const).map((status) => (
        <Button
          {...args}
          key={status}
          status={status}
          settleDelay={1_000_000}
          successText="Saved"
          errorText="Failed"
        >
          {status}
        </Button>
      ))}
    </div>
  ),
};

export const AsChild: Story = {
  args: {
    asChild: true,
    children: <a href="#usva">Link styled as button</a>,
  },
};
