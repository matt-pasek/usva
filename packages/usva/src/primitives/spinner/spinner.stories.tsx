import type { Meta, StoryObj } from "@storybook/react-vite";
import { PageLoader, Spinner } from "./spinner.js";

const meta: Meta<typeof Spinner> = {
  title: "Primitives/Spinner",
  component: Spinner,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["ring", "dots", "bars", "orbit"],
    },
    size: { control: { type: "select" }, options: ["sm", "md", "lg"] },
    tone: { control: { type: "select" }, options: ["accent", "current"] },
  },
  args: { label: "Loading", variant: "ring", size: "md", tone: "accent" },
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

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-8">
      {(["ring", "dots", "bars", "orbit"] as const).map((variant) => (
        <div key={variant} className="flex flex-col items-center gap-2">
          <Spinner variant={variant} />
          <span className="font-mono text-xs text-muted">{variant}</span>
        </div>
      ))}
    </div>
  ),
};

export const Tones: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-8 text-ink">
      {(["accent", "current"] as const).map((tone) => (
        <div key={tone} className="flex flex-col items-center gap-2">
          <Spinner tone={tone} />
          <span className="font-mono text-xs text-muted">{tone}</span>
        </div>
      ))}
    </div>
  ),
};

export const Page: StoryObj<typeof PageLoader> = {
  render: () => <PageLoader label="Loading your workspace" />,
};
