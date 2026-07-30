"use client";
import { notify, Toaster, toast } from "@usva-ui/react/primitives/toast";

function TriggerButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-md border border-border bg-surface px-4 py-2 text-sm text-ink transition-colors hover:bg-surface-2"
    >
      {children}
    </button>
  );
}

export function ToastDemo() {
  return (
    <>
      <div className="flex flex-wrap gap-2">
        <TriggerButton
          onClick={() =>
            notify.success("Saved", { description: "Your changes are live." })
          }
        >
          Success
        </TriggerButton>
        <TriggerButton
          onClick={() =>
            notify.warning("Storage almost full", {
              description: "You're at 92% of your quota.",
            })
          }
        >
          Warning
        </TriggerButton>
        <TriggerButton
          onClick={() =>
            notify.error("Upload failed", {
              description: "Check your connection and try again.",
            })
          }
        >
          Danger
        </TriggerButton>
        <TriggerButton
          onClick={() =>
            notify.info("New version available", {
              description: "Refresh to update.",
            })
          }
        >
          Info
        </TriggerButton>
        <TriggerButton
          onClick={() =>
            toast({
              title: "Conversation archived",
              action: { label: "Undo", onClick: () => {} },
            })
          }
        >
          With action
        </TriggerButton>
      </div>
      <Toaster />
    </>
  );
}
