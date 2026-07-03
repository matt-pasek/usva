import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tabs } from "./tabs.js";

const meta: Meta<typeof Tabs> = {
  title: "Primitives/Tabs",
  component: Tabs,
};
export default meta;

type Story = StoryObj<typeof Tabs>;

export const TwoTabs: Story = {
  render: () => (
    <Tabs defaultValue="account" className="w-80">
      <Tabs.List>
        <Tabs.Tab value="account">Account</Tabs.Tab>
        <Tabs.Tab value="password">Password</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="account">Manage your account details.</Tabs.Panel>
      <Tabs.Panel value="password">Change your password.</Tabs.Panel>
    </Tabs>
  ),
};

export const ManyTabs: Story = {
  render: () => (
    <Tabs defaultValue="overview" className="w-96">
      <Tabs.List>
        <Tabs.Tab value="overview">Overview</Tabs.Tab>
        <Tabs.Tab value="activity">Activity</Tabs.Tab>
        <Tabs.Tab value="billing">Billing</Tabs.Tab>
        <Tabs.Tab value="settings">Settings</Tabs.Tab>
        <Tabs.Tab value="team">Team</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="overview">Overview content.</Tabs.Panel>
      <Tabs.Panel value="activity">Activity content.</Tabs.Panel>
      <Tabs.Panel value="billing">Billing content.</Tabs.Panel>
      <Tabs.Panel value="settings">Settings content.</Tabs.Panel>
      <Tabs.Panel value="team">Team content.</Tabs.Panel>
    </Tabs>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Tabs
      defaultValue="general"
      orientation="vertical"
      className="flex w-96 gap-4"
    >
      <Tabs.List className="flex-col">
        <Tabs.Tab value="general">General</Tabs.Tab>
        <Tabs.Tab value="security">Security</Tabs.Tab>
        <Tabs.Tab value="notifications">Notifications</Tabs.Tab>
      </Tabs.List>
      <div className="flex-1">
        <Tabs.Panel value="general">General settings.</Tabs.Panel>
        <Tabs.Panel value="security">Security settings.</Tabs.Panel>
        <Tabs.Panel value="notifications">Notification settings.</Tabs.Panel>
      </div>
    </Tabs>
  ),
};

export const DisabledTab: Story = {
  render: () => (
    <Tabs defaultValue="one" className="w-80">
      <Tabs.List>
        <Tabs.Tab value="one">One</Tabs.Tab>
        <Tabs.Tab value="two" disabled>
          Two (disabled)
        </Tabs.Tab>
        <Tabs.Tab value="three">Three</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="one">Panel one.</Tabs.Panel>
      <Tabs.Panel value="two">Panel two.</Tabs.Panel>
      <Tabs.Panel value="three">Panel three.</Tabs.Panel>
    </Tabs>
  ),
};
