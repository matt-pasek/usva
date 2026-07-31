import { act, render, screen, waitFor } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { buildReveal } from "./presets.js";
import { Reveal, RevealGroup } from "./reveal.js";

describe("Reveal", () => {
  it("renders its children", () => {
    render(<Reveal>hello</Reveal>);
    expect(screen.getByText("hello")).toBeInTheDocument();
  });

  it("renders as the requested element", () => {
    render(
      <Reveal as="h2" variant="cast">
        heading
      </Reveal>,
    );
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "heading",
    );
  });

  it("passes through className and attributes", () => {
    render(
      <Reveal className="x" data-testid="r">
        c
      </Reveal>,
    );
    expect(screen.getByTestId("r")).toHaveClass("x");
  });

  it("renders children and keeps attributes when scrubbing", () => {
    render(
      <Reveal scrub className="s" data-testid="scrubbed">
        scrubbed content
      </Reveal>,
    );
    const el = screen.getByTestId("scrubbed");
    expect(el).toHaveTextContent("scrubbed content");
    expect(el).toHaveClass("s");
  });

  it("emits no filter when scrubbing a variant that never blurs", () => {
    render(
      <Reveal scrub variant="tick" data-testid="ticked">
        t
      </Reveal>,
    );
    expect(screen.getByTestId("ticked").style.filter).toBe("");
  });

  it("accepts a custom scrub window", () => {
    render(
      <Reveal scrub scrubOffset={["start 1", "end 0.5"]} data-testid="win">
        w
      </Reveal>,
    );
    expect(screen.getByTestId("win")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <Reveal as="section" aria-label="intro">
        <p>body</p>
      </Reveal>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("RevealGroup", () => {
  it("renders all children", () => {
    render(
      <RevealGroup>
        <span>a</span>
        <span>b</span>
      </RevealGroup>,
    );
    expect(screen.getByText("a")).toBeInTheDocument();
    expect(screen.getByText("b")).toBeInTheDocument();
  });

  it("shows its children once the group enters view", async () => {
    const callbacks: Array<(entries: unknown[]) => void> = [];
    const original = globalThis.IntersectionObserver;
    globalThis.IntersectionObserver = class {
      constructor(cb: (entries: unknown[]) => void) {
        callbacks.push(cb);
      }
      observe() {}
      unobserve() {}
      disconnect() {}
      takeRecords() {
        return [];
      }
    } as never;

    try {
      render(
        <RevealGroup force stagger={0}>
          <span>a</span>
          <span>b</span>
        </RevealGroup>,
      );
      const wrapper = screen.getByText("a").parentElement as HTMLElement;
      expect(wrapper.style.opacity).toBe("0");

      act(() => {
        for (const cb of callbacks) {
          cb([{ isIntersecting: true, intersectionRatio: 1 }]);
        }
      });

      await waitFor(() => {
        expect(wrapper.style.opacity).not.toBe("0");
      });
    } finally {
      globalThis.IntersectionObserver = original;
    }
  });
});

describe("buildReveal", () => {
  it("collapses to a crossfade under reduced motion", () => {
    const r = buildReveal("surface", 1, true);
    expect(r.initial).toEqual({ opacity: 0 });
    expect(r.animate).toEqual({ opacity: 1 });
  });

  it("scales distance and drops sub-2px blur by intensity", () => {
    const full = buildReveal("veil", 1, false);
    expect(full.initial.y).toBe(12);
    expect(full.initial.filter).toBe("blur(3.0px)");

    const quiet = buildReveal("veil", 0.45, false);
    expect(quiet.initial.y).toBeCloseTo(5.4);
    // 3 * 0.45 = 1.35px < 2px floor → no blur
    expect(quiet.initial.filter).toBeUndefined();
  });

  it("never blurs the tick (data) variant", () => {
    expect(buildReveal("tick", 1, false).initial.filter).toBeUndefined();
  });
});
