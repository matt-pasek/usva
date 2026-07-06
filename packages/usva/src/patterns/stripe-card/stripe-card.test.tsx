import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { StripeCard } from "./stripe-card.js";

describe("StripeCard", () => {
  it("renders heading and meta", () => {
    render(
      <StripeCard heading="Algorithms" metaLeft="CS-201" metaRight="5 cr" />,
    );
    expect(screen.getByText("Algorithms")).toBeInTheDocument();
    expect(screen.getByText("CS-201")).toBeInTheDocument();
    expect(screen.getByText("5 cr")).toBeInTheDocument();
  });

  it("renders badge and footer slots", () => {
    render(
      <StripeCard
        heading="Course"
        badge={<span>enrolled</span>}
        footer={<span>updated today</span>}
      />,
    );
    expect(screen.getByText("enrolled")).toBeInTheDocument();
    expect(screen.getByText("updated today")).toBeInTheDocument();
  });

  it("marks the selected state with the glow ring", () => {
    const { container } = render(<StripeCard heading="Sel" selected />);
    expect(container.querySelector("[data-highlight='ring']")).not.toBeNull();
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <StripeCard
        heading="Data structures"
        metaLeft="CS-202"
        metaRight="4 cr"
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
