import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { CaseStudyHero } from "./case-study-hero.js";

const meta = [
  { label: "Role", value: "Design engineer" },
  { label: "Timeline", value: "6 weeks" },
];

describe("CaseStudyHero", () => {
  it("renders the headline and its accented continuation", () => {
    render(
      <CaseStudyHero headline="One planner," headlineAccent="four systems." />,
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "One planner,four systems.",
    );
  });

  it("colors the accented continuation with an arbitrary categorical color", () => {
    render(
      <CaseStudyHero
        headline="One planner,"
        headlineAccent="four systems."
        accentColor="#52c989"
      />,
    );
    expect(screen.getByText("four systems.")).toHaveStyle({
      color: "#52c989",
    });
  });

  it("omits the accent span entirely when there is no continuation", () => {
    render(<CaseStudyHero headline="Just the headline" />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Just the headline",
    );
  });

  /** kajo renders the link twice, once per breakpoint. One link, one DOM node. */
  it("renders the link exactly once", () => {
    render(
      <CaseStudyHero
        headline="x"
        link={{ href: "https://example.com", label: "Visit site" }}
      />,
    );
    expect(screen.getAllByRole("link", { name: /visit site/i })).toHaveLength(
      1,
    );
  });

  it("marks an external link safe and announces the new tab", () => {
    render(
      <CaseStudyHero
        headline="x"
        link={{
          href: "https://example.com",
          label: "Visit site",
          external: true,
        }}
      />,
    );
    const link = screen.getByRole("link", { name: /visit site/i });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
    expect(link).toHaveAttribute("rel", expect.stringContaining("noreferrer"));
  });

  it("does not set target on an internal link", () => {
    render(
      <CaseStudyHero
        headline="x"
        link={{ href: "/work", label: "Read more" }}
      />,
    );
    expect(screen.getByRole("link")).not.toHaveAttribute("target");
  });

  it("renders each meta pair as a label and value", () => {
    render(<CaseStudyHero headline="x" meta={meta} />);
    expect(screen.getByText("Role")).toBeInTheDocument();
    expect(screen.getByText("Design engineer")).toBeInTheDocument();
    expect(screen.getByText("6 weeks")).toBeInTheDocument();
  });

  it("omits the meta grid when there are no pairs", () => {
    const { container } = render(<CaseStudyHero headline="x" meta={[]} />);
    expect(container.querySelector("dl")).toBeNull();
  });

  it("renders the headline at a chosen heading level", () => {
    render(<CaseStudyHero headingLevel="h2" headline="Nested hero" />);
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 1 })).not.toBeInTheDocument();
  });

  it("renders tags as an arbitrary node slot", () => {
    render(
      <CaseStudyHero
        headline="x"
        tags={<span data-testid="tag">React</span>}
      />,
    );
    expect(screen.getByTestId("tag")).toBeInTheDocument();
  });

  it("renders children as the media slot", () => {
    render(
      <CaseStudyHero headline="x">
        <img alt="Product screenshot" src="/shot.png" />
      </CaseStudyHero>,
    );
    expect(screen.getByAltText("Product screenshot")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <CaseStudyHero
        eyebrow="Case study"
        kicker="Acme, 2026"
        headline="One planner,"
        headlineAccent="four systems."
        tagline="Reconciling four registries into one view."
        link={{
          href: "https://example.com",
          label: "Visit site",
          external: true,
        }}
        meta={meta}
        tags={<span>React</span>}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
