import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SulaSegmented, type SulaSegmentedItem } from "./sula-segmented.js";

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

const items: SulaSegmentedItem[] = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
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

const canvasOf = (container: HTMLElement) => container.querySelector("canvas");

describe("SulaSegmented", () => {
  it("retunes live without rebuilding the gl context", () => {
    // Every rebuild burns a WebGL context, and the browser answers by dropping
    // the oldest live one on the page, which is some other surface entirely.
    const { rerender } = render(<SulaSegmented items={items} shine={0.2} />);
    expect(createFieldSpy).toHaveBeenCalledTimes(1);

    for (const shine of [0.3, 0.4, 0.5, 0.6, 0.7]) {
      rerender(<SulaSegmented items={items} shine={shine} />);
    }

    expect(createFieldSpy).toHaveBeenCalledTimes(1);
    expect(fieldSetColors).toHaveBeenCalled();
  });

  it("renders a radiogroup with one radio per item", () => {
    render(<SulaSegmented items={items} />);
    expect(screen.getByRole("radiogroup")).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(3);
  });

  it("checks the value, defaulting to the first item", () => {
    render(<SulaSegmented items={items} />);
    expect(screen.getByRole("radio", { name: "Day" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(screen.getByRole("radio", { name: "Week" })).toHaveAttribute(
      "aria-checked",
      "false",
    );
  });

  it("honours defaultValue in uncontrolled mode", () => {
    render(<SulaSegmented items={items} defaultValue="week" />);
    expect(screen.getByRole("radio", { name: "Week" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  it("moves the checked state and calls onValueChange on click (uncontrolled)", async () => {
    const onValueChange = vi.fn();
    render(<SulaSegmented items={items} onValueChange={onValueChange} />);
    await userEvent.click(screen.getByRole("radio", { name: "Month" }));
    expect(onValueChange).toHaveBeenCalledWith("month");
    expect(screen.getByRole("radio", { name: "Month" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  it("does not self-update in controlled mode", async () => {
    const onValueChange = vi.fn();
    render(
      <SulaSegmented items={items} value="day" onValueChange={onValueChange} />,
    );
    await userEvent.click(screen.getByRole("radio", { name: "Week" }));
    expect(onValueChange).toHaveBeenCalledWith("week");
    expect(screen.getByRole("radio", { name: "Day" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  it("moves focus and selection with arrow keys, Home and End", async () => {
    render(<SulaSegmented items={items} />);
    const day = screen.getByRole("radio", { name: "Day" });
    day.focus();
    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("radio", { name: "Week" })).toHaveFocus();
    expect(screen.getByRole("radio", { name: "Week" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
    await userEvent.keyboard("{End}");
    expect(screen.getByRole("radio", { name: "Month" })).toHaveFocus();
    await userEvent.keyboard("{Home}");
    expect(screen.getByRole("radio", { name: "Day" })).toHaveFocus();
    await userEvent.keyboard("{ArrowLeft}");
    expect(screen.getByRole("radio", { name: "Month" })).toHaveFocus();
  });

  it("keeps only the checked segment in the tab order", () => {
    render(<SulaSegmented items={items} defaultValue="week" />);
    expect(screen.getByRole("radio", { name: "Day" })).toHaveAttribute(
      "tabindex",
      "-1",
    );
    expect(screen.getByRole("radio", { name: "Week" })).toHaveAttribute(
      "tabindex",
      "0",
    );
  });

  it("mounts a decorative canvas when fluid", () => {
    const { container } = render(<SulaSegmented items={items} />);
    expect(canvasOf(container)).not.toBeNull();
    expect(canvasOf(container)?.parentElement).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("mounts no canvas and shows the plain pill when fluid is off", () => {
    const { container } = render(<SulaSegmented items={items} fluid={false} />);
    expect(canvasOf(container)).toBeNull();
    expect(screen.getByRole("radiogroup")).toHaveAttribute("data-fluid", "off");
    expect(container.querySelector("span[aria-hidden]")).not.toBeNull();
  });

  it("mounts no canvas when the user asked for reduced motion", () => {
    reducedMotion.current = true;
    const { container } = render(<SulaSegmented items={items} />);
    expect(canvasOf(container)).toBeNull();
    expect(container.querySelector("span[aria-hidden]")).not.toBeNull();
  });

  it("has no axe violations, fluid or not", async () => {
    const fluid = render(<SulaSegmented items={items} />);
    expect(await axe(fluid.container)).toHaveNoViolations();
    fluid.unmount();

    const plain = render(<SulaSegmented items={items} fluid={false} />);
    expect(await axe(plain.container)).toHaveNoViolations();
  });
});
