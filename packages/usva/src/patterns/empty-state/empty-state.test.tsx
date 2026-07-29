import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { EmptyState } from "./empty-state.js";

describe("EmptyState", () => {
  it("renders title and description", () => {
    render(
      <EmptyState title="No projects yet" description="Create one to begin." />,
    );
    expect(
      screen.getByRole("heading", { name: "No projects yet" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Create one to begin.")).toBeInTheDocument();
  });

  it("renders an action slot", () => {
    render(
      <EmptyState title="Empty" action={<button type="button">Add</button>} />,
    );
    expect(screen.getByRole("button", { name: "Add" })).toBeInTheDocument();
  });

  it("applies a dashed border in the dashed variant", () => {
    const { container } = render(<EmptyState title="Empty" variant="dashed" />);
    expect(container.firstElementChild?.className).toContain("border-dashed");
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <EmptyState
        title="No results"
        description="Try a different search term."
        action={<button type="button">Reset</button>}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
