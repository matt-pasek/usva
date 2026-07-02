import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Card, CardBody, CardFooter, CardHeader } from "./card.js";

describe("Card", () => {
  it("composes sections", () => {
    render(
      <Card>
        <CardHeader>H</CardHeader>
        <CardBody>B</CardBody>
        <CardFooter>F</CardFooter>
      </Card>,
    );
    expect(screen.getByText("H")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
    expect(screen.getByText("F")).toBeInTheDocument();
  });
  it("carries surface + border classes", () => {
    const { container } = render(<Card>x</Card>);
    expect(container.firstElementChild?.className).toContain("bg-surface");
  });
});
