import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Kuulto } from "./kuulto.js";

const reducedMotion = { current: false };
vi.mock("motion/react", async (importOriginal) => ({
  ...(await importOriginal<typeof import("motion/react")>()),
  useReducedMotion: () => reducedMotion.current,
}));

vi.mock("../atmospheres-core/atmospheres-gl.js", async (importOriginal) => ({
  ...(await importOriginal<
    typeof import("../atmospheres-core/atmospheres-gl.js")
  >()),
  createGlSurface: ({ uniforms }: { uniforms: Record<string, unknown> }) => ({
    uniforms,
    resize: vi.fn(),
    render: vi.fn(),
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

describe("Kuulto", () => {
  it("renders its children on top of the drape", () => {
    render(
      <Kuulto>
        <p>hero copy</p>
      </Kuulto>,
    );
    expect(screen.getByText("hero copy")).toBeInTheDocument();
  });

  it("mounts a decorative canvas behind the content", () => {
    const { container } = render(<Kuulto>content</Kuulto>);
    const canvas = canvasOf(container);
    expect(canvas).not.toBeNull();
    expect(canvas?.parentElement).toHaveAttribute("aria-hidden", "true");
  });

  it("paints a static frame under reduced motion", () => {
    reducedMotion.current = true;
    const { container } = render(<Kuulto>content</Kuulto>);
    expect(canvasOf(container)).not.toBeNull();
  });

  it("accepts lamp overrides and params without error", () => {
    const { container } = render(
      <Kuulto
        colors={{ key: "#7c3aed", rim: "#22c55e" }}
        params={{ relief: 2.4 }}
        opacity={0.9}
        interactive={false}
      >
        content
      </Kuulto>,
    );
    expect(canvasOf(container)).not.toBeNull();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Kuulto>
        <p>hero copy</p>
      </Kuulto>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
