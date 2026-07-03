import type { Meta, StoryObj } from "@storybook/react-vite";
import { ToastProvider, toast } from "./toast.js";

const meta: Meta<typeof ToastProvider> = {
  title: "Primitives/Toast",
  component: ToastProvider,
};
export default meta;

type Story = StoryObj<typeof ToastProvider>;

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

export const Success: Story = {
  render: () => (
    <ToastProvider>
      <TriggerButton
        onClick={() =>
          toast({
            title: "Saved",
            description: "Your changes are live.",
            type: "success",
          })
        }
      >
        Show success toast
      </TriggerButton>
    </ToastProvider>
  ),
};

export const Warning: Story = {
  render: () => (
    <ToastProvider>
      <TriggerButton
        onClick={() =>
          toast({
            title: "Storage almost full",
            description: "You're at 92% of your quota.",
            type: "warning",
          })
        }
      >
        Show warning toast
      </TriggerButton>
    </ToastProvider>
  ),
};

export const Danger: Story = {
  render: () => (
    <ToastProvider>
      <TriggerButton
        onClick={() =>
          toast({
            title: "Upload failed",
            description: "Check your connection and try again.",
            type: "danger",
          })
        }
      >
        Show danger toast
      </TriggerButton>
    </ToastProvider>
  ),
};

export const Info: Story = {
  render: () => (
    <ToastProvider>
      <TriggerButton
        onClick={() =>
          toast({
            title: "New version available",
            description: "Refresh to update.",
            type: "info",
          })
        }
      >
        Show info toast
      </TriggerButton>
    </ToastProvider>
  ),
};

export const WithAction: Story = {
  render: () => (
    <ToastProvider>
      <TriggerButton
        onClick={() =>
          toast({
            title: "Conversation archived",
            action: { label: "Undo", onClick: () => {} },
          })
        }
      >
        Show toast with action
      </TriggerButton>
    </ToastProvider>
  ),
};
