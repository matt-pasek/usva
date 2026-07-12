import { act, render, screen, within } from "@testing-library/react";
import { axe } from "jest-axe";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { loaderFrame, STATIC_PHASES } from "./loader-geometry.js";
import { SulaLoader } from "./sula-loader.js";

const reducedMotion = { current: false };
vi.mock("motion/react", async (importOriginal) => ({
  ...(await importOriginal<typeof import("motion/react")>()),
  useReducedMotion: () => reducedMotion.current,
}));

vi.mock("../sula-core/field.js", () => ({
  resolveColor: () => [0, 0, 0],
  shineForBackdrop: () => 1,
  createField: () => ({
    resize: vi.fn(),
    setColors: vi.fn(),
    draw: vi.fn(),
    dispose: vi.fn(),
  }),
}));

vi.mock("./loader-geometry.js", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./loader-geometry.js")>();
  return { ...actual, loaderFrame: vi.fn(actual.loaderFrame) };
});

const canvasOf = (container: HTMLElement) => container.querySelector("canvas");
const circlesOf = (container: HTMLElement) =>
  container.querySelectorAll("svg circle");

beforeEach(() => {
  reducedMotion.current = false;
});
afterEach(() => {
  vi.restoreAllMocks();
});

describe("SulaLoader", () => {
  it("announces its status with the label", () => {
    render(<SulaLoader label="Loading dashboard" />);
    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-busy", "true");
    expect(within(status).getByText("Loading dashboard")).toBeInTheDocument();
  });

  it("defaults its label to Loading", () => {
    render(<SulaLoader />);
    expect(
      within(screen.getByRole("status")).getByText("Loading"),
    ).toBeInTheDocument();
  });

  it("defaults to an expressive 96px brand moment", () => {
    render(<SulaLoader />);
    expect(screen.getByRole("status")).toHaveStyle({
      width: "96px",
      height: "96px",
    });
  });

  it("mounts a decorative canvas when fluid", () => {
    const { container } = render(<SulaLoader />);
    const canvas = canvasOf(container);
    expect(canvas).not.toBeNull();
    expect(canvas?.parentElement).toHaveAttribute("aria-hidden", "true");
  });

  it("renders a static still with no canvas when fluid is off", () => {
    const { container } = render(<SulaLoader fluid={false} />);
    expect(canvasOf(container)).toBeNull();
    expect(circlesOf(container).length).toBeGreaterThan(0);
  });

  it("renders a static still when the user asked for reduced motion", () => {
    reducedMotion.current = true;
    const { container } = render(<SulaLoader />);
    expect(canvasOf(container)).toBeNull();
    expect(circlesOf(container).length).toBeGreaterThan(0);
  });

  it("draws each motion's still with the right bead count", () => {
    const orbit = render(<SulaLoader fluid={false} motion="orbit" />);
    expect(circlesOf(orbit.container)).toHaveLength(2);
    orbit.unmount();

    const cluster = render(<SulaLoader fluid={false} motion="cluster" />);
    expect(circlesOf(cluster.container)).toHaveLength(3);
    cluster.unmount();

    const twin = render(<SulaLoader fluid={false} motion="twin" />);
    expect(circlesOf(twin.container)).toHaveLength(2);
  });

  it("starts a newly selected motion on its recognizable opening beat", () => {
    let frame: FrameRequestCallback | undefined;
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      frame = callback;
      return 1;
    });
    const { rerender } = render(<SulaLoader motion="orbit" />);

    rerender(<SulaLoader motion="twin" />);
    act(() => frame?.(performance.now()));

    expect(vi.mocked(loaderFrame)).toHaveBeenLastCalledWith(
      "twin",
      STATIC_PHASES.twin,
      96,
    );
  });

  it("has no axe violations, fluid or static", async () => {
    const fluid = render(<SulaLoader />);
    expect(await axe(fluid.container)).toHaveNoViolations();
    fluid.unmount();

    const still = render(<SulaLoader fluid={false} />);
    expect(await axe(still.container)).toHaveNoViolations();
  });
});
