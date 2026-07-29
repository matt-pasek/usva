import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { afterEach, describe, expect, it } from "vitest";
import { notify, Toaster, toast } from "./toast.js";

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

function withToaster(trigger: React.ReactNode) {
  return (
    <>
      {trigger}
      <Toaster />
    </>
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

  it("toast() renders a toast from anywhere a Toaster is mounted", async () => {
    render(
      withToaster(
        <Trigger onClick={() => toast({ title: "Saved" })}>go</Trigger>,
      ),
    );
    await userEvent.click(screen.getByText("go"));
    expect(await screen.findByText("Saved")).toBeInTheDocument();
  });

  it("renders a description alongside the title", async () => {
    render(
      withToaster(
        <Trigger
          onClick={() =>
            toast({ title: "Uploaded", description: "3 files added." })
          }
        >
          go
        </Trigger>,
      ),
    );
    await userEvent.click(screen.getByText("go"));
    expect(await screen.findByText("Uploaded")).toBeInTheDocument();
    expect(screen.getByText("3 files added.")).toBeInTheDocument();
  });

  it("applies status styling for the type variant", async () => {
    render(
      withToaster(
        <Trigger onClick={() => toast({ title: "Deleted", type: "danger" })}>
          go
        </Trigger>,
      ),
    );
    await userEvent.click(screen.getByText("go"));
    const title = await screen.findByText("Deleted");
    const root = title.closest("[data-type]");
    expect(root).toHaveAttribute("data-type", "danger");
  });

  it("renders an action button when action is provided", async () => {
    render(
      withToaster(
        <Trigger
          onClick={() =>
            toast({
              title: "Archived",
              action: { label: "Undo", onClick: () => {} },
            })
          }
        >
          go
        </Trigger>,
      ),
    );
    await userEvent.click(screen.getByText("go"));
    expect(await screen.findByText("Archived")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Undo" })).toBeInTheDocument();
  });

  it("notify.* sugar shows a typed toast", async () => {
    render(
      withToaster(
        <Trigger
          onClick={() => notify.success("Saved", { description: "Live now." })}
        >
          go
        </Trigger>,
      ),
    );
    await userEvent.click(screen.getByText("go"));
    const title = await screen.findByText("Saved");
    expect(title.closest("[data-type]")).toHaveAttribute(
      "data-type",
      "success",
    );
    expect(screen.getByText("Live now.")).toBeInTheDocument();
  });

  it("notify() needs no provider around the call site", async () => {
    function Deep() {
      return <Trigger onClick={() => notify.info("Deep")}>go</Trigger>;
    }
    render(
      <>
        <Deep />
        <Toaster />
      </>,
    );
    await userEvent.click(screen.getByText("go"));
    expect(await screen.findByText("Deep")).toBeInTheDocument();
  });

  /**
   * `toastManager.add` emits into a listener Set that only the mounted viewport
   * subscribes to. With no Toaster on screen there is no listener, so the toast is
   * dropped rather than queued. Callers that fire during module init will lose it.
   */
  it("drops toasts fired before a Toaster mounts", async () => {
    const id = notify.info("Too early");
    expect(id).toEqual(expect.any(String));

    render(<Toaster />);

    await waitFor(() => {
      expect(screen.queryByText("Too early")).not.toBeInTheDocument();
    });
  });

  it("no a11y violations on a shown toast", async () => {
    const { container } = render(
      withToaster(
        <Trigger
          onClick={() =>
            toast({ title: "Saved", description: "Your changes are live." })
          }
        >
          go
        </Trigger>,
      ),
    );
    await userEvent.click(screen.getByText("go"));
    await screen.findByText("Saved");
    expect(await axe(container)).toHaveNoViolations();
  });
});
