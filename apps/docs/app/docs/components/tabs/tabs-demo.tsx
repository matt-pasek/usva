"use client";
import { Tabs } from "@matt-pasek/usva";
import { useState } from "react";

export function TabsDemo() {
  const [value, setValue] = useState("account");

  return (
    <div className="flex flex-col gap-6">
      <Tabs value={value} onValueChange={setValue} className="w-full">
        <Tabs.List>
          <Tabs.Tab value="account">Account</Tabs.Tab>
          <Tabs.Tab value="password">Password</Tabs.Tab>
          <Tabs.Tab value="team" disabled>
            Team
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="account">Manage your account details.</Tabs.Panel>
        <Tabs.Panel value="password">Change your password.</Tabs.Panel>
        <Tabs.Panel value="team">Invite and manage teammates.</Tabs.Panel>
      </Tabs>

      <Tabs
        defaultValue="general"
        orientation="vertical"
        className="flex gap-6"
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
    </div>
  );
}
