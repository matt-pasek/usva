import type { Meta, StoryObj } from "@storybook/react-vite";
import { LoadingOverlay } from "./loading-overlay.js";

const meta: Meta<typeof LoadingOverlay> = {
  title: "Primitives/LoadingOverlay",
  component: LoadingOverlay,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof LoadingOverlay>;

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
