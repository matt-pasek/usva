"use client";
import { Switch } from "@matt-pasek/usva";
import { useState } from "react";

export function SwitchDemo() {
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <Switch
        label="Notifications"
        description="Enable push notifications for updates."
        checked={checked}
        onCheckedChange={setChecked}
      />
      <Switch label="Off" />
      <Switch label="On by default" defaultChecked />
      <Switch label="Disabled" disabled />
      <Switch label="Small" size="sm" />
    </div>
  );
}
