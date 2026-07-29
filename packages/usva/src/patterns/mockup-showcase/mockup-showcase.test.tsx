import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { MockupShowcase } from "./mockup-showcase.js";

describe("MockupShowcase", () => {
  it("renders whatever media it is given", () => {
    render(
      <MockupShowcase>
        <img src="/shot.png" alt="The docs homepage" />
      </MockupShowcase>,
    );
    expect(screen.getByAltText("The docs homepage")).toBeInTheDocument();
  });

  it("accepts a non-image child", () => {
    render(
      <MockupShowcase>
        <video data-testid="clip">
          <track kind="captions" />
        </video>
      </MockupShowcase>,
    );
    expect(screen.getByTestId("clip")).toBeInTheDocument();
  });

  it("applies the aspect ratio to the media well", () => {
    render(
      <MockupShowcase aspect="4/3">
        <img src="/s.png" alt="s" />
      </MockupShowcase>,
    );
    expect(screen.getByTestId("mockup-well")).toHaveStyle({
      aspectRatio: "4/3",
    });
  });

  it("lets live children set the height when aspect is auto", () => {
    render(
      <MockupShowcase aspect="auto">
        <div data-testid="app">live app</div>
      </MockupShowcase>,
    );
    const well = screen.getByTestId("mockup-well");
    expect(well.style.aspectRatio).toBe("");
    expect(well.className).not.toContain("object-cover");
  });

  it("shows a decorative address bar for the browser frame", () => {
    render(
      <MockupShowcase frame="browser" url="usva.dev">
        <img src="/s.png" alt="s" />
      </MockupShowcase>,
    );
    const bar = screen.getByText("usva.dev");
    expect(bar.closest("[aria-hidden='true']")).not.toBeNull();
  });

  it("omits the chrome entirely for frame=none", () => {
    render(
      <MockupShowcase frame="none" url="usva.dev">
        <img src="/s.png" alt="s" />
      </MockupShowcase>,
    );
    expect(screen.queryByText("usva.dev")).toBeNull();
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <MockupShowcase frame="browser" url="usva.dev">
        <img src="/shot.png" alt="The docs homepage" />
      </MockupShowcase>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
