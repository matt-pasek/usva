import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { afterEach, describe, expect, it } from "vitest";
import { notify, ToastProvider, toast } from "./toast.js";

function Trigger({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  );
}

async function dismissAll() {
  const closeButtons = screen.queryAllByRole("button", { name: /dismiss/i });
  for (const button of closeButtons) {
    await userEvent.click(button);
  }
  await waitFor(() => {
    expect(screen.queryAllByRole("button", { name: /dismiss/i })).toHaveLength(
      0,
    );
  });
}

describe("Toast", () => {
  afterEach(async () => {
    await dismissAll();
  });

  it("toast() renders a toast from anywhere the provider is mounted", async () => {
    render(
      <ToastProvider>
        <Trigger onClick={() => toast({ title: "Saved" })}>go</Trigger>
      </ToastProvider>,
    );
    await userEvent.click(screen.getByText("go"));
    expect(await screen.findByText("Saved")).toBeInTheDocument();
  });

  it("renders a description alongside the title", async () => {
    render(
      <ToastProvider>
        <Trigger
          onClick={() =>
            toast({ title: "Uploaded", description: "3 files added." })
          }
        >
          go
        </Trigger>
      </ToastProvider>,
    );
    await userEvent.click(screen.getByText("go"));
    expect(await screen.findByText("Uploaded")).toBeInTheDocument();
    expect(screen.getByText("3 files added.")).toBeInTheDocument();
  });

  it("applies status styling for the type variant", async () => {
    render(
      <ToastProvider>
        <Trigger onClick={() => toast({ title: "Deleted", type: "danger" })}>
          go
        </Trigger>
      </ToastProvider>,
    );
    await userEvent.click(screen.getByText("go"));
    const title = await screen.findByText("Deleted");
    const root = title.closest("[data-type]");
    expect(root).toHaveAttribute("data-type", "danger");
  });

  it("renders an action button when action is provided", async () => {
    render(
      <ToastProvider>
        <Trigger
          onClick={() =>
            toast({
              title: "Archived",
              action: { label: "Undo", onClick: () => {} },
            })
          }
        >
          go
        </Trigger>
      </ToastProvider>,
    );
    await userEvent.click(screen.getByText("go"));
    expect(await screen.findByText("Archived")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Undo" })).toBeInTheDocument();
  });

  it("notify.* sugar shows a typed toast", async () => {
    render(
      <ToastProvider>
        <Trigger
          onClick={() => notify.success("Saved", { description: "Live now." })}
        >
          go
        </Trigger>
      </ToastProvider>,
    );
    await userEvent.click(screen.getByText("go"));
    const title = await screen.findByText("Saved");
    expect(title.closest("[data-type]")).toHaveAttribute(
      "data-type",
      "success",
    );
    expect(screen.getByText("Live now.")).toBeInTheDocument();
  });

  it("no a11y violations on a shown toast", async () => {
    const { container } = render(
      <ToastProvider>
        <Trigger
          onClick={() =>
            toast({ title: "Saved", description: "Your changes are live." })
          }
        >
          go
        </Trigger>
      </ToastProvider>,
    );
    await userEvent.click(screen.getByText("go"));
    await screen.findByText("Saved");
    expect(await axe(container)).toHaveNoViolations();
  });
});
