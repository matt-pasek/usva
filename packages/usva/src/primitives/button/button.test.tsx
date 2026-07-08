import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Button } from "./button.js";

describe("Button", () => {
  it("renders children and fires onClick", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    await userEvent.click(screen.getByRole("button", { name: "Go" }));
    expect(onClick).toHaveBeenCalledOnce();
  });
  it("applies variant classes", () => {
    render(<Button variant="ghost">x</Button>);
    expect(screen.getByRole("button").className).toContain("bg-transparent");
  });
  it("onSurface is a translucent tonal fill for image and gradient backdrops", () => {
    render(<Button variant="onSurface">x</Button>);
    const className = screen.getByRole("button").className;
    expect(className).toContain("bg-ink/[0.055]");
    expect(className).toContain("border-ink/10");
  });
  it("has no a11y violations", async () => {
    const { container } = render(<Button>ok</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });
  it("has no a11y violations on onSurface", async () => {
    const { container } = render(<Button variant="onSurface">ok</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });

  /**
   * asChild renders a plain element with no motion wrapper, so the hover lift has to
   * come from the class. On the motion path `whileHover` supplies it instead: motion
   * writes an inline transform after the first press, which would beat the class.
   */
  it("carries the hover lift class for the motion-free asChild path", () => {
    render(
      <Button asChild>
        <a href="/docs">Read the docs</a>
      </Button>,
    );
    expect(screen.getByRole("link").className).toContain(
      "hover:-translate-y-px",
    );
  });
});

describe("Button status", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("swaps children for the loading text", () => {
    render(
      <Button status="loading" loadingText="Saving">
        Save
      </Button>,
    );
    expect(screen.getByRole("button")).toHaveAccessibleName("Saving");
  });

  it("defaults the loading text to Loading", () => {
    render(<Button status="loading">Save</Button>);
    expect(screen.getByRole("button")).toHaveTextContent("Loading");
  });

  it("marks itself busy while loading", () => {
    render(<Button status="loading">Save</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");
  });

  it("is not disabled while loading; loading is working, not inert", () => {
    render(<Button status="loading">Save</Button>);
    expect(screen.getByRole("button")).not.toBeDisabled();
  });

  it("swallows clicks while loading", async () => {
    const onClick = vi.fn();
    render(
      <Button status="loading" onClick={onClick}>
        Save
      </Button>,
    );
    await userEvent.click(screen.getByRole("button"), {
      pointerEventsCheck: 0,
    });
    expect(onClick).not.toHaveBeenCalled();
  });

  it("does not announce the spinner's own label alongside the loading text", () => {
    render(<Button status="loading">Save</Button>);
    expect(screen.getByRole("button")).toHaveAccessibleName("Loading");
  });

  it("settles from success back to idle and notifies", () => {
    vi.useFakeTimers();
    const onSettle = vi.fn();
    const { rerender } = render(<Button status="idle">Save</Button>);
    rerender(
      <Button status="success" successText="Saved" onSettle={onSettle}>
        Save
      </Button>,
    );
    expect(screen.getByRole("button")).toHaveTextContent("Saved");

    act(() => {
      vi.advanceTimersByTime(1200);
    });
    expect(onSettle).toHaveBeenCalledOnce();
    expect(screen.getByRole("button")).toHaveTextContent("Save");
  });

  it("honours a custom settleDelay", () => {
    vi.useFakeTimers();
    const onSettle = vi.fn();
    const { rerender } = render(<Button status="idle">Save</Button>);
    rerender(
      <Button status="error" settleDelay={4000} onSettle={onSettle}>
        Save
      </Button>,
    );

    act(() => {
      vi.advanceTimersByTime(1200);
    });
    expect(onSettle).not.toHaveBeenCalled();

    act(() => {
      vi.advanceTimersByTime(2800);
    });
    expect(onSettle).toHaveBeenCalledOnce();
  });

  it("does not restart the settle timer when onSettle is a fresh closure", () => {
    vi.useFakeTimers();
    const onSettle = vi.fn();
    const { rerender } = render(<Button status="idle">Save</Button>);
    rerender(
      <Button status="success" onSettle={() => onSettle()}>
        Save
      </Button>,
    );

    act(() => {
      vi.advanceTimersByTime(900);
    });
    rerender(
      <Button status="success" onSettle={() => onSettle()}>
        Save
      </Button>,
    );
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(onSettle).toHaveBeenCalledOnce();
  });

  it("exposes the status for styling", () => {
    render(<Button status="success">Save</Button>);
    expect(screen.getByRole("button")).toHaveAttribute(
      "data-status",
      "success",
    );
  });

  it("ignores status when rendering asChild", () => {
    render(
      <Button asChild status="loading">
        <a href="/go">Go</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Go" });
    expect(link).not.toHaveAttribute("aria-busy");
  });

  it("has no a11y violations while loading", async () => {
    const { container } = render(<Button status="loading">Save</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
