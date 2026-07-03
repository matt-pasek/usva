import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { Toolbar, ToolbarActions, ToolbarGroup } from "./toolbar.js";

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
