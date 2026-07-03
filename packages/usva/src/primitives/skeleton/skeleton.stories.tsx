import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton } from "./skeleton.js";

const meta: Meta<typeof Skeleton> = {
  title: "Primitives/Skeleton",
  component: Skeleton,
  parameters: { chromatic: { pauseAnimationAtEnd: true } },
};
export default meta;

type Story = StoryObj<typeof Skeleton>;

export const Text: Story = {
  args: { variant: "text" },
};

export const Circle: Story = {
  render: () => <Skeleton variant="circle" width={48} height={48} />,
};

export const Rect: Story = {
  render: () => <Skeleton variant="rect" width={240} height={120} />,
};

export const CardComposed: Story = {
  render: () => (
    <div className="flex w-72 flex-col gap-3 rounded-lg border border-border p-4">
      <div className="flex items-center gap-3">
        <Skeleton variant="circle" width={40} height={40} />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="40%" />
        </div>
      </div>
      <Skeleton variant="rect" height={120} />
      <Skeleton variant="text" />
      <Skeleton variant="text" width="80%" />
    </div>
  ),
};
