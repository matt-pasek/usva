import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { FeatureCarousel } from "./feature-carousel.js";

const cards = [
  { title: "Fast", body: "It's quick." },
  { title: "Private", body: "It's yours." },
  { title: "Open", body: "It's forkable." },
];

describe("FeatureCarousel", () => {
  it("shows the first card by default", () => {
    render(<FeatureCarousel cards={cards} />);
    expect(screen.getByRole("heading", { name: "Fast" })).toBeInTheDocument();
  });

  it("renders a selector button per card", () => {
    render(<FeatureCarousel cards={cards} />);
    expect(
      screen.getByRole("button", { name: "Show Fast" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Show Open" }),
    ).toBeInTheDocument();
  });

  it("switches the active card on click", async () => {
    render(<FeatureCarousel cards={cards} />);
    await userEvent.click(screen.getByRole("button", { name: "Show Private" }));
    expect(
      screen.getByRole("heading", { name: "Private" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Show Private" }),
    ).toHaveAttribute("aria-current", "true");
  });

  it("renders nothing for empty cards", () => {
    const { container } = render(<FeatureCarousel cards={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("has no a11y violations", async () => {
    const { container } = render(<FeatureCarousel cards={cards} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
