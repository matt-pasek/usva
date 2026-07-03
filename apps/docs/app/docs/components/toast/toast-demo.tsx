"use client";
import { ToastProvider, toast } from "@matt-pasek/usva";

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
    <ToastProvider>
      <div className="flex flex-wrap gap-2">
        <TriggerButton
          onClick={() =>
            toast({
              title: "Saved",
              description: "Your changes are live.",
              type: "success",
            })
          }
        >
          Success
        </TriggerButton>
        <TriggerButton
          onClick={() =>
            toast({
              title: "Storage almost full",
              description: "You're at 92% of your quota.",
              type: "warning",
            })
          }
        >
          Warning
        </TriggerButton>
        <TriggerButton
          onClick={() =>
            toast({
              title: "Upload failed",
              description: "Check your connection and try again.",
              type: "danger",
            })
          }
        >
          Danger
        </TriggerButton>
        <TriggerButton
          onClick={() =>
            toast({
              title: "New version available",
              description: "Refresh to update.",
              type: "info",
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
    </ToastProvider>
  );
}
