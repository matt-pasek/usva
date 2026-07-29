import { createEvent, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it, vi } from "vitest";
import { Knob } from "./knob.js";
import { KNOB_DRAG_TRAVEL } from "./knob-geometry.js";

const knob = () => screen.getByRole("slider", { name: "Volume" });

describe("Knob", () => {
  it("renders an accessible slider with its label", () => {
    render(<Knob label="Volume" defaultValue={59} />);
    expect(knob()).toHaveAttribute("aria-valuenow", "59");
    expect(knob()).toHaveAttribute("aria-valuemin", "0");
    expect(knob()).toHaveAttribute("aria-valuemax", "100");
  });

  it("reports the formatted value to assistive tech", () => {
    render(
      <Knob label="Volume" defaultValue={59} formatValue={(v) => `${v} %`} />,
    );
    expect(knob()).toHaveAttribute("aria-valuetext", "59 %");
  });

  it("names the dial from aria-label when there is no visible label", () => {
    render(<Knob aria-label="Volume" defaultValue={59} />);
    expect(knob()).toHaveAttribute("aria-valuenow", "59");
  });

  it("names the dial from aria-labelledby when there is no visible label", () => {
    render(
      <>
        <span id="knob-caption">Volume</span>
        <Knob aria-labelledby="knob-caption" defaultValue={59} />
      </>,
    );
    expect(knob()).toHaveAttribute("aria-valuenow", "59");
  });

  it("lets a visible label win over aria-labelledby", () => {
    render(
      <>
        <span id="knob-caption">Ignored</span>
        <Knob label="Volume" aria-labelledby="knob-caption" defaultValue={59} />
      </>,
    );
    expect(knob()).toBeInTheDocument();
  });

  it("shows the readout only when asked", () => {
    const { rerender } = render(<Knob label="Volume" defaultValue={59} />);
    expect(screen.queryByText("59")).not.toBeInTheDocument();
    rerender(<Knob label="Volume" defaultValue={59} showValue />);
    expect(screen.getByText("59")).toBeInTheDocument();
  });

  describe("keyboard", () => {
    it.each([
      ["{ArrowRight}", 45],
      ["{ArrowUp}", 45],
      ["{ArrowLeft}", 35],
      ["{ArrowDown}", 35],
      ["{PageUp}", 90],
      ["{PageDown}", 0],
      ["{Home}", 0],
      ["{End}", 100],
    ])("moves on %s", async (keys, expected) => {
      const user = userEvent.setup();
      render(<Knob label="Volume" defaultValue={40} step={5} />);
      await user.tab();
      await user.keyboard(keys);
      expect(knob()).toHaveAttribute("aria-valuenow", String(expected));
    });

    it("gives fine control with shift held", async () => {
      const user = userEvent.setup();
      render(<Knob label="Volume" defaultValue={40} step={5} />);
      await user.tab();
      await user.keyboard("{Shift>}{ArrowRight}{/Shift}");
      expect(knob()).toHaveAttribute("aria-valuenow", "40.5");
    });

    it("stops at the ends of the range", async () => {
      const user = userEvent.setup();
      render(<Knob label="Volume" defaultValue={100} />);
      await user.tab();
      await user.keyboard("{ArrowRight}{ArrowRight}");
      expect(knob()).toHaveAttribute("aria-valuenow", "100");
    });

    it("ignores keys it does not handle", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(
        <Knob label="Volume" defaultValue={40} onValueChange={onValueChange} />,
      );
      await user.tab();
      await user.keyboard("a");
      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  it("commits once per keyboard interaction, after the key is released", async () => {
    const onValueChange = vi.fn();
    const onValueCommitted = vi.fn();
    const user = userEvent.setup();
    render(
      <Knob
        label="Volume"
        defaultValue={40}
        onValueChange={onValueChange}
        onValueCommitted={onValueCommitted}
      />,
    );

    await user.tab();
    await user.keyboard("{ArrowRight}");

    expect(onValueChange).toHaveBeenCalledWith(41);
    expect(onValueCommitted).toHaveBeenCalledTimes(1);
    expect(onValueCommitted).toHaveBeenCalledWith(41);
  });

  it("supports a controlled value", async () => {
    const onValueChange = vi.fn();
    const user = userEvent.setup();
    render(<Knob label="Volume" value={70} onValueChange={onValueChange} />);

    expect(knob()).toHaveAttribute("aria-valuenow", "70");
    await user.tab();
    await user.keyboard("{ArrowRight}");

    expect(onValueChange).toHaveBeenCalledWith(71);
    expect(knob()).toHaveAttribute("aria-valuenow", "70");
  });

  it("snaps an out-of-range controlled value into the range", () => {
    render(<Knob label="Volume" value={140} />);
    expect(knob()).toHaveAttribute("aria-valuenow", "100");
  });

  describe("disabled", () => {
    it("leaves the tab order and reports itself disabled", () => {
      render(<Knob label="Volume" defaultValue={40} disabled />);
      expect(knob()).toHaveAttribute("aria-disabled", "true");
      expect(knob()).toHaveAttribute("tabindex", "-1");
    });

    it("does not respond to the keyboard", async () => {
      const onValueChange = vi.fn();
      const user = userEvent.setup();
      render(
        <Knob
          label="Volume"
          defaultValue={40}
          disabled
          onValueChange={onValueChange}
        />,
      );
      knob().focus();
      await user.keyboard("{ArrowRight}");
      expect(onValueChange).not.toHaveBeenCalled();
    });
  });

  describe("pointer drag", () => {
    const drag = (dx: number, dy: number) => {
      const dial = knob();
      fireEvent.pointerDown(dial, { button: 0, clientX: 0, clientY: 0 });
      fireEvent.pointerMove(dial, { clientX: dx, clientY: dy });
      fireEvent.pointerUp(dial, { clientX: dx, clientY: dy });
    };

    it("does not move on press alone, so a grab never jumps the value", () => {
      render(<Knob label="Volume" defaultValue={40} />);
      fireEvent.pointerDown(knob(), { button: 0, clientX: 0, clientY: 0 });
      expect(knob()).toHaveAttribute("aria-valuenow", "40");
    });

    it("rises to the right and falls to the left", () => {
      render(<Knob label="Volume" defaultValue={0} />);
      drag(KNOB_DRAG_TRAVEL / 2, 0);
      expect(knob()).toHaveAttribute("aria-valuenow", "50");
    });

    it("rises upward too, so neither axis is dead", () => {
      render(<Knob label="Volume" defaultValue={0} />);
      drag(0, -KNOB_DRAG_TRAVEL / 2);
      expect(knob()).toHaveAttribute("aria-valuenow", "50");
    });

    it("prevents the default press, so dragging selects no text", () => {
      render(<Knob label="Volume" defaultValue={40} />);
      const press = createEvent.pointerDown(knob(), {
        button: 0,
        clientX: 0,
        clientY: 0,
      });
      fireEvent(knob(), press);
      expect(press.defaultPrevented).toBe(true);
    });

    it("ignores a drag while disabled", () => {
      const onValueChange = vi.fn();
      render(
        <Knob
          label="Volume"
          defaultValue={40}
          disabled
          onValueChange={onValueChange}
        />,
      );
      drag(KNOB_DRAG_TRAVEL, 0);
      expect(onValueChange).not.toHaveBeenCalled();
    });

    it("commits once, when the pointer is released", () => {
      const onValueCommitted = vi.fn();
      render(
        <Knob
          label="Volume"
          defaultValue={0}
          onValueCommitted={onValueCommitted}
        />,
      );
      drag(KNOB_DRAG_TRAVEL / 2, 0);
      expect(onValueCommitted).toHaveBeenCalledTimes(1);
    });
  });

  it("has no axe violations", async () => {
    const { container } = render(<Knob label="Volume" defaultValue={59} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
