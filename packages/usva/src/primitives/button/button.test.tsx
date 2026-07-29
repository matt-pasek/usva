import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import * as React from "react";
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
  it("glass is a dark blurred fill for controls floating over a live canvas", () => {
    render(<Button variant="glass">x</Button>);
    const className = screen.getByRole("button").className;
    expect(className).toContain("bg-black/40");
    expect(className).toContain("backdrop-blur-sm");
  });
  it("pill shape fully rounds the button, outranking the size radius", () => {
    render(<Button shape="pill">x</Button>);
    expect(screen.getByRole("button").className).toContain("rounded-full");
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

  it("forwards native props through asChild", () => {
    render(
      <Button asChild name="send" data-testid="slotted">
        <button type="button">Send</button>
      </Button>,
    );
    expect(screen.getByTestId("slotted")).toHaveAttribute("name", "send");
  });

  it("lets the child win where both set the same prop", () => {
    render(
      <Button asChild aria-label="from Button">
        <button type="button" aria-label="from child">
          Send
        </button>
      </Button>,
    );
    expect(screen.getByRole("button")).toHaveAccessibleName("from child");
  });

  it("fires an onClick passed to Button through asChild", async () => {
    const onClick = vi.fn();
    render(
      <Button asChild onClick={onClick}>
        <button type="button">Send</button>
      </Button>,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("runs the child's own handler as well as Button's", async () => {
    const order: string[] = [];
    render(
      <Button asChild onClick={() => order.push("button")}>
        <button type="button" onClick={() => order.push("child")}>
          Send
        </button>
      </Button>,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(order).toEqual(["child", "button"]);
  });

  it("forwards a ref through asChild", () => {
    const ref = React.createRef<HTMLAnchorElement>();
    render(
      <Button asChild ref={ref as React.Ref<HTMLButtonElement>}>
        <a href="/docs">Read the docs</a>
      </Button>,
    );
    expect(ref.current).toBe(screen.getByRole("link"));
  });

  it("keeps the child's own ref working alongside Button's", () => {
    const ours = React.createRef<HTMLAnchorElement>();
    const theirs = React.createRef<HTMLAnchorElement>();
    render(
      <Button asChild ref={ours as React.Ref<HTMLButtonElement>}>
        <a href="/docs" ref={theirs}>
          Read the docs
        </a>
      </Button>,
    );
    expect(ours.current).toBe(screen.getByRole("link"));
    expect(theirs.current).toBe(screen.getByRole("link"));
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

  it("uses the success text as the accessible name", () => {
    render(
      <Button status="success" successText="Saved">
        Save
      </Button>,
    );
    expect(screen.getByRole("button")).toHaveAccessibleName("Saved");
  });

  it("keeps the idle name when success has no text", () => {
    render(<Button status="success">Save</Button>);
    expect(screen.getByRole("button")).toHaveAccessibleName("Save");
  });

  it("keeps the idle name when error has no text", () => {
    render(<Button status="error">Save</Button>);
    expect(screen.getByRole("button")).toHaveAccessibleName("Save");
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

  it("renders square when icon-only", () => {
    render(
      <Button iconOnly aria-label="Close">
        <svg aria-hidden="true">
          <title>{""}</title>
        </svg>
      </Button>,
    );
    expect(screen.getByRole("button", { name: "Close" }).className).toContain(
      "w-10",
    );
  });

  it("throws in dev when icon-only has no label", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<Button iconOnly>x</Button>)).toThrow(/aria-label/);
    spy.mockRestore();
  });

  it("shows a tooltip that the button is described by", () => {
    render(
      <Button iconOnly aria-label="Copy" tooltip="copy">
        x
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Copy" });
    const tip = screen.getByRole("tooltip");
    expect(tip).toHaveTextContent("copy");
    expect(button).toHaveAttribute("aria-describedby", tip.id);
  });

  it("applies the active look", () => {
    render(
      <Button iconOnly active aria-label="Copied">
        x
      </Button>,
    );
    expect(screen.getByRole("button").className).toContain("glow-ring");
  });

  it("icon-only loading shows the spinner without a label", () => {
    render(
      <Button iconOnly aria-label="Copy" status="loading">
        x
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Copy" });
    expect(button).toHaveAttribute("aria-busy", "true");
    expect(button).not.toHaveTextContent("Loading");
  });

  it("icon-only with a tooltip has no a11y violations", async () => {
    const { container } = render(
      <Button iconOnly aria-label="Copy" tooltip="copy">
        x
      </Button>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
