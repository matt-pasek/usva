import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { afterEach, describe, expect, it } from "vitest";
import { LoadingOverlay } from "./loading-overlay.js";

afterEach(() => {
  document.body.style.overflow = "";
});

describe("LoadingOverlay", () => {
  it("announces the label once, and repeats it as hidden ornament", () => {
    render(<LoadingOverlay label="Loading dashboard" />);
    expect(screen.getByRole("status")).toHaveTextContent("Loading dashboard");

    const caption = screen
      .getAllByText("Loading dashboard")
      .find((el) => el.tagName === "P");
    expect(caption).toHaveAttribute("aria-hidden", "true");
  });

  it("contains itself to the parent by default and locks nothing", () => {
    render(<LoadingOverlay />);
    expect(screen.getByTestId("loading-overlay").className).toContain(
      "absolute",
    );
    expect(document.body.style.overflow).toBe("");
  });

  it("covers the viewport and locks scroll when asked", () => {
    render(<LoadingOverlay contain="viewport" />);
    expect(screen.getByTestId("loading-overlay").className).toContain("fixed");
    expect(document.body.style.overflow).toBe("hidden");
  });
});

describe("scroll lock refcounting", () => {
  it("holds the lock while any viewport overlay remains mounted", () => {
    const first = render(<LoadingOverlay contain="viewport" />);
    const second = render(<LoadingOverlay contain="viewport" />);
    expect(document.body.style.overflow).toBe("hidden");

    first.unmount();
    expect(document.body.style.overflow).toBe("hidden");

    second.unmount();
    expect(document.body.style.overflow).toBe("");
  });

  it("restores the prior overflow value rather than clobbering it", () => {
    document.body.style.overflow = "scroll";

    const view = render(<LoadingOverlay contain="viewport" />);
    expect(document.body.style.overflow).toBe("hidden");

    view.unmount();
    expect(document.body.style.overflow).toBe("scroll");
  });

  it("a parent-contained overlay never touches body overflow", () => {
    document.body.style.overflow = "scroll";
    const view = render(<LoadingOverlay contain="parent" />);
    expect(document.body.style.overflow).toBe("scroll");
    view.unmount();
    expect(document.body.style.overflow).toBe("scroll");
  });

  it("has no a11y violations", async () => {
    const { container } = render(<LoadingOverlay label="Loading" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
