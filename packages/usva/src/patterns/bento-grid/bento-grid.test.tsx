import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { BentoCard, BentoGrid } from "./bento-grid.js";

describe("BentoGrid", () => {
  it("paints one shared wash spanning the grid", () => {
    const { container } = render(<BentoGrid>x</BentoGrid>);
    const el = container.firstElementChild;
    expect(el?.className).toContain("wash-accent");
    expect(el?.className).toContain("grid");
  });
  it("defaults to a responsive auto-fit template", () => {
    const { container } = render(<BentoGrid>x</BentoGrid>);
    expect(container.firstElementChild?.className).toContain("auto-fit");
  });
  it("switches to an explicit column count", () => {
    const { container } = render(<BentoGrid columns={3}>x</BentoGrid>);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.gridTemplateColumns).toContain("repeat(3");
    expect(el.className).not.toContain("auto-fit");
  });
  it("applies column and row spans on a cell", () => {
    const { container } = render(
      <BentoGrid>
        <BentoCard span={2} rowSpan={3}>
          cell
        </BentoCard>
      </BentoGrid>,
    );
    const cell = container.querySelector(
      "[style*='grid-column']",
    ) as HTMLElement;
    expect(cell.style.gridColumn).toBe("span 2");
    expect(cell.style.gridRow).toBe("span 3");
  });
  it("uses a translucent surface so the shared wash reads through", () => {
    const { container } = render(
      <BentoGrid>
        <BentoCard>cell</BentoCard>
      </BentoGrid>,
    );
    const cell = container.querySelector("[data-bento-card]");
    expect(cell?.className).toContain("bg-surface/70");
  });
  it("passes the highlight vocabulary through to the Card", () => {
    const { container } = render(
      <BentoGrid>
        <BentoCard highlight="ring">cell</BentoCard>
      </BentoGrid>,
    );
    expect(container.querySelector("[data-highlight='ring']")).not.toBeNull();
  });
  it("has no a11y violations", async () => {
    const { container } = render(
      <BentoGrid columns={2}>
        <BentoCard span={2}>
          <p>Tile one</p>
        </BentoCard>
        <BentoCard>
          <p>Tile two</p>
        </BentoCard>
      </BentoGrid>,
    );
    expect(await axe(container)).toHaveNoViolations();
    expect(screen.getByText("Tile one")).toBeInTheDocument();
  });
});
