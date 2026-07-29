import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SulaFab, type SulaFabAction } from "./sula-fab.js";

const reducedMotion = { current: false };
vi.mock("motion/react", async (importOriginal) => ({
  ...(await importOriginal<typeof import("motion/react")>()),
  useReducedMotion: () => reducedMotion.current,
}));

const createFieldSpy = vi.hoisted(() => vi.fn());
const fieldSetColors = vi.hoisted(() => vi.fn());

vi.mock("../sula-core/field.js", () => ({
  resolveColor: () => [0, 0, 0],
  shineForBackdrop: () => 1,
  createField: (options: unknown) => {
    createFieldSpy(options);
    return {
      resize: vi.fn(),
      setColors: fieldSetColors,
      draw: vi.fn(),
      dispose: vi.fn(),
    };
  },
}));

const Icon = () => <svg aria-hidden="true" viewBox="0 0 4 4" />;

const actions: SulaFabAction[] = [
  { icon: <Icon />, label: "New note", onClick: vi.fn() },
  { icon: <Icon />, label: "New task", onClick: vi.fn() },
  { icon: <Icon />, label: "Docs", href: "/docs" },
];

const matchMedia = (reduced: boolean) =>
  vi.fn().mockImplementation((query: string) => ({
    matches: reduced && query.includes("reduced-motion"),
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
    onchange: null,
  }));

beforeEach(() => {
  reducedMotion.current = false;
  createFieldSpy.mockClear();
  fieldSetColors.mockClear();
  vi.stubGlobal("matchMedia", matchMedia(false));
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const trigger = () => screen.getByRole("button", { name: "Actions" });
const canvasOf = (container: HTMLElement) => container.querySelector("canvas");
const tooltipPositions = (container: HTMLElement) =>
  Array.from(container.querySelectorAll("[data-tooltip-position]")).map(
    (node) => node.getAttribute("data-tooltip-position"),
  );

describe("SulaFab", () => {
  it("retunes live without rebuilding the gl context", () => {
    // Every rebuild burns a WebGL context, and the browser answers by dropping
    // the oldest live one on the page, which is some other surface entirely.
    const { rerender } = render(
      <SulaFab actions={actions} shine={0.2} gap={10} />,
    );
    expect(createFieldSpy).toHaveBeenCalledTimes(1);

    for (const shine of [0.3, 0.4, 0.5, 0.6, 0.7]) {
      rerender(<SulaFab actions={actions} shine={shine} gap={shine * 20} />);
    }

    expect(createFieldSpy).toHaveBeenCalledTimes(1);
    expect(fieldSetColors).toHaveBeenCalled();
  });

  it("collapses the trigger with aria-expanded false while closed", () => {
    render(<SulaFab actions={actions} />);
    expect(trigger()).toHaveAttribute("aria-expanded", "false");
    expect(trigger()).toHaveAttribute("aria-haspopup", "menu");
  });

  it("toggles open and reports it through onOpenChange", async () => {
    const onOpenChange = vi.fn();
    render(<SulaFab actions={actions} onOpenChange={onOpenChange} />);
    await userEvent.click(trigger());
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
    expect(trigger()).toHaveAttribute("aria-expanded", "true");
    await userEvent.click(trigger());
    expect(onOpenChange).toHaveBeenLastCalledWith(false);
    expect(trigger()).toHaveAttribute("aria-expanded", "false");
  });

  it("exposes the actions with their labels when open", async () => {
    render(<SulaFab actions={actions} defaultOpen />);
    for (const action of actions) {
      const el = screen.getByRole(action.href ? "link" : "button", {
        name: action.label,
      });
      expect(el).toBeInTheDocument();
      expect(el.closest("[inert]")).toBeNull();
    }
  });

  it("marks the actions inert and aria-hidden while closed", () => {
    const { container } = render(<SulaFab actions={actions} />);
    const wrappers = container.querySelectorAll("[inert]");
    expect(wrappers).toHaveLength(actions.length);
  });

  it("renders href actions as anchors", () => {
    render(<SulaFab actions={actions} defaultOpen />);
    const link = screen.getByRole("link", { name: "Docs" });
    expect(link).toHaveAttribute("href", "/docs");
  });

  it("places line-layout tooltips on the left by default", () => {
    const { container } = render(<SulaFab actions={actions} layout="line" />);
    expect(tooltipPositions(container)).toEqual(["left", "left", "left"]);
  });

  it("places arc-layout tooltips on top by default", () => {
    const { container } = render(<SulaFab actions={actions} layout="arc" />);
    expect(tooltipPositions(container)).toEqual(["top", "top", "top"]);
  });

  it("allows the tooltip position to override the layout default", () => {
    const { container } = render(
      <SulaFab actions={actions} layout="arc" tooltipPosition="right" />,
    );
    expect(tooltipPositions(container)).toEqual(["right", "right", "right"]);
  });

  it("closes on Escape and returns focus to the trigger", async () => {
    render(<SulaFab actions={actions} defaultOpen />);
    await userEvent.keyboard("{Escape}");
    expect(trigger()).toHaveAttribute("aria-expanded", "false");
    expect(trigger()).toHaveFocus();
  });

  it("does not self-toggle in controlled mode", async () => {
    const onOpenChange = vi.fn();
    render(
      <SulaFab actions={actions} open={false} onOpenChange={onOpenChange} />,
    );
    await userEvent.click(trigger());
    expect(onOpenChange).toHaveBeenCalledWith(true);
    expect(trigger()).toHaveAttribute("aria-expanded", "false");
  });

  it("mounts a decorative canvas when fluid", () => {
    const { container } = render(<SulaFab actions={actions} />);
    expect(canvasOf(container)).not.toBeNull();
    expect(canvasOf(container)?.parentElement).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("mounts no canvas with fluid off but stays operable", async () => {
    const onOpenChange = vi.fn();
    const { container } = render(
      <SulaFab actions={actions} fluid={false} onOpenChange={onOpenChange} />,
    );
    expect(canvasOf(container)).toBeNull();
    await userEvent.click(trigger());
    expect(onOpenChange).toHaveBeenLastCalledWith(true);
  });

  it("mounts no canvas when the user asked for reduced motion", () => {
    reducedMotion.current = true;
    const { container } = render(<SulaFab actions={actions} />);
    expect(canvasOf(container)).toBeNull();
  });

  it("has no axe violations, open or closed", async () => {
    const closed = render(<SulaFab actions={actions} />);
    expect(await axe(closed.container)).toHaveNoViolations();
    closed.unmount();

    const opened = render(<SulaFab actions={actions} defaultOpen />);
    expect(await axe(opened.container)).toHaveNoViolations();
  });
});
