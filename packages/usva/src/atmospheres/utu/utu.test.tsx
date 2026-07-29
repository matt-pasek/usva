import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Utu } from "./utu.js";

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

describe("Utu", () => {
  it("renders its children on top of the field", () => {
    render(
      <Utu>
        <p>hero copy</p>
      </Utu>,
    );
    expect(screen.getByText("hero copy")).toBeInTheDocument();
  });

  it("mounts a decorative canvas behind the content", () => {
    const { container } = render(<Utu>content</Utu>);
    const canvas = canvasOf(container);
    expect(canvas).not.toBeNull();
    expect(canvas?.parentElement).toHaveAttribute("aria-hidden", "true");
  });

  it("paints a static frame under reduced motion", () => {
    reducedMotion.current = true;
    const { container } = render(<Utu>content</Utu>);
    expect(canvasOf(container)).not.toBeNull();
  });

  it("accepts the interactive flag without error", () => {
    const { container } = render(<Utu interactive>content</Utu>);
    expect(canvasOf(container)).not.toBeNull();
  });

  it("accepts custom bands and colours without error", () => {
    const { container } = render(
      <Utu bands={12} accentColor="#d94fd6" opacity={0.8}>
        content
      </Utu>,
    );
    expect(canvasOf(container)).not.toBeNull();
  });

  it("exposes an explicit absorptive material override", () => {
    const { container } = render(<Utu mode="absorptive">content</Utu>);
    expect(container.firstElementChild).toHaveAttribute(
      "data-blend",
      "absorptive",
    );
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <Utu>
        <p>hero copy</p>
      </Utu>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
