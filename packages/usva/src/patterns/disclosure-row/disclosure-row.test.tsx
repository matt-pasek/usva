import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { DisclosureRow } from "./disclosure-row.js";

describe("DisclosureRow", () => {
  it("renders the summary inside the button", () => {
    render(<DisclosureRow summary="Core studies">panel</DisclosureRow>);
    expect(
      screen.getByRole("button", { name: "Core studies" }),
    ).toBeInTheDocument();
  });

  it("starts closed and points the button at its panel", () => {
    const { container } = render(
      <DisclosureRow summary="Core studies">panel</DisclosureRow>,
    );
    const button = screen.getByRole("button");
    const panel = container.querySelector("[data-disclosure-panel]");
    expect(button).toHaveAttribute("aria-expanded", "false");
    expect(button).toHaveAttribute("aria-controls", panel?.id);
  });

  it("opens on click and reports the change", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <DisclosureRow summary="Core studies" onOpenChange={onOpenChange}>
        panel
      </DisclosureRow>,
    );

    await user.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
  });

  it("honours defaultOpen", () => {
    render(
      <DisclosureRow defaultOpen summary="Core studies">
        panel
      </DisclosureRow>,
    );
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
  });

  it("obeys a controlled open prop and never moves on its own", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <DisclosureRow
        summary="Core studies"
        open={false}
        onOpenChange={onOpenChange}
      >
        panel
      </DisclosureRow>,
    );

    await user.click(screen.getByRole("button"));
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("follows a controlled parent", async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [open, setOpen] = useState(false);
      return (
        <DisclosureRow
          summary="Core studies"
          open={open}
          onOpenChange={setOpen}
        >
          panel
        </DisclosureRow>
      );
    }
    render(<Controlled />);

    await user.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "true");
  });

  /** The panel stays mounted so it can animate, so it must not stay tabbable. */
  it("holds a closed panel inert and releases it on open", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <DisclosureRow summary="Core studies">
        <a href="/course">Course</a>
      </DisclosureRow>,
    );
    const panel = container.querySelector("[data-disclosure-panel]");
    expect(panel).toHaveAttribute("inert");

    await user.click(screen.getByRole("button"));
    expect(panel).not.toHaveAttribute("inert");
  });

  it("keeps the panel content mounted while closed", () => {
    render(
      <DisclosureRow summary="Core studies">
        <span data-testid="panel">Course</span>
      </DisclosureRow>,
    );
    expect(screen.getByTestId("panel")).toBeInTheDocument();
  });

  it("does not toggle while disabled", async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <DisclosureRow
        disabled
        summary="Core studies"
        onOpenChange={onOpenChange}
      >
        panel
      </DisclosureRow>,
    );

    await user.click(screen.getByRole("button"));
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.getByRole("button")).toHaveAttribute(
      "aria-expanded",
      "false",
    );
  });

  it("paints the rail with an arbitrary categorical color", () => {
    const { container } = render(
      <DisclosureRow summary="Core studies" railColor="#52c989">
        panel
      </DisclosureRow>,
    );
    const rail = container.querySelector('span[aria-hidden="true"]');
    expect(rail).toHaveStyle({ backgroundColor: "#52c989" });
  });

  it("draws no rail without a color", () => {
    const { container } = render(
      <DisclosureRow summary="Core studies">panel</DisclosureRow>,
    );
    expect(container.querySelector('span[aria-hidden="true"]')).toBeNull();
  });

  it("renders the aside slot", () => {
    render(
      <DisclosureRow summary="Core studies" aside={<span>76 / 193</span>}>
        panel
      </DisclosureRow>,
    );
    expect(screen.getByText("76 / 193")).toBeInTheDocument();
  });

  it("names the button when the summary is not plain text", () => {
    render(
      <DisclosureRow buttonLabel="Core studies" summary={<div />}>
        panel
      </DisclosureRow>,
    );
    expect(
      screen.getByRole("button", { name: "Core studies" }),
    ).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <DisclosureRow
        defaultOpen
        summary="Core studies"
        railColor="#52c989"
        aside={<span>76 / 193 cr</span>}
      >
        <p>Two courses left.</p>
      </DisclosureRow>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
