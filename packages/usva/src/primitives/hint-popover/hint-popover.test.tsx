import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it, vi } from "vitest";
import { HintPopover } from "./hint-popover.js";

function Sample({ onDismiss = vi.fn() }: { onDismiss?: () => void }) {
  return (
    <HintPopover
      tone="warning"
      title="Prerequisite not met"
      trigger={<button type="button">2 warnings</button>}
      action={
        <button type="button" onClick={onDismiss}>
          Dismiss
        </button>
      }
      openDelay={0}
      closeDelay={40}
    >
      MATH-201 must be completed before MATH-305.
    </HintPopover>
  );
}

describe("HintPopover", () => {
  it("opens on click", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    await user.click(screen.getByRole("button", { name: "2 warnings" }));
    expect(await screen.findByText("Prerequisite not met")).toBeInTheDocument();
  });

  it("opens on hover", async () => {
    render(<Sample />);
    fireEvent.pointerEnter(screen.getByRole("button", { name: "2 warnings" }), {
      pointerType: "mouse",
    });
    expect(await screen.findByText("Prerequisite not met")).toBeInTheDocument();
  });

  it("ignores hover from a touch pointer, leaving click to open it", async () => {
    render(<Sample />);
    fireEvent.pointerEnter(screen.getByRole("button", { name: "2 warnings" }), {
      pointerType: "touch",
    });
    await new Promise((r) => setTimeout(r, 30));
    expect(screen.queryByText("Prerequisite not met")).toBeNull();
  });

  it("survives the pointer travelling from trigger into the panel", async () => {
    render(<Sample />);
    const trigger = screen.getByRole("button", { name: "2 warnings" });

    fireEvent.pointerEnter(trigger, { pointerType: "mouse" });
    const panel = await screen.findByText("Prerequisite not met");

    // The pointer leaves the trigger, crosses the 8px gap, and lands on the
    // panel before the close delay elapses.
    fireEvent.pointerLeave(trigger, { pointerType: "mouse" });
    fireEvent.pointerEnter(panel.closest("[role]") ?? panel, {
      pointerType: "mouse",
    });

    await new Promise((r) => setTimeout(r, 80));
    expect(screen.getByText("Prerequisite not met")).toBeInTheDocument();
  });

  it("closes once the pointer leaves without reaching the panel", async () => {
    render(<Sample />);
    const trigger = screen.getByRole("button", { name: "2 warnings" });

    fireEvent.pointerEnter(trigger, { pointerType: "mouse" });
    await screen.findByText("Prerequisite not met");

    fireEvent.pointerLeave(trigger, { pointerType: "mouse" });
    await waitFor(() =>
      expect(screen.queryByText("Prerequisite not met")).toBeNull(),
    );
  });

  it("opens when the trigger takes keyboard focus", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    await user.tab();
    expect(await screen.findByText("Prerequisite not met")).toBeInTheDocument();
  });

  it("lets the keyboard reach and fire the action button", async () => {
    const onDismiss = vi.fn();
    const user = userEvent.setup();
    render(<Sample onDismiss={onDismiss} />);

    await user.tab();
    const dismiss = await screen.findByRole("button", { name: "Dismiss" });

    dismiss.focus();
    expect(dismiss).toHaveFocus();

    await user.keyboard("{Enter}");
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it("stays open after the trigger loses focus to the panel", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    await user.click(screen.getByRole("button", { name: "2 warnings" }));
    await screen.findByText("Prerequisite not met");

    // Base UI moves focus into the popup on open, blurring the trigger. A
    // close-on-blur would shut the panel the instant it appeared.
    await new Promise((r) => setTimeout(r, 80));
    expect(screen.getByText("Prerequisite not met")).toBeInTheDocument();
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    await user.click(screen.getByRole("button", { name: "2 warnings" }));
    await screen.findByText("Prerequisite not met");

    await user.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByText("Prerequisite not met")).toBeNull(),
    );
  });

  it("stays dismissed after Escape restores focus to the trigger", async () => {
    const user = userEvent.setup();
    render(<Sample />);
    await user.click(screen.getByRole("button", { name: "2 warnings" }));
    await screen.findByText("Prerequisite not met");

    await user.keyboard("{Escape}");
    await waitFor(() =>
      expect(screen.queryByText("Prerequisite not met")).toBeNull(),
    );

    await new Promise((r) => setTimeout(r, 60));
    expect(screen.queryByText("Prerequisite not met")).toBeNull();
  });

  it("has no a11y violations when open", async () => {
    const user = userEvent.setup();
    const { baseElement } = render(<Sample />);
    await user.click(screen.getByRole("button", { name: "2 warnings" }));
    await screen.findByText("Prerequisite not met");
    expect(await axe(baseElement)).toHaveNoViolations();
  });
});
