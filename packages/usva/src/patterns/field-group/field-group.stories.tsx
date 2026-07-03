import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "../../primitives/input/input.js";
import {
  FieldControl,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "./field-group.js";

const meta: Meta<typeof FieldGroup> = {
  title: "Patterns/FieldGroup",
  component: FieldGroup,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FieldGroup>;

export const Default: Story = {
  render: () => (
    <FieldGroup>
      <FieldLabel>Email address</FieldLabel>
      <FieldControl>
        <Input placeholder="you@example.com" />
      </FieldControl>
      <FieldDescription>We only use this to send receipts.</FieldDescription>
    </FieldGroup>
  ),
};

export const WithError: Story = {
  render: () => (
    <FieldGroup>
      <FieldLabel>Email address</FieldLabel>
      <FieldControl>
        <Input defaultValue="not-an-email" />
      </FieldControl>
      <FieldError>Enter a valid email address.</FieldError>
    </FieldGroup>
  ),
};

export const DescriptionAndError: Story = {
  render: () => (
    <FieldGroup>
      <FieldLabel>Password</FieldLabel>
      <FieldControl>
        <Input type="password" defaultValue="short" />
      </FieldControl>
      <FieldDescription>At least 12 characters.</FieldDescription>
      <FieldError>Password is too short.</FieldError>
    </FieldGroup>
  ),
};
