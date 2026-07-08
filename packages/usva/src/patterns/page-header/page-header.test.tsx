import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import {
  PageHeader,
  PageHeaderMetric,
  PageHeaderStat,
  PageHeaderStats,
} from "./page-header.js";

describe("PageHeader", () => {
  it("renders the title and its accented phrase", () => {
    render(<PageHeader title="Good afternoon," titleAccent="Mateusz." />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Good afternoon, Mateusz.",
    );
  });

  it("renders the headline at a chosen level", () => {
    render(<PageHeader headingLevel="h2" title="Summer 2026" />);
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });

  it("colors the accented phrase with an arbitrary categorical color", () => {
    render(
      <PageHeader title="Hi," titleAccent="Anna." accentColor="#52c989" />,
    );
    expect(screen.getByText("Anna.")).toHaveStyle({ color: "#52c989" });
  });

  it("renders the eyebrow, meta, aside, action, progress and footer slots", () => {
    render(
      <PageHeader
        title="x"
        eyebrow="Lut University"
        meta="Modified 3 Jul"
        aside={<span data-testid="aside">chart</span>}
        action={<button type="button">Edit</button>}
        progress={<div data-testid="progress" />}
        footer="104 cr to degree minimum"
      />,
    );
    expect(screen.getByText("Lut University")).toBeInTheDocument();
    expect(screen.getByText("Modified 3 Jul")).toBeInTheDocument();
    expect(screen.getByTestId("aside")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Edit" })).toBeInTheDocument();
    expect(screen.getByTestId("progress")).toBeInTheDocument();
    expect(screen.getByText("104 cr to degree minimum")).toBeInTheDocument();
  });

  it("paints a background behind a scrim", () => {
    const { container } = render(
      <PageHeader title="x" background={<div data-testid="waves" />} />,
    );
    expect(screen.getByTestId("waves")).toBeInTheDocument();
    const scrim = container.querySelector("[data-page-header-scrim]");
    expect(scrim).toHaveAttribute("aria-hidden", "true");
  });

  it("draws no scrim when there is no background", () => {
    const { container } = render(<PageHeader title="x" />);
    expect(container.querySelector("[data-page-header-scrim]")).toBeNull();
  });

  it("sizes the title off its container, not the viewport", () => {
    render(<PageHeader title="x" />);
    const className = screen.getByRole("heading", { level: 1 }).className;
    expect(className).toContain("cqi");
    expect(className).not.toContain("vw");
  });

  it("switches to two columns on container width, not viewport width", () => {
    const { container } = render(<PageHeader title="x" />);
    expect(container.firstElementChild?.className).toContain("@container");
    expect(container.innerHTML).toContain("@2xl:flex-row");
  });

  it("shrinks the title in the compact size", () => {
    const { rerender } = render(<PageHeader title="x" />);
    const big = screen.getByRole("heading", { level: 1 }).className;
    rerender(<PageHeader title="x" size="compact" />);
    const small = screen.getByRole("heading", { level: 1 }).className;
    expect(small).not.toEqual(big);
  });

  describe("controls", () => {
    const controls = <button type="button">Grade avg.</button>;

    it("keeps a closed region out of the a11y tree and the tab order", () => {
      const { container } = render(
        <PageHeader title="x" controls={controls} />,
      );
      const region = container.querySelector("[data-page-header-controls]");
      expect(region).toHaveAttribute("inert");
      expect(region).not.toHaveAttribute("data-open");
    });

    it("opens the region without unmounting its contents", () => {
      const { container } = render(
        <PageHeader title="x" controls={controls} controlsOpen />,
      );
      const region = container.querySelector("[data-page-header-controls]");
      expect(region).not.toHaveAttribute("inert");
      expect(region).toHaveAttribute("data-open");
      expect(
        screen.getByRole("button", { name: "Grade avg." }),
      ).toBeInTheDocument();
    });

    it("renders no region at all without controls", () => {
      const { container } = render(<PageHeader title="x" />);
      expect(container.querySelector("[data-page-header-controls]")).toBeNull();
    });
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <PageHeader
        title="Good afternoon,"
        titleAccent="Mateusz."
        eyebrow="Lut University"
        meta="Summer 2026"
        aside={<PageHeaderMetric value={76} total={193} caption="credits" />}
        footer="104 cr to go"
      >
        <PageHeaderStats>
          <PageHeaderStat
            variant="featured"
            tone="accent"
            label="Grade avg."
            value="4.1"
            sub="4 graded"
          />
          <PageHeaderStat label="Active courses" value="4" sub="Enrolled" />
        </PageHeaderStats>
      </PageHeader>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("PageHeaderStat", () => {
  it("pairs each label with its value as a description list", () => {
    const { container } = render(
      <PageHeaderStats>
        <PageHeaderStat label="Credits left" value="104 cr" />
      </PageHeaderStats>,
    );
    expect(container.querySelector("dl")).toBeInTheDocument();
    expect(container.querySelector("dt")).toHaveTextContent("Credits left");
    expect(container.querySelector("dd")).toHaveTextContent("104 cr");
  });

  it("marks its variant so a header can style the row", () => {
    render(
      <PageHeaderStats>
        <PageHeaderStat label="a" value="1" />
        <PageHeaderStat variant="panel" label="b" value="2" />
      </PageHeaderStats>,
    );
    expect(screen.getByText("a").parentElement).toHaveAttribute(
      "data-page-header-stat",
      "plain",
    );
    expect(screen.getByText("b").parentElement).toHaveAttribute(
      "data-page-header-stat",
      "panel",
    );
  });

  it("carries the tone through to the value", () => {
    render(
      <PageHeaderStats>
        <PageHeaderStat tone="warning" label="Deadlines" value="2" />
      </PageHeaderStats>,
    );
    expect(screen.getByText("2").className).toContain("text-warning");
  });

  /** A tile inside a Card must not paint the same fill the Card already paints. */
  it("fills the featured tile with a translucent ink wash, never bg-surface", () => {
    render(
      <PageHeaderStats>
        <PageHeaderStat variant="featured" label="a" value="1" />
      </PageHeaderStats>,
    );
    const tile = screen.getByText("a").parentElement;
    expect(tile?.className).toContain("bg-ink/[0.05]");
    expect(tile?.className).not.toContain("bg-surface");
  });
});

describe("PageHeaderMetric", () => {
  it("renders the value over its total", () => {
    render(<PageHeaderMetric value={76} total={193} caption="credits" />);
    expect(screen.getByText(/76/)).toHaveTextContent("76 / 193");
    expect(screen.getByText("credits")).toBeInTheDocument();
  });

  it("omits the total when there is none", () => {
    const { container } = render(<PageHeaderMetric value="42%" />);
    expect(container).toHaveTextContent("42%");
    expect(container.textContent).not.toContain("/");
  });
});
