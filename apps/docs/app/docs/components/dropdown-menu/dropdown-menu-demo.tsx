"use client";
import { DropdownMenu } from "@matt-pasek/usva";

export function DropdownMenuDemo() {
  return (
    <div className="flex flex-wrap gap-4">
      <DropdownMenu>
        <DropdownMenu.Trigger className="rounded-md border border-border px-3 py-1.5 text-sm text-ink">
          Open menu
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          <DropdownMenu.Label>Actions</DropdownMenu.Label>
          <DropdownMenu.Item>Edit</DropdownMenu.Item>
          <DropdownMenu.Item>Duplicate</DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.Item disabled>Delete (disabled)</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>
    </div>
  );
}
