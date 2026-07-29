import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SulaField } from "./sula-field.js";

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
  liftTint: (tint: [number, number, number]) => tint,
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

const canvasOf = (container: HTMLElement) => container.querySelector("canvas");

beforeEach(() => {
  reducedMotion.current = false;
  createFieldSpy.mockClear();
  fieldSetColors.mockClear();
});
afterEach(() => {
  vi.restoreAllMocks();
});

describe("SulaField", () => {
  it("retunes live without rebuilding the gl context", () => {
    // Every rebuild burns a WebGL context, and the browser answers by dropping
    // the oldest live one on the page, which is some other surface entirely.
    const { rerender } = render(<SulaField shine={0.2} />);
    expect(createFieldSpy).toHaveBeenCalledTimes(1);

    for (const shine of [0.3, 0.4, 0.5, 0.6, 0.7]) {
      rerender(<SulaField shine={shine} />);
    }

    expect(createFieldSpy).toHaveBeenCalledTimes(1);
    // This surface swaps two colour sets per pass, so a retune recomputes them
    // for the loop rather than pushing one through setColors here.
  });

  it("renders its children on top of the field", () => {
    render(
      <SulaField>
        <p>hero copy</p>
      </SulaField>,
    );
    expect(screen.getByText("hero copy")).toBeInTheDocument();
  });

  it("mounts a decorative canvas behind the content when fluid", () => {
    const { container } = render(
      <SulaField>
        <p>hero copy</p>
      </SulaField>,
    );
    const canvas = canvasOf(container);
    expect(canvas).not.toBeNull();
    expect(canvas?.parentElement).toHaveAttribute("aria-hidden", "true");
  });

  it("mounts no canvas with fluid off but keeps the content", () => {
    const { container } = render(
      <SulaField fluid={false}>
        <p>hero copy</p>
      </SulaField>,
    );
    expect(canvasOf(container)).toBeNull();
    expect(screen.getByText("hero copy")).toBeInTheDocument();
  });

  it("paints a static frame under reduced motion", () => {
    reducedMotion.current = true;
    const { container } = render(<SulaField>content</SulaField>);
    expect(canvasOf(container)).not.toBeNull();
  });

  it("accepts the interactive flag without error", () => {
    const { container } = render(<SulaField interactive>content</SulaField>);
    expect(canvasOf(container)).not.toBeNull();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <SulaField>
        <p>hero copy</p>
      </SulaField>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
