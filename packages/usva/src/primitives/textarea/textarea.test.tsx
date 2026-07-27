import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { afterEach, describe, expect, it } from "vitest";
import { Textarea } from "./textarea.js";

function stubScrollHeight(value: number) {
  Object.defineProperty(HTMLTextAreaElement.prototype, "scrollHeight", {
    configurable: true,
    get: () => value,
  });
}

afterEach(() => {
  Reflect.deleteProperty(HTMLTextAreaElement.prototype, "scrollHeight");
});

describe("Textarea", () => {
  it("accepts typing (uncontrolled)", async () => {
    render(<Textarea aria-label="bio" />);
    const el = screen.getByLabelText("bio");
    await userEvent.type(el, "hi");
    expect(el).toHaveValue("hi");
  });

  it("reflects invalid state", () => {
    render(<Textarea aria-label="x" aria-invalid />);
    expect(screen.getByLabelText("x").className).toContain(
      "aria-invalid:border-danger",
    );
  });

  it("shares the input's surface, focus ring and disabled treatment", () => {
    render(<Textarea aria-label="x" />);
    const className = screen.getByLabelText("x").className;
    expect(className).toContain("border-border");
    expect(className).toContain("focus-visible:ring-focus");
    expect(className).toContain("disabled:opacity-50");
  });

  it("leaves height alone without autoGrow", () => {
    render(<Textarea aria-label="bio" />);
    expect(screen.getByLabelText("bio").style.height).toBe("");
  });

  it("autoGrow seeds rows from minRows and sets a measured height", () => {
    render(<Textarea aria-label="bio" autoGrow minRows={3} />);
    const el = screen.getByLabelText("bio") as HTMLTextAreaElement;
    expect(el.rows).toBe(3);
    expect(el.style.height).toMatch(/^\d+(\.\d+)?px$/);
  });

  it("grows with the content up to maxRows, then scrolls", () => {
    stubScrollHeight(1000);
    const { rerender } = render(
      <Textarea aria-label="bio" autoGrow minRows={2} maxRows={2} />,
    );
    const el = screen.getByLabelText("bio") as HTMLTextAreaElement;
    const short = Number.parseFloat(el.style.height);
    expect(el.style.overflowY).toBe("auto");

    rerender(<Textarea aria-label="bio" autoGrow minRows={2} maxRows={10} />);
    expect(Number.parseFloat(el.style.height)).toBeGreaterThan(short);
  });

  it("stays within its bounds when the content fits", () => {
    stubScrollHeight(0);
    render(<Textarea aria-label="bio" autoGrow minRows={2} maxRows={10} />);
    expect(
      (screen.getByLabelText("bio") as HTMLTextAreaElement).style.overflowY,
    ).toBe("hidden");
  });

  it("re-measures when a controlled value changes from outside", () => {
    const { rerender } = render(
      <Textarea aria-label="bio" autoGrow value="one" onChange={() => {}} />,
    );
    const el = screen.getByLabelText("bio") as HTMLTextAreaElement;
    el.style.height = "999px";

    rerender(
      <Textarea
        aria-label="bio"
        autoGrow
        value={"one\ntwo\nthree"}
        onChange={() => {}}
      />,
    );
    expect(el.style.height).not.toBe("999px");
  });

  it("forwards its ref to the native element", () => {
    const ref = { current: null as HTMLTextAreaElement | null };
    render(<Textarea aria-label="bio" ref={ref} autoGrow />);
    expect(ref.current).toBe(screen.getByLabelText("bio"));
  });

  it("no a11y violations", async () => {
    const { container } = render(
      <>
        <label htmlFor="bio">Bio</label>
        <Textarea id="bio" autoGrow />
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
