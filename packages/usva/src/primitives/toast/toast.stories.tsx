import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect } from "react";
import { Toaster, type ToastType, toast, toastManager } from "./toast.js";

const meta: Meta<typeof Toaster> = {
  title: "Primitives/Toast",
  component: Toaster,
  tags: ["autodocs"],
  argTypes: {
    limit: { control: { type: "number" } },
    timeout: { control: { type: "number" } },
  },
  decorators: [
    (Story, { args }) => (
      <>
        <Story />
        <Toaster {...args} />
      </>
    ),
  ],
  args: { limit: 4 },
};
export default meta;

type Story = StoryObj<typeof Toaster>;

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
      className="rounded-md border border-border bg-surface px-4 py-2 text-sm text-ink transition-tint hover:bg-surface-2"
    >
      {children}
    </button>
  );
}

export const Success: Story = {
  render: () => (
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
  ),
};

export const Warning: Story = {
  render: () => (
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
  ),
};

export const Danger: Story = {
  render: () => (
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
  ),
};

export const Info: Story = {
  render: () => (
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
  ),
};

export const WithAction: Story = {
  render: () => (
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
  ),
};

const TYPES: readonly [ToastType, string][] = [
  ["success", "Saved"],
  ["warning", "Storage almost full"],
  ["danger", "Upload failed"],
  ["info", "New version available"],
];

function AllTypes() {
  useEffect(() => {
    const ids = TYPES.map(([type, title]) =>
      toast({ title, description: type, type, duration: 0 }),
    );
    return () => {
      for (const id of ids) toastManager.close(id);
    };
  }, []);
  return null;
}

export const Types: Story = {
  render: () => <AllTypes />,
};
