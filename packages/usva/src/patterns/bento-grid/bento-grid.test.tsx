import { act, render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it, vi } from "vitest";
import {
  BentoCard,
  BentoGrid,
  BentoInfo,
  BentoMetric,
  BentoText,
} from "./bento-grid.js";

describe("BentoGrid", () => {
  it("paints one shared wash spanning the grid", () => {
    const { container } = render(<BentoGrid>x</BentoGrid>);
    const el = container.firstElementChild;
    expect(el?.className).toContain("wash-accent");
    expect(el?.className).toContain("grid");
  });
  it("defaults to a responsive auto-fit template", () => {
    const { container } = render(<BentoGrid>x</BentoGrid>);
    expect(container.firstElementChild?.className).toContain("auto-fit");
  });
  it("switches to an explicit column count", () => {
    const { container } = render(<BentoGrid columns={3}>x</BentoGrid>);
    const el = container.firstElementChild as HTMLElement;
    expect(el.style.gridTemplateColumns).toContain("repeat(3");
    expect(el.className).not.toContain("auto-fit");
  });
  it("applies column and row spans on a cell", () => {
    const { container } = render(
      <BentoGrid>
        <BentoCard span={2} rowSpan={3}>
          cell
        </BentoCard>
      </BentoGrid>,
    );
    const cell = container.querySelector(
      "[style*='grid-column']",
    ) as HTMLElement;
    expect(cell.style.gridColumn).toBe("span 2");
    expect(cell.style.gridRow).toBe("span 3");
  });
  it("uses a translucent surface so the shared wash reads through", () => {
    const { container } = render(
      <BentoGrid>
        <BentoCard>cell</BentoCard>
      </BentoGrid>,
    );
    const cell = container.querySelector("[data-bento-card]");
    expect(cell?.className).toContain("bg-surface/70");
  });
  it("passes the highlight vocabulary through to the Card", () => {
    const { container } = render(
      <BentoGrid>
        <BentoCard highlight="ring">cell</BentoCard>
      </BentoGrid>,
    );
    expect(container.querySelector("[data-highlight='ring']")).not.toBeNull();
  });
  it("has no a11y violations", async () => {
    const { container } = render(
      <BentoGrid columns={2}>
        <BentoCard span={2}>
          <p>Tile one</p>
        </BentoCard>
        <BentoCard>
          <p>Tile two</p>
        </BentoCard>
      </BentoGrid>,
    );
    expect(await axe(container)).toHaveNoViolations();
    expect(screen.getByText("Tile one")).toBeInTheDocument();
  });
});

describe("Bento cells", () => {
  it("BentoMetric renders a value and a labelled pill", () => {
    render(<BentoMetric value="2.4k" label="active users" />);
    expect(screen.getByText("2.4k")).toBeInTheDocument();
    expect(screen.getByText("active users")).toBeInTheDocument();
  });

  it("BentoMetric renders the value with tabular figures", () => {
    render(<BentoMetric value="2.4k" label="users" />);
    expect(screen.getByText("2.4k").className).toContain("tabular-nums");
  });

  it("BentoMetric renders a suffix keyed to the alternate accent", () => {
    render(<BentoMetric value="98" suffix="%" label="uptime" />);
    const suffix = screen.getByText("%");
    expect(suffix).toBeInTheDocument();
    expect(suffix.className).toContain("text-accent-alt");
  });

  it("BentoMetric omits the suffix element when no suffix is given", () => {
    const { container } = render(<BentoMetric value="98" label="uptime" />);
    expect(container.querySelector(".text-accent-alt")).toBeNull();
  });

  it("BentoMetric size lg carries the heavier display weight", () => {
    render(<BentoMetric size="lg" value="12" label="shipped" />);
    const value = screen.getByText("12");
    expect(value.className).toContain("font-black");
    expect(value.className).not.toContain("text-ink/70");
  });

  it("BentoMetric defaults to the md weight", () => {
    render(<BentoMetric value="12" label="shipped" />);
    const value = screen.getByText("12");
    expect(value.className).toContain("font-bold");
    expect(value.className).toContain("text-ink/70");
  });

  it("BentoMetric keeps the label pill on one line", () => {
    render(<BentoMetric value="2.4" label="active users" />);
    const pill = screen.getByText("active users");
    expect(pill.className).toContain("whitespace-nowrap");
  });

  it("BentoMetric renders a note under the value", () => {
    render(<BentoMetric value="41" label="repos" note="9 of them abandoned" />);
    expect(screen.getByText("9 of them abandoned")).toBeInTheDocument();
  });

  it("BentoMetric omits the note element when no note is given", () => {
    const { container } = render(<BentoMetric value="41" label="repos" />);
    expect(container.querySelector("p + p")).toBeNull();
  });

  it("BentoMetric pins the label to the bottom at every size", () => {
    for (const size of ["md", "lg"] as const) {
      const { container } = render(
        <BentoMetric size={size} value="41" label="repos" />,
      );
      expect(container.firstElementChild?.className).toContain(
        "justify-between",
      );
    }
  });
});

describe("BentoMetric count-up", () => {
  it("lands on the target value", async () => {
    render(<BentoMetric animate value={2.4} label="users" />);
    expect(await screen.findByText("2.4")).toBeInTheDocument();
  });

  it("preserves the decimal places of the target", async () => {
    render(<BentoMetric animate value={99.9} label="uptime" />);
    expect(await screen.findByText("99.9")).toBeInTheDocument();
  });

  it("counts integers without inventing decimals", async () => {
    render(<BentoMetric animate value={30} label="students" />);
    expect(await screen.findByText("30")).toBeInTheDocument();
  });

  it("renders a non-numeric value verbatim rather than counting it", () => {
    render(<BentoMetric animate value="n/a" label="unknown" />);
    expect(screen.getByText("n/a")).toBeInTheDocument();
  });

  it("jumps straight to the target when motion is reduced", () => {
    const original = window.matchMedia;
    window.matchMedia = ((query: string) => ({
      matches: query.includes("prefers-reduced-motion"),
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    })) as unknown as typeof window.matchMedia;

    render(<BentoMetric animate value={2.4} label="users" />);
    expect(screen.getByText("2.4")).toBeInTheDocument();

    window.matchMedia = original;
  });

  it("does not animate unless asked", () => {
    render(<BentoMetric value={2.4} label="users" />);
    expect(screen.getByText("2.4")).toBeInTheDocument();
  });

  /** A throttled or background tab delivers no frame. Zero forever is worse than static. */
  it("snaps to the target when no animation frame ever arrives", () => {
    vi.useFakeTimers();
    const raf = vi
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation(() => 1);

    render(<BentoMetric animate value={2.4} label="users" />);
    expect(screen.getByText("0.0")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1200);
    });
    expect(screen.getByText("2.4")).toBeInTheDocument();

    raf.mockRestore();
    vi.useRealTimers();
  });

  it("skips the count entirely while the document is hidden", () => {
    const hidden = vi
      .spyOn(document, "hidden", "get")
      .mockReturnValue(true as unknown as boolean);

    render(<BentoMetric animate value={2.4} label="users" />);
    expect(screen.getByText("2.4")).toBeInTheDocument();

    hidden.mockRestore();
  });

  it("BentoInfo takes arbitrary children rather than a tech-stack variant", () => {
    render(
      <BentoInfo label="Stack">
        <span>React</span>
        <span>Tailwind</span>
      </BentoInfo>,
    );
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Tailwind")).toBeInTheDocument();
  });

  it("BentoText renders a heading and an optional body", () => {
    render(<BentoText title="The problem" body="Students could not see it." />);
    expect(
      screen.getByRole("heading", { name: "The problem" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Students could not see it.")).toBeInTheDocument();
  });

  it("BentoText omits the label block when no label is given", () => {
    const { container } = render(<BentoText title="Bare" />);
    expect(container.querySelector(".font-mono")).toBeNull();
  });

  it("cells accept an icon as a node slot", () => {
    render(
      <BentoInfo label="Role" icon={<svg aria-hidden="true" role="none" />}>
        Sole engineer
      </BentoInfo>,
    );
    expect(screen.getByText("Sole engineer")).toBeInTheDocument();
  });

  it("has no a11y violations inside a grid", async () => {
    const { container } = render(
      <BentoGrid columns={4}>
        <BentoCard span={2}>
          <BentoText
            label="Problem"
            title="Unseen degree"
            body="A long tail."
          />
        </BentoCard>
        <BentoCard>
          <BentoMetric value="2.4k" label="active users" />
        </BentoCard>
        <BentoCard>
          <BentoInfo label="Role">Sole designer</BentoInfo>
        </BentoCard>
      </BentoGrid>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
