import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import {
  Toolbar,
  ToolbarActions,
  ToolbarCount,
  ToolbarGroup,
  ToolbarLegend,
  ToolbarLegendItem,
} from "./toolbar.js";

function Sample() {
  return (
    <Toolbar aria-label="Projects toolbar">
      <ToolbarGroup>
        <span>Leading</span>
      </ToolbarGroup>
      <ToolbarActions>
        <button type="button">Action</button>
      </ToolbarActions>
    </Toolbar>
  );
}

describe("Toolbar", () => {
  it("renders as a toolbar landmark with its groups", () => {
    render(<Sample />);
    expect(screen.getByRole("toolbar")).toBeInTheDocument();
    expect(screen.getByText("Leading")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Action" })).toBeInTheDocument();
  });

  it("right-aligns actions with an auto left margin", () => {
    render(<Sample />);
    expect(screen.getByText("Action").closest("div")?.className).toContain(
      "ml-auto",
    );
  });

  it("forwards a className onto the shell", () => {
    render(
      <Toolbar aria-label="t" className="custom-shell">
        <span>x</span>
      </Toolbar>,
    );
    expect(screen.getByRole("toolbar").className).toContain("custom-shell");
  });

  it("no a11y violations", async () => {
    const { container } = render(<Sample />);
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("ToolbarLegend", () => {
  it("renders every item when under the cap", () => {
    render(
      <ToolbarLegend max={6}>
        <ToolbarLegendItem swatch="#8b5cf6">Computer Science</ToolbarLegendItem>
        <ToolbarLegendItem swatch="#52c989">Mathematics</ToolbarLegendItem>
      </ToolbarLegend>,
    );
    expect(screen.getByText("Computer Science")).toBeInTheDocument();
    expect(screen.getByText("Mathematics")).toBeInTheDocument();
  });

  it("collapses the tail into a +N overflow indicator", () => {
    render(
      <ToolbarLegend max={2}>
        <ToolbarLegendItem>One</ToolbarLegendItem>
        <ToolbarLegendItem>Two</ToolbarLegendItem>
        <ToolbarLegendItem>Three</ToolbarLegendItem>
        <ToolbarLegendItem>Four</ToolbarLegendItem>
      </ToolbarLegend>,
    );
    expect(screen.getByText("One")).toBeInTheDocument();
    expect(screen.queryByText("Three")).toBeNull();
    expect(screen.getByText("+2")).toBeInTheDocument();
  });

  it("applies an arbitrary categorical swatch colour", () => {
    render(
      <ToolbarLegendItem swatch="#8b5cf6">Computer Science</ToolbarLegendItem>,
    );
    expect(screen.getByTestId("toolbar-legend-swatch")).toHaveStyle({
      backgroundColor: "#8b5cf6",
    });
  });
});

describe("ToolbarCount", () => {
  it("renders the count and its label", () => {
    render(
      <ToolbarCount tone="accent" count={3}>
        unsaved
      </ToolbarCount>,
    );
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("unsaved")).toBeInTheDocument();
  });

  it("renders nothing at or below zero", () => {
    const { container } = render(
      <ToolbarCount tone="warning" count={0}>
        issue
      </ToolbarCount>,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it("no a11y violations in a full toolbar", async () => {
    const { container } = render(
      <Toolbar aria-label="Timeline toolbar">
        <ToolbarLegend max={2}>
          <ToolbarLegendItem swatch="#8b5cf6">CS</ToolbarLegendItem>
          <ToolbarLegendItem swatch="#52c989">Maths</ToolbarLegendItem>
          <ToolbarLegendItem swatch="#e0b341">Physics</ToolbarLegendItem>
        </ToolbarLegend>
        <ToolbarActions>
          <ToolbarCount tone="accent" count={3}>
            unsaved
          </ToolbarCount>
          <ToolbarCount tone="warning" count={1}>
            issue
          </ToolbarCount>
        </ToolbarActions>
      </Toolbar>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
