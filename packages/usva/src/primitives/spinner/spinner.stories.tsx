import type { Meta, StoryObj } from "@storybook/react-vite";
import { PageLoader, Spinner } from "./spinner.js";

const meta: Meta<typeof Spinner> = {
  title: "Primitives/Spinner",
  component: Spinner,
  tags: ["autodocs"],
  args: { label: "Loading" },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Small: Story = { args: { size: "sm" } };
export const Medium: Story = { args: { size: "md" } };
export const Large: Story = { args: { size: "lg" } };

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
    </div>
  ),
};

export const Page: StoryObj<typeof PageLoader> = {
  render: () => <PageLoader label="Loading your workspace" />,
};
