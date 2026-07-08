import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { type RoadmapMilestone, RoadmapTimeline } from "./roadmap-timeline.js";

const milestones: RoadmapMilestone[] = [
  {
    version: "0.1",
    status: "Shipped",
    title: "Foundations",
    body: "Tokens and primitives.",
    tone: "done",
    items: [{ label: "Design tokens" }, { label: "Five primitives" }],
  },
  {
    version: "0.2",
    status: "In progress",
    title: "Patterns",
    tone: "current",
    items: [{ label: "Bento grid" }, { label: "Page header", featured: true }],
  },
  {
    version: "0.3",
    status: "Planned",
    title: "Showcase",
    tone: "planned",
    items: [{ label: "Motion blocks" }],
  },
];

describe("RoadmapTimeline", () => {
  it("renders each milestone as an item of one ordered list", () => {
    render(<RoadmapTimeline milestones={milestones} />);
    expect(screen.getAllByRole("list")[0]?.tagName).toBe("OL");
    expect(screen.getByText("Foundations")).toBeInTheDocument();
    expect(screen.getByText("Patterns")).toBeInTheDocument();
    expect(screen.getByText("Showcase")).toBeInTheDocument();
  });

  it("renders the version, status, body and items", () => {
    render(<RoadmapTimeline milestones={milestones} />);
    expect(screen.getByText("0.1")).toBeInTheDocument();
    expect(screen.getByText("In progress")).toBeInTheDocument();
    expect(screen.getByText("Tokens and primitives.")).toBeInTheDocument();
    expect(screen.getByText("Design tokens")).toBeInTheDocument();
  });

  it("renders the headline at a chosen level", () => {
    render(<RoadmapTimeline headingLevel="h2" milestones={milestones} />);
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(3);
  });

  it("omits the marker on a featured item", () => {
    const { container } = render(<RoadmapTimeline milestones={milestones} />);
    const featured = screen.getByText("Page header");
    expect(featured.querySelector("svg")).toBeNull();
    expect(container.querySelectorAll("svg").length).toBeGreaterThan(0);
  });

  it("swaps the marker icon", () => {
    render(
      <RoadmapTimeline
        milestones={milestones}
        markerIcon={<span data-testid="dot" />}
      />,
    );
    expect(screen.getAllByTestId("dot").length).toBeGreaterThan(0);
  });

  describe("connector track", () => {
    /** sisu hardcodes 16.666% for exactly three columns. Any count has to work. */
    it("centers each node over its column, whatever the count", () => {
      const { container } = render(
        <RoadmapTimeline milestones={milestones.slice(0, 2)} />,
      );
      const nodes = container.querySelectorAll("[data-roadmap-track] > span");
      expect(nodes).toHaveLength(2);
      expect(nodes[0]).toHaveStyle({ left: "25%" });
      expect(nodes[1]).toHaveStyle({ left: "75%" });
    });

    it("runs the filled part up to the current milestone", () => {
      const { container } = render(<RoadmapTimeline milestones={milestones} />);
      const fill = container.querySelector("[data-roadmap-track-fill]");
      expect(fill).toHaveStyle({ left: "16.666666666666664%" });
    });

    it("runs the filled part to the last shipped milestone when none is current", () => {
      const shipped = milestones.map((m) =>
        m.tone === "current" ? { ...m, tone: "done" as const } : m,
      );
      const { container } = render(<RoadmapTimeline milestones={shipped} />);
      expect(
        container.querySelector("[data-roadmap-track-fill]"),
      ).toBeInTheDocument();
    });

    it("draws no fill when nothing has shipped", () => {
      const planned = milestones.map((m) => ({
        ...m,
        tone: "planned" as const,
      }));
      const { container } = render(<RoadmapTimeline milestones={planned} />);
      expect(container.querySelector("[data-roadmap-track-fill]")).toBeNull();
    });

    it("draws no track for a single milestone", () => {
      const { container } = render(
        <RoadmapTimeline milestones={milestones.slice(0, 1)} />,
      );
      expect(container.querySelector("[data-roadmap-track]")).toBeNull();
    });

    it("hides the track on request", () => {
      const { container } = render(
        <RoadmapTimeline hideTrack milestones={milestones} />,
      );
      expect(container.querySelector("[data-roadmap-track]")).toBeNull();
    });

    it("keeps the track out of the a11y tree", () => {
      const { container } = render(<RoadmapTimeline milestones={milestones} />);
      expect(container.querySelector("[data-roadmap-track]")).toHaveAttribute(
        "aria-hidden",
        "true",
      );
    });
  });

  it("sizes the titles off its container, not the viewport", () => {
    render(<RoadmapTimeline milestones={milestones} />);
    const className = screen.getByText("Patterns").className;
    expect(className).toContain("cqi");
    expect(className).not.toContain("vw");
  });

  it("has no a11y violations", async () => {
    const { container } = render(<RoadmapTimeline milestones={milestones} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
