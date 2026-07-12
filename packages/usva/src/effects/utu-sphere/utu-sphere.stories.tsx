import type { Meta, StoryObj } from "@storybook/react-vite";
import { UtuSphere } from "./utu-sphere.js";

const meta: Meta<typeof UtuSphere> = {
  title: "Effects/UtuSphere",
  component: UtuSphere,
};
export default meta;

type Story = StoryObj<typeof UtuSphere>;

export const Hero: Story = {
  render: () => (
    <UtuSphere className="grid min-h-[32rem] place-items-center rounded-2xl bg-bg p-10">
      <div className="max-w-md text-center">
        <h1 className="text-4xl font-semibold text-ink">a faint glow</h1>
        <p className="mt-3 text-muted">
          fog that turns and breathes, and leaves the words clear.
        </p>
      </div>
    </UtuSphere>
  ),
};

export const Interactive: Story = {
  render: () => (
    <UtuSphere
      interactive
      className="grid min-h-[32rem] place-items-center rounded-2xl bg-bg p-10"
    >
      <p className="text-muted">move the cursor and the volume leans</p>
    </UtuSphere>
  ),
};

export const DenseBands: Story = {
  render: () => (
    <UtuSphere
      bands={12}
      speed={1.3}
      className="min-h-[32rem] rounded-2xl bg-bg"
    />
  ),
};

export const Bare: Story = {
  render: () => <UtuSphere className="min-h-[32rem] rounded-2xl bg-bg" />,
};
