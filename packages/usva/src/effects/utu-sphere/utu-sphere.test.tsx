import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { UtuSphere } from "./utu-sphere.js";

const reducedMotion = { current: false };
vi.mock("motion/react", async (importOriginal) => ({
  ...(await importOriginal<typeof import("motion/react")>()),
  useReducedMotion: () => reducedMotion.current,
}));

vi.mock("../effects-core/effects-gl.js", async (importOriginal) => ({
  ...(await importOriginal<typeof import("../effects-core/effects-gl.js")>()),
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

describe("UtuSphere", () => {
  it("renders its children on top of the field", () => {
    render(
      <UtuSphere>
        <p>hero copy</p>
      </UtuSphere>,
    );
    expect(screen.getByText("hero copy")).toBeInTheDocument();
  });

  it("mounts a decorative canvas behind the content", () => {
    const { container } = render(<UtuSphere>content</UtuSphere>);
    const canvas = canvasOf(container);
    expect(canvas).not.toBeNull();
    expect(canvas?.parentElement).toHaveAttribute("aria-hidden", "true");
  });

  it("paints a static frame under reduced motion", () => {
    reducedMotion.current = true;
    const { container } = render(<UtuSphere>content</UtuSphere>);
    expect(canvasOf(container)).not.toBeNull();
  });

  it("accepts the interactive flag without error", () => {
    const { container } = render(<UtuSphere interactive>content</UtuSphere>);
    expect(canvasOf(container)).not.toBeNull();
  });

  it("accepts custom bands and colours without error", () => {
    const { container } = render(
      <UtuSphere bands={12} accentColor="#d94fd6" opacity={0.8}>
        content
      </UtuSphere>,
    );
    expect(canvasOf(container)).not.toBeNull();
  });

  it("has no axe violations", async () => {
    const { container } = render(
      <UtuSphere>
        <p>hero copy</p>
      </UtuSphere>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
