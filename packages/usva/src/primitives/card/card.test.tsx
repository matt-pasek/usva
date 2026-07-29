import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import {
  Card,
  CardActions,
  CardBadge,
  CardBody,
  CardEyebrow,
  CardFooter,
  CardHeader,
  CardIcon,
  CardTitle,
} from "./card.js";

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
  it("defaults CardHeader to a column layout", () => {
    const { container } = render(<CardHeader>h</CardHeader>);
    expect(container.firstElementChild?.className).toContain("flex-col");
  });
  it("switches CardHeader to a row layout", () => {
    const { container } = render(<CardHeader row>h</CardHeader>);
    expect(container.firstElementChild?.className).toContain("flex-row");
  });
  it("renders the composed header parts", () => {
    render(
      <Card>
        <CardHeader row>
          <CardIcon>
            <svg aria-hidden="true" viewBox="0 0 16 16" />
          </CardIcon>
          <div>
            <CardEyebrow>Eyebrow</CardEyebrow>
            <CardTitle>Title</CardTitle>
          </div>
          <CardActions>
            <CardBadge tone="accent">live</CardBadge>
          </CardActions>
        </CardHeader>
      </Card>,
    );
    expect(screen.getByText("Eyebrow")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Title" })).toBeInTheDocument();
    expect(screen.getByText("live").className).toContain("text-accent");
  });
  it("maps the legacy wash prop to the wash highlight", () => {
    const { container } = render(<Card wash>x</Card>);
    const el = container.firstElementChild;
    expect(el?.className).toContain("wash-accent");
    expect(el?.getAttribute("data-highlight")).toBe("wash");
  });
  it("renders the edge highlight as a top hairline", () => {
    const { container } = render(<Card highlight="edge">x</Card>);
    const el = container.firstElementChild;
    expect(el?.className).toContain("after:hairline-accent");
    expect(el?.className).toContain("after:top-0");
  });
  it("swaps the elevation shadow for a glow ring", () => {
    const { container } = render(<Card highlight="ring">x</Card>);
    const el = container.firstElementChild;
    expect(el?.className).toContain("glow-ring");
    expect(el?.className).not.toContain("shadow-floating");
  });
  it("defaults to no highlight", () => {
    const { container } = render(<Card>x</Card>);
    const el = container.firstElementChild;
    expect(el?.getAttribute("data-highlight")).toBeNull();
    expect(el?.className).toContain("shadow-floating");
  });
  it("has no a11y violations with a composed header", async () => {
    const { container } = render(
      <Card>
        <CardHeader row>
          <div>
            <CardEyebrow>Eyebrow</CardEyebrow>
            <CardTitle>Title</CardTitle>
          </div>
          <CardActions>
            <CardBadge>new</CardBadge>
          </CardActions>
        </CardHeader>
        <CardBody>Body copy</CardBody>
      </Card>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
