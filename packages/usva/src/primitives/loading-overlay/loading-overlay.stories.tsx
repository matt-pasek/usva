import type { Meta, StoryObj } from "@storybook/react-vite";
import type { ReactNode } from "react";
import { LoadingOverlay } from "./loading-overlay.js";

const meta: Meta<typeof LoadingOverlay> = {
  title: "Primitives/LoadingOverlay",
  component: LoadingOverlay,
  tags: ["autodocs"],
  argTypes: {
    contain: {
      control: { type: "select" },
      options: ["viewport", "parent"],
    },
    variant: {
      control: { type: "select" },
      options: ["ring", "dots", "bars", "orbit"],
    },
    size: {
      control: { type: "select" },
      options: ["sm", "md", "lg"],
    },
    tone: {
      control: { type: "select" },
      options: ["accent", "current"],
    },
    blur: { control: { type: "boolean" } },
  },
  args: {
    contain: "parent",
    variant: "ring",
    size: "lg",
    tone: "accent",
    blur: true,
    label: "Fetching courses",
  },
};

export default meta;
type Story = StoryObj<typeof LoadingOverlay>;

function Panel({ children }: { children: ReactNode }) {
  return (
    <div className="relative h-40 w-56 overflow-hidden rounded-2xl border border-border bg-surface">
      {children}
    </div>
  );
}

export const OverAPanel: Story = {
  render: () => (
    <div className="relative h-64 w-full overflow-hidden rounded-2xl border border-border bg-surface p-6">
      <p className="text-sm text-muted">
        Content underneath, dimmed and blurred by the overlay.
      </p>
      <LoadingOverlay contain="parent" label="Fetching courses" />
    </div>
  ),
};

export const WithoutBlur: Story = {
  render: () => (
    <div className="relative h-64 w-full overflow-hidden rounded-2xl border border-border bg-surface p-6">
      <p className="text-sm text-muted">Scrim only, no backdrop blur.</p>
      <LoadingOverlay contain="parent" blur={false} variant="bars" />
    </div>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {(["ring", "dots", "bars", "orbit"] as const).map((variant) => (
        <Panel key={variant}>
          <LoadingOverlay contain="parent" variant={variant} label={variant} />
        </Panel>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {(["sm", "md", "lg"] as const).map((size) => (
        <Panel key={size}>
          <LoadingOverlay contain="parent" size={size} label={size} />
        </Panel>
      ))}
    </div>
  ),
};

export const Tones: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      {(["accent", "current"] as const).map((tone) => (
        <Panel key={tone}>
          <LoadingOverlay contain="parent" tone={tone} label={tone} />
        </Panel>
      ))}
    </div>
  ),
};
