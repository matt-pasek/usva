import type { Meta, StoryObj } from "@storybook/react-vite";
import { Radio, RadioGroup } from "./radio.js";

const meta: Meta<typeof RadioGroup> = {
  title: "Primitives/Radio",
  component: RadioGroup,
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
