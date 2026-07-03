import type { Meta, StoryObj } from "@storybook/react-vite";
import { Dialog } from "./dialog.js";

const meta: Meta<typeof Dialog> = {
  title: "Primitives/Dialog",
  component: Dialog,
};
export default meta;

type Story = StoryObj<typeof Dialog>;

export const Closed: Story = {
  render: () => (
    <Dialog>
      <Dialog.Trigger className="rounded-md border border-border bg-surface px-4 py-2 text-sm text-ink">
        Open dialog
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Confirm action</Dialog.Title>
        <Dialog.Description>This can&apos;t be undone.</Dialog.Description>
        <Dialog.Close className="mt-4 rounded-md border border-border px-3 py-1.5 text-sm">
          Close
        </Dialog.Close>
      </Dialog.Content>
    </Dialog>
  ),
};

export const Open: Story = {
  render: () => (
    <Dialog defaultOpen>
      <Dialog.Trigger className="rounded-md border border-border bg-surface px-4 py-2 text-sm text-ink">
        Open dialog
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Confirm action</Dialog.Title>
        <Dialog.Description>This can&apos;t be undone.</Dialog.Description>
        <Dialog.Close className="mt-4 rounded-md border border-border px-3 py-1.5 text-sm">
          Close
        </Dialog.Close>
      </Dialog.Content>
    </Dialog>
  ),
};

export const LongContentScroll: Story = {
  render: () => (
    <Dialog defaultOpen>
      <Dialog.Trigger className="rounded-md border border-border bg-surface px-4 py-2 text-sm text-ink">
        Open dialog
      </Dialog.Trigger>
      <Dialog.Content className="max-h-[80vh] overflow-y-auto">
        <Dialog.Title>Terms of service</Dialog.Title>
        <div className="mt-4 flex flex-col gap-3 text-sm text-muted">
          {Array.from({ length: 24 }, (_, i) => `section-${i + 1}`).map(
            (id, i) => (
              <p key={id}>
                Section {i + 1}: lorem ipsum dolor sit amet, consectetur
                adipiscing elit, sed do eiusmod tempor incididunt.
              </p>
            ),
          )}
        </div>
        <Dialog.Close className="mt-4 rounded-md border border-border px-3 py-1.5 text-sm">
          Close
        </Dialog.Close>
      </Dialog.Content>
    </Dialog>
  ),
};

export const NoTitleAriaLabelled: Story = {
  render: () => (
    <Dialog defaultOpen>
      <Dialog.Trigger className="rounded-md border border-border bg-surface px-4 py-2 text-sm text-ink">
        Open dialog
      </Dialog.Trigger>
      <Dialog.Content aria-label="Quick actions">
        <p className="text-sm text-muted">No visible title, aria-labelled.</p>
        <Dialog.Close className="mt-4 rounded-md border border-border px-3 py-1.5 text-sm">
          Close
        </Dialog.Close>
      </Dialog.Content>
    </Dialog>
  ),
};
