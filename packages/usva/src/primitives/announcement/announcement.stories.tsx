import type { Meta, StoryObj } from "@storybook/react-vite";
import { Announcement } from "./announcement.js";

const meta: Meta<typeof Announcement> = {
  title: "Primitives/Announcement",
  component: Announcement,
  tags: ["autodocs"],
  argTypes: {
    tone: {
      control: { type: "select" },
      options: ["live", "accent", "accent-alt", "success", "warning", "danger"],
    },
  },
  args: { badge: "NEW", children: "v2.0.1 just shipped", tone: "live" },
};

export default meta;
type Story = StoryObj<typeof Announcement>;

export const Default: Story = {};

export const AsLink: Story = {
  args: { href: "/changelog" },
};

export const Tones: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Announcement badge="NEW" tone="live">
        v2.0.1 just shipped
      </Announcement>
      <Announcement badge="BETA" tone="accent">
        Try the new editor
      </Announcement>
      <Announcement badge="SOON" tone="warning">
        Pricing update incoming
      </Announcement>
    </div>
  ),
};
