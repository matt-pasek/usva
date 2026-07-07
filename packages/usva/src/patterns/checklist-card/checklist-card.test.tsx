import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { ChecklistCard } from "./checklist-card.js";

const items = ["Runs on your machine", "No tracking", "Open source"];

describe("ChecklistCard", () => {
  it("renders every item as a list item", () => {
    render(<ChecklistCard items={items} />);
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
    expect(screen.getByText("No tracking")).toBeInTheDocument();
  });

  it("renders a real list, not a stack of divs", () => {
    render(<ChecklistCard items={items} />);
    expect(screen.getByRole("list")).toBeInTheDocument();
  });

  it("ships a default tick marker, hidden from assistive tech", () => {
    const { container } = render(<ChecklistCard items={items} />);
    const markers = container.querySelectorAll("[data-list-marker]");
    expect(markers).toHaveLength(3);
    expect(markers[0]).toHaveAttribute("aria-hidden", "true");
  });

  it("takes a custom marker", () => {
    render(
      <ChecklistCard
        items={items}
        marker={<svg data-testid="dot" aria-hidden="true" />}
      />,
    );
    expect(screen.getAllByTestId("dot")).toHaveLength(3);
  });

  it("renders a title when given one", () => {
    render(<ChecklistCard title="Privacy" items={items} />);
    expect(
      screen.getByRole("heading", { name: "Privacy" }),
    ).toBeInTheDocument();
  });

  it("omits the heading entirely when there is no title", () => {
    render(<ChecklistCard items={items} />);
    expect(screen.queryByRole("heading")).not.toBeInTheDocument();
  });

  it("accepts ReactNode items, not just strings", () => {
    render(<ChecklistCard items={[<strong key="a">Bold</strong>]} />);
    expect(screen.getByText("Bold")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <ChecklistCard title="Privacy" items={items} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
