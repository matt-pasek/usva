import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SulaFrame } from "./sula-frame.js";

const reducedMotion = { current: false };
vi.mock("motion/react", async (importOriginal) => ({
  ...(await importOriginal<typeof import("motion/react")>()),
  useReducedMotion: () => reducedMotion.current,
}));

vi.mock("../sula-core/field.js", () => ({
  resolveColor: () => [0, 0, 0],
  shineForBackdrop: () => 1,
  liftTint: (tint: [number, number, number]) => tint,
}));

vi.mock("../sula-core/border.js", () => ({
  createBorderField: () => ({
    resize: vi.fn(),
    setColors: vi.fn(),
    draw: vi.fn(),
    dispose: vi.fn(),
  }),
}));

const canvasOf = (container: HTMLElement) => container.querySelector("canvas");

beforeEach(() => {
  reducedMotion.current = false;
});
afterEach(() => {
  vi.restoreAllMocks();
});

describe("SulaFrame", () => {
  it("renders wrapped children", () => {
    render(
      <SulaFrame>
        <button type="button">act</button>
      </SulaFrame>,
    );
    expect(screen.getByRole("button", { name: "act" })).toBeInTheDocument();
  });

  it("mounts a decorative pointer-transparent canvas overlay when fluid", () => {
    const { container } = render(
      <SulaFrame>
        <p>card</p>
      </SulaFrame>,
    );
    const canvas = canvasOf(container);
    expect(canvas).not.toBeNull();
    expect(canvas?.parentElement).toHaveAttribute("aria-hidden", "true");
    expect(canvas?.parentElement?.className).toContain("pointer-events-none");
    expect(canvas?.parentElement?.className).toContain("z-10");
  });

  it("positions the canvas layer fixed in fixed mode", () => {
    const { container } = render(<SulaFrame fixed />);
    const canvas = canvasOf(container);
    const viewportCanvas = document.body.querySelector("canvas");
    expect(canvas).toBeNull();
    expect(viewportCanvas?.parentElement?.className).toContain("fixed");
    expect(viewportCanvas?.parentElement?.parentElement).toBe(document.body);
  });

  it("mounts no canvas with fluid off but paints a static border", () => {
    const { container } = render(
      <SulaFrame fluid={false}>
        <p>card</p>
      </SulaFrame>,
    );
    expect(canvasOf(container)).toBeNull();
    expect(screen.getByText("card")).toBeInTheDocument();
    const staticRing = container.querySelector('[aria-hidden="true"]');
    expect(staticRing).not.toBeNull();
    expect((staticRing as HTMLElement).style.border).toContain(
      "var(--usva-accent)",
    );
  });

  it("paints the static border under reduced motion", () => {
    reducedMotion.current = true;
    const { container } = render(
      <SulaFrame>
        <p>card</p>
      </SulaFrame>,
    );
    expect(canvasOf(container)).toBeNull();
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeNull();
  });

  it("has no axe violations in wrapper mode", async () => {
    const { container } = render(
      <SulaFrame>
        <button type="button">act</button>
      </SulaFrame>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
