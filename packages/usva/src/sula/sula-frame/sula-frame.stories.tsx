import type { Meta, StoryObj } from "@storybook/react-vite";
import { SulaFrame } from "./sula-frame.js";

const meta: Meta<typeof SulaFrame> = {
  title: "Sula/Frame",
  component: SulaFrame,
};
export default meta;

type Story = StoryObj<typeof SulaFrame>;

export const Wrapper: Story = {
  render: () => (
    <div className="grid min-h-96 place-items-center bg-bg p-10">
      <SulaFrame
        radius={20}
        thickness={2}
        className="rounded-[20px] bg-surface p-8"
      >
        <div className="max-w-xs text-center">
          <h2 className="text-2xl font-semibold text-ink">liquid frame</h2>
          <p className="mt-2 text-muted">hover the edge, or focus the button</p>
          <button
            type="button"
            className="mt-4 rounded-lg bg-accent px-4 py-2 text-bg"
          >
            focus me
          </button>
        </div>
      </SulaFrame>
    </div>
  ),
};

export const Thick: Story = {
  render: () => (
    <div className="grid min-h-96 place-items-center bg-bg p-10">
      <SulaFrame
        radius={28}
        thickness={5}
        className="rounded-[28px] bg-surface px-12 py-10"
      >
        <p className="text-muted">a bolder band</p>
      </SulaFrame>
    </div>
  ),
};

export const Static: Story = {
  render: () => (
    <div className="grid min-h-96 place-items-center bg-bg p-10">
      <SulaFrame
        fluid={false}
        radius={20}
        className="rounded-[20px] bg-surface p-8"
      >
        <p className="text-muted">fluid off: the static fallback border</p>
      </SulaFrame>
    </div>
  ),
};
