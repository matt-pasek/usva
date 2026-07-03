"use client";
import { Popover } from "@matt-pasek/usva";

export function PopoverDemo() {
  return (
    <Popover>
      <Popover.Trigger className="rounded-md border border-border bg-surface px-4 py-2 text-sm text-ink transition-colors hover:bg-surface-2">
        Open popover
      </Popover.Trigger>
      <Popover.Content>
        <Popover.Title>Notifications</Popover.Title>
        <Popover.Description>
          You have no new notifications.
        </Popover.Description>
      </Popover.Content>
    </Popover>
  );
}
