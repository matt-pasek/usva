import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { Pullquote } from "./pullquote.js";

describe("Pullquote", () => {
  it("renders the quote as a blockquote", () => {
    const { container } = render(
      <Pullquote>Beauty that stays usable.</Pullquote>,
    );
    const quote = container.querySelector("blockquote");
    expect(quote).not.toBeNull();
    expect(quote).toHaveTextContent("Beauty that stays usable.");
  });

  it("renders an attribution when given", () => {
    render(
      <Pullquote attribution="Matt Pasek">Beauty that stays usable.</Pullquote>,
    );
    expect(screen.getByText("Matt Pasek")).toBeInTheDocument();
  });

  it("ties the attribution to the quote via a figure", () => {
    const { container } = render(
      <Pullquote attribution="Matt Pasek">Beauty.</Pullquote>,
    );
    const figure = container.querySelector("figure");
    expect(figure).not.toBeNull();
    expect(figure?.querySelector("figcaption")).toHaveTextContent("Matt Pasek");
  });

  it("omits the figcaption when there is no attribution", () => {
    const { container } = render(<Pullquote>Beauty.</Pullquote>);
    expect(container.querySelector("figcaption")).toBeNull();
  });

  it("renders an ornament above the quote and hides it from assistive tech", () => {
    const { container } = render(
      <Pullquote ornament={<div data-testid="sphere" />}>Beauty.</Pullquote>,
    );
    expect(screen.getByTestId("sphere")).toBeInTheDocument();
    expect(
      container.querySelector("[data-pullquote-ornament]"),
    ).toHaveAttribute("aria-hidden", "true");
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <Pullquote attribution="Matt Pasek" ornament={<div />}>
        Beauty that stays usable.
      </Pullquote>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
