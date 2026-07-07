import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { CtaBanner } from "./cta-banner.js";

describe("CtaBanner", () => {
  it("renders the title and body", () => {
    render(<CtaBanner title="Add it to Chrome" body="Takes a minute." />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Add it to Chrome",
    );
    expect(screen.getByText("Takes a minute.")).toBeInTheDocument();
  });

  it("renders the headline at a chosen level", () => {
    render(<CtaBanner headingLevel="h3" title="Add it" />);
    expect(screen.getByRole("heading", { level: 3 })).toBeInTheDocument();
  });

  it("renders steps as an ordered list", () => {
    render(<CtaBanner title="Add it" steps={["Install", "Sign in"]} />);
    expect(screen.getByRole("list").tagName).toBe("OL");
  });

  it("omits the step list when there are no steps", () => {
    render(<CtaBanner title="Add it" />);
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("renders the action slot", () => {
    render(
      <CtaBanner title="Add it" action={<button type="button">Go</button>} />,
    );
    expect(screen.getByRole("button", { name: "Go" })).toBeInTheDocument();
  });

  it("renders a footer with its label", () => {
    render(
      <CtaBanner
        title="Add it"
        footerLabel="Confirmed at"
        footer={<span>Aalto</span>}
      />,
    );
    expect(screen.getByText("Confirmed at")).toBeInTheDocument();
    expect(screen.getByText("Aalto")).toBeInTheDocument();
  });

  it("omits the footer rule when there is no footer", () => {
    const { container } = render(<CtaBanner title="Add it" />);
    expect(container.querySelector("[data-cta-rule]")).toBeNull();
  });

  it("draws the footer rule when there is a footer", () => {
    const { container } = render(
      <CtaBanner title="Add it" footer={<span>Aalto</span>} />,
    );
    expect(container.querySelector("[data-cta-rule]")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <CtaBanner
        title="Add it to Chrome"
        body="Takes a minute."
        steps={["Install", "Sign in", "Done"]}
        stepsLabel="Setup steps"
        action={<button type="button">Add to Chrome</button>}
        footerLabel="Confirmed at"
        footer={<span>Aalto</span>}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
