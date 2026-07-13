import type { Meta, StoryObj } from "@storybook/react-vite";
import { Radio, RadioGroup } from "./radio.js";

const meta: Meta<typeof RadioGroup> = {
  title: "Primitives/Radio",
  component: RadioGroup,
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: { type: "select" },
      options: ["horizontal", "vertical"],
    },
    disabled: { control: { type: "boolean" } },
  },
  args: { orientation: "vertical", disabled: false },
};
export default meta;

type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  render: () => (
    <RadioGroup name="plan" aria-label="Plan">
      <Radio value="a" label="Free" />
      <Radio value="b" label="Pro" />
      <Radio value="c" label="Enterprise" />
    </RadioGroup>
  ),
};

export const Selected: Story = {
  render: () => (
    <RadioGroup name="plan" aria-label="Plan" defaultValue="b">
      <Radio value="a" label="Free" />
      <Radio value="b" label="Pro" />
      <Radio value="c" label="Enterprise" />
    </RadioGroup>
  ),
};

export const Disabled: Story = {
  render: () => (
    <RadioGroup name="plan" aria-label="Plan" defaultValue="a">
      <Radio value="a" label="Free" />
      <Radio value="b" label="Pro" disabled />
      <Radio value="c" label="Enterprise" disabled />
    </RadioGroup>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <RadioGroup name="plan" aria-label="Plan" orientation="horizontal">
      <Radio value="a" label="Free" />
      <Radio value="b" label="Pro" />
      <Radio value="c" label="Enterprise" />
    </RadioGroup>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-8">
      {(["sm", "md"] as const).map((size) => (
        <RadioGroup
          key={size}
          name={`plan-${size}`}
          aria-label={`Plan ${size}`}
          defaultValue="a"
        >
          <Radio value="a" size={size} label={size} />
          <Radio value="b" size={size} label="Unselected" />
        </RadioGroup>
      ))}
    </div>
  ),
};

export const Orientations: Story = {
  render: () => (
    <div className="flex flex-wrap items-start gap-10">
      {(["vertical", "horizontal"] as const).map((orientation) => (
        <div key={orientation} className="flex flex-col gap-2">
          <span className="font-mono text-xs text-muted">{orientation}</span>
          <RadioGroup
            name={`plan-${orientation}`}
            aria-label={`Plan ${orientation}`}
            orientation={orientation}
            defaultValue="a"
          >
            <Radio value="a" label="Free" />
            <Radio value="b" label="Pro" />
          </RadioGroup>
        </div>
      ))}
    </div>
  ),
};
