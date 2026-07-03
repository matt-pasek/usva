"use client";
import { Dialog } from "@matt-pasek/usva";

export function DialogDemo() {
  return (
    <Dialog>
      <Dialog.Trigger className="rounded-md border border-border bg-surface px-4 py-2 text-sm text-ink transition-colors hover:bg-surface-2">
        Open dialog
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Confirm action</Dialog.Title>
        <Dialog.Description>
          This can&apos;t be undone. Are you sure you want to continue?
        </Dialog.Description>
        <div className="mt-4 flex justify-end gap-2">
          <Dialog.Close className="rounded-md border border-border px-3 py-1.5 text-sm text-ink">
            Cancel
          </Dialog.Close>
        </div>
      </Dialog.Content>
    </Dialog>
  );
}
