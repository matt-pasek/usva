import { fireEvent, render, waitFor } from "@testing-library/react";
import { axe } from "jest-axe";
import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { Skeleton } from "./skeleton.js";
import { SkeletonGroup } from "./skeleton-group.js";

describe("Skeleton", () => {
  function DeferredSkeleton() {
    const [visible, setVisible] = React.useState(false);
    return (
      <div>
        <button type="button" onClick={() => setVisible(true)}>
          reveal
        </button>
        {visible && <Skeleton />}
      </div>
    );
  }

  it("marks descendants as sharing the nearest SkeletonGroup sheen field", () => {
    const { container } = render(
      <SkeletonGroup>
        <div>
          <Skeleton />
        </div>
      </SkeletonGroup>,
    );

    expect(container.firstChild).toHaveAttribute("data-skeleton-group", "");
    expect(container.querySelector("[aria-hidden=true]")).toHaveAttribute(
      "data-skeleton-grouped",
      "",
    );
  });

  it("maps every skeleton into one group-sized sweep field", () => {
    const getBoundingClientRect = vi
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockImplementation(function (this: HTMLElement) {
        const box = this.hasAttribute("data-skeleton-group")
          ? { x: 100, y: 50, width: 300, height: 200 }
          : this.dataset.testid === "short"
            ? { x: 130, y: 90, width: 100, height: 20 }
            : { x: 150, y: 140, width: 200, height: 20 };

        return {
          ...box,
          top: box.y,
          right: box.x + box.width,
          bottom: box.y + box.height,
          left: box.x,
          toJSON: () => box,
        } as DOMRect;
      });

    const { container } = render(
      <SkeletonGroup>
        <Skeleton data-testid="short" />
        <Skeleton data-testid="long" />
      </SkeletonGroup>,
    );

    const group = container.firstChild as HTMLElement;
    const [short, long] = container.querySelectorAll<HTMLElement>(
      "[data-usva-skeleton]",
    );
    expect(group.style.getPropertyValue("--usva-skeleton-group-width")).toBe(
      "300px",
    );
    expect(group.style.getPropertyValue("--usva-skeleton-group-height")).toBe(
      "200px",
    );
    expect(short?.style.getPropertyValue("--usva-skeleton-offset-x")).toBe(
      "30px",
    );
    expect(short?.style.getPropertyValue("--usva-skeleton-offset-y")).toBe(
      "40px",
    );
    expect(long?.style.getPropertyValue("--usva-skeleton-offset-x")).toBe(
      "50px",
    );
    expect(long?.style.getPropertyValue("--usva-skeleton-offset-y")).toBe(
      "90px",
    );

    getBoundingClientRect.mockRestore();
  });

  it("registers skeletons that mount inside an already-rendered group", async () => {
    const { getByRole, container } = render(
      <SkeletonGroup>
        <DeferredSkeleton />
      </SkeletonGroup>,
    );

    fireEvent.click(getByRole("button", { name: "reveal" }));

    await waitFor(() =>
      expect(container.querySelector("[data-usva-skeleton]")).toHaveAttribute(
        "data-skeleton-grouped",
        "",
      ),
    );
  });

  it("is decorative: aria-hidden", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveAttribute("aria-hidden", "true");
  });

  it("carries one animation, the sheen, which the stylesheet stops under prefers-reduced-motion", () => {
    const { container } = render(<Skeleton />);
    expect(container.firstChild).toHaveClass("skeleton-sheen");
    expect(container.firstChild).not.toHaveClass("animate-shimmer");
  });

  it("applies variant shape classes", () => {
    const { container } = render(<Skeleton variant="circle" />);
    expect(container.firstChild).toHaveClass("rounded-full");
  });

  it("applies width and height via style", () => {
    const { container } = render(<Skeleton width={120} height={16} />);
    expect(container.firstChild).toHaveStyle({
      width: "120px",
      height: "16px",
    });
  });

  it("applies radius via style", () => {
    const { container } = render(<Skeleton radius={8} />);
    expect(container.firstChild).toHaveStyle({ borderRadius: "8px" });
  });

  it("no a11y violations", async () => {
    const { container } = render(<Skeleton />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
