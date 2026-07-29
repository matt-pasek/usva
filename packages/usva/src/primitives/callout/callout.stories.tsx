import type { Meta, StoryObj } from "@storybook/react-vite";
import { themeModes } from "../../../.storybook/modes.js";
import { Callout } from "./callout.js";

const meta: Meta<typeof Callout> = {
  parameters: {
    chromatic: { modes: themeModes },
  },
  title: "Primitives/Callout",
  component: Callout,
  tags: ["autodocs"],
  argTypes: {
    tone: {
      control: { type: "select" },
      options: ["neutral", "info", "success", "warning", "danger"],
    },
    dismissible: { control: { type: "boolean" } },
  },
  args: {
    tone: "info",
    title: "Rate limit reached",
    children: "You have used 4,900 of your 5,000 requests this hour.",
    dismissible: false,
  },
};

export default meta;
type Story = StoryObj<typeof Callout>;

export const Default: Story = {};

export const Tones: Story = {
  render: () => (
    <div className="flex max-w-lg flex-col gap-3">
      <Callout title="A note">Nothing is wrong. This is just context.</Callout>
      <Callout tone="info" title="Heads up">
        The next release moves this export to a subpath.
      </Callout>
      <Callout tone="success" title="Saved">
        Your changes are live.
      </Callout>
      <Callout tone="warning" title="Rate limit reached">
        You have used 4,900 of your 5,000 requests this hour.
      </Callout>
      <Callout tone="danger" title="Upload failed">
        The file was larger than the 25 MB limit.
      </Callout>
    </div>
  ),
};

export const BodyOnly: Story = {
  args: { title: undefined, tone: "neutral" },
};

export const WithAction: Story = {
  args: {
    tone: "warning",
    action: (
      <button
        type="button"
        className="rounded-md border border-border-strong px-3 py-1.5 font-medium text-xs text-ink"
      >
        Upgrade plan
      </button>
    ),
  },
};

export const Dismissible: Story = {
  args: { dismissible: true },
};
