import type { Meta, StoryObj } from "@storybook/react-vite";
import { EmptyState } from "./empty-state.js";

const meta: Meta<typeof EmptyState> = {
  title: "Patterns/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
  argTypes: {
    variant: {
      control: { type: "select" },
      options: ["solid", "dashed"],
    },
  },
  args: {
    title: "No projects yet",
    description: "Create your first project to see it here.",
    variant: "solid",
  },
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Solid: Story = {};

export const Dashed: Story = {
  args: { variant: "dashed" },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      {(["solid", "dashed"] as const).map((variant) => (
        <EmptyState
          key={variant}
          variant={variant}
          title={`variant: ${variant}`}
          description="Create your first project to see it here."
        />
      ))}
    </div>
  ),
};

export const WithIconAndAction: Story = {
  args: {
    variant: "dashed",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        aria-hidden="true"
      >
        <path d="M12 5v14M5 12h14" strokeLinecap="round" />
      </svg>
    ),
    action: (
      <button
        type="button"
        className="rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-sm text-ink"
      >
        New project
      </button>
    ),
  },
};
