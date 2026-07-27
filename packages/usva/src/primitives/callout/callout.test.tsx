import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it, vi } from "vitest";
import { Callout } from "./callout.js";

describe("Callout", () => {
  it("renders the title and the body", () => {
    render(
      <Callout title="Rate limit reached">
        You have used 4,900 of 5,000 requests this hour.
      </Callout>,
    );
    expect(screen.getByText("Rate limit reached")).toBeInTheDocument();
    expect(
      screen.getByText("You have used 4,900 of 5,000 requests this hour."),
    ).toBeInTheDocument();
  });

  it("is a status region on the calm tones", () => {
    render(<Callout tone="info">Heads up.</Callout>);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("interrupts only on danger", () => {
    render(<Callout tone="danger">The upload failed.</Callout>);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("takes an explicit role over the tone default", () => {
    render(
      <Callout tone="danger" role="status">
        The upload failed.
      </Callout>,
    );
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("tints the block with the tone", () => {
    const { container } = render(<Callout tone="warning">Careful.</Callout>);
    expect(container.innerHTML).toContain("bg-warning");
  });

  it("neutral carries no icon and no tint", () => {
    const { container } = render(<Callout>Just a note.</Callout>);
    expect(container.querySelector("svg")).toBeNull();
    expect(container.innerHTML).not.toContain("bg-info");
  });

  it("renders the action slot", () => {
    render(
      <Callout tone="warning" action={<button type="button">Upgrade</button>}>
        Careful.
      </Callout>,
    );
    expect(screen.getByRole("button", { name: "Upgrade" })).toBeInTheDocument();
  });

  it("is not dismissible by default", () => {
    render(<Callout tone="info">Heads up.</Callout>);
    expect(screen.queryByRole("button", { name: /dismiss/i })).toBeNull();
  });

  it("dismissible removes the callout and reports it", async () => {
    const onDismiss = vi.fn();
    render(
      <Callout tone="info" dismissible onDismiss={onDismiss}>
        Heads up.
      </Callout>,
    );
    await userEvent.click(screen.getByRole("button", { name: /dismiss/i }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(screen.queryByText("Heads up.")).toBeNull();
  });

  it("hides the tone icon from assistive tech", () => {
    const { container } = render(<Callout tone="success">Saved.</Callout>);
    expect(container.querySelector("svg")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("no a11y violations", async () => {
    const { container } = render(
      <Callout
        tone="warning"
        title="Rate limit reached"
        dismissible
        action={<button type="button">Upgrade</button>}
      >
        You have used 4,900 of 5,000 requests this hour.
      </Callout>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
