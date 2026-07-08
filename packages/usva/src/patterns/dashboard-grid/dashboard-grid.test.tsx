import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import * as React from "react";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { DashboardGrid, DashboardGridItem } from "./dashboard-grid.js";
import type { GridItem } from "./grid-layout.js";

beforeAll(() => {
  // jsdom ships no ResizeObserver, and the grid measures itself with one.
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  );
});

const initial: GridItem[] = [
  { id: "trajectory", x: 0, y: 0, w: 4, h: 2, minW: 2 },
  { id: "upcoming", x: 4, y: 0, w: 3, h: 2 },
];

function Grid({
  layout: seed = initial,
  editing = true,
  onLayoutChange,
  ...rest
}: {
  layout?: GridItem[];
  editing?: boolean;
  onLayoutChange?: (layout: GridItem[]) => void;
  columns?: number;
  rows?: number;
}) {
  const [layout, setLayout] = React.useState(seed);
  return (
    <DashboardGrid
      layout={layout}
      onLayoutChange={(next) => {
        setLayout(next);
        onLayoutChange?.(next);
      }}
      editing={editing}
      {...rest}
    >
      {layout.map((item) => (
        <DashboardGridItem
          key={item.id}
          id={item.id}
          label={item.id === "trajectory" ? "Credit trajectory" : "Upcoming"}
        >
          <div>{item.id}</div>
        </DashboardGridItem>
      ))}
    </DashboardGrid>
  );
}

const status = () =>
  document.querySelector("[data-dashboard-grid-status]")?.textContent ?? "";

describe("DashboardGrid", () => {
  it("places each item on the CSS grid from its layout entry", () => {
    render(<Grid editing={false} />);
    const item = screen.getByText("trajectory").parentElement;
    expect(item).toHaveStyle({
      gridColumn: "1 / span 4",
      gridRow: "1 / span 2",
    });
  });

  it("renders no edit chrome while editing is off", () => {
    render(<Grid editing={false} />);
    expect(screen.queryByLabelText("Move Credit trajectory")).toBeNull();
    expect(screen.queryByLabelText("Remove Credit trajectory")).toBeNull();
  });

  it("shows a move, remove and three resize controls per item while editing", () => {
    render(<Grid />);
    expect(screen.getByLabelText("Move Credit trajectory")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Remove Credit trajectory"),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Resize Credit trajectory"),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Resize Credit trajectory horizontally"),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText("Resize Credit trajectory vertically"),
    ).toBeInTheDocument();
  });

  /** 10 columns by 8 rows would be 80 droppable nodes. It is a painted grid. */
  it("paints the edit-mode cell outlines instead of rendering a cell per position", () => {
    const { container } = render(<Grid />);
    const grid = container.querySelector("[data-dashboard-grid]");
    expect(grid).toHaveAttribute("data-editing");
    expect(grid?.getAttribute("style")).toContain("linear-gradient");
    expect(grid?.children.length).toBe(2);
  });

  it("draws no cell outlines while editing is off", () => {
    const { container } = render(<Grid editing={false} />);
    const grid = container.querySelector("[data-dashboard-grid]");
    expect(grid).not.toHaveAttribute("data-editing");
    expect(grid?.getAttribute("style")).not.toContain("linear-gradient");
  });

  it("removes an item and says so", async () => {
    const user = userEvent.setup();
    const onLayoutChange = vi.fn();
    render(<Grid onLayoutChange={onLayoutChange} />);

    await user.click(screen.getByLabelText("Remove Credit trajectory"));
    expect(onLayoutChange).toHaveBeenLastCalledWith([initial[1]]);
    expect(status()).toBe("Credit trajectory removed.");
  });

  it("hides the remove button for an item that must stay", () => {
    render(
      <DashboardGrid layout={initial} onLayoutChange={() => {}} editing>
        <DashboardGridItem
          id="trajectory"
          label="Credit trajectory"
          removable={false}
        >
          <div>trajectory</div>
        </DashboardGridItem>
      </DashboardGrid>,
    );
    expect(screen.queryByLabelText("Remove Credit trajectory")).toBeNull();
    expect(screen.getByLabelText("Move Credit trajectory")).toBeInTheDocument();
  });

  it("renders nothing for an id that is not in the layout", () => {
    render(
      <DashboardGrid layout={initial} onLayoutChange={() => {}}>
        <DashboardGridItem id="ghost" label="Ghost">
          <div>ghost</div>
        </DashboardGridItem>
      </DashboardGrid>,
    );
    expect(screen.queryByText("ghost")).toBeNull();
  });

  it("throws when an item is rendered outside a grid", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() =>
      render(
        <DashboardGridItem id="a" label="A">
          <div />
        </DashboardGridItem>,
      ),
    ).toThrow(/inside a DashboardGrid/);
    spy.mockRestore();
  });

  describe("keyboard resize", () => {
    /** sisu's only keyboard affordance changes width and height together. */
    it("widens without growing taller", async () => {
      const user = userEvent.setup();
      const onLayoutChange = vi.fn();
      render(<Grid layout={[initial[0]!]} onLayoutChange={onLayoutChange} />);

      screen.getByLabelText("Resize Credit trajectory horizontally").focus();
      await user.keyboard("{ArrowRight}");

      expect(onLayoutChange).toHaveBeenLastCalledWith([
        expect.objectContaining({ w: 5, h: 2 }),
      ]);
      expect(status()).toBe("Credit trajectory resized to 5 by 2.");
    });

    it("grows taller without widening", async () => {
      const user = userEvent.setup();
      const onLayoutChange = vi.fn();
      render(<Grid layout={[initial[0]!]} onLayoutChange={onLayoutChange} />);

      screen.getByLabelText("Resize Credit trajectory vertically").focus();
      await user.keyboard("{ArrowDown}");

      expect(onLayoutChange).toHaveBeenLastCalledWith([
        expect.objectContaining({ w: 4, h: 3 }),
      ]);
    });

    it("ignores the cross-axis key on an axis handle", async () => {
      const user = userEvent.setup();
      const onLayoutChange = vi.fn();
      render(<Grid layout={[initial[0]!]} onLayoutChange={onLayoutChange} />);

      screen.getByLabelText("Resize Credit trajectory horizontally").focus();
      await user.keyboard("{ArrowDown}");
      expect(onLayoutChange).not.toHaveBeenCalled();
    });

    it("takes both axes on the corner handle", async () => {
      const user = userEvent.setup();
      const onLayoutChange = vi.fn();
      render(<Grid layout={[initial[0]!]} onLayoutChange={onLayoutChange} />);

      screen.getByLabelText("Resize Credit trajectory").focus();
      await user.keyboard("{ArrowRight}{ArrowDown}");
      expect(onLayoutChange).toHaveBeenLastCalledWith([
        expect.objectContaining({ w: 5, h: 3 }),
      ]);
    });

    it("refuses to grow into a neighbour and says why", async () => {
      const user = userEvent.setup();
      const onLayoutChange = vi.fn();
      render(<Grid onLayoutChange={onLayoutChange} />);

      screen.getByLabelText("Resize Credit trajectory horizontally").focus();
      await user.keyboard("{ArrowRight}");

      expect(onLayoutChange).not.toHaveBeenCalled();
      expect(status()).toBe("Credit trajectory cannot grow there.");
    });

    it("refuses to shrink below the item's own minimum", async () => {
      const user = userEvent.setup();
      const onLayoutChange = vi.fn();
      render(
        <Grid
          layout={[{ id: "trajectory", x: 0, y: 0, w: 2, h: 2, minW: 2 }]}
          onLayoutChange={onLayoutChange}
        />,
      );

      screen.getByLabelText("Resize Credit trajectory horizontally").focus();
      await user.keyboard("{ArrowLeft}");
      expect(onLayoutChange).not.toHaveBeenCalled();
    });
  });

  it("keeps a polite live region for the status text", () => {
    const { container } = render(<Grid />);
    const region = container.querySelector("[data-dashboard-grid-status]");
    expect(region).toHaveAttribute("aria-live", "polite");
    expect(region).toHaveAttribute("aria-atomic", "true");
  });

  it("has no a11y violations while editing", async () => {
    const { container } = render(<Grid />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no a11y violations at rest", async () => {
    const { container } = render(<Grid editing={false} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
