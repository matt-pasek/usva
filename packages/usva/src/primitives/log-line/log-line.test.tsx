import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { InlineError, LogLine, LogList } from "./log-line.js";

describe("LogLine", () => {
  it("renders the level, source and message", () => {
    render(
      <LogLine level="error" source="/api/courses">
        Failed to fetch
      </LogLine>,
    );
    expect(screen.getByText("error")).toBeInTheDocument();
    expect(screen.getByText("/api/courses")).toBeInTheDocument();
    expect(screen.getByText("Failed to fetch")).toBeInTheDocument();
  });

  it("collapses repeats into a count chip", () => {
    render(
      <LogLine level="warn" count={3}>
        Skipped rows
      </LogLine>,
    );
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("omits the count chip for a single occurrence", () => {
    const { container } = render(
      <LogLine level="warn" count={1}>
        Skipped rows
      </LogLine>,
    );
    expect(container.querySelector("[data-log-count]")).toBeNull();
  });

  it("renders a disclosure only when details are supplied", () => {
    const { container, rerender } = render(
      <LogLine level="error">Boom</LogLine>,
    );
    expect(container.querySelector("summary")).toBeNull();

    rerender(
      <LogLine level="error" details="at fetchCourses (api.ts:41)">
        Boom
      </LogLine>,
    );
    expect(container.querySelector("summary")).not.toBeNull();
    expect(screen.getByText("at fetchCourses (api.ts:41)")).toBeInTheDocument();
  });

  it("renders an optional timestamp", () => {
    render(
      <LogLine level="info" timestamp="14:22:07.412">
        Reconciled
      </LogLine>,
    );
    expect(screen.getByText("14:22:07.412")).toBeInTheDocument();
  });

  it("conveys the level as text, not colour alone", () => {
    render(<LogLine level="debug">hit ratio 0.94</LogLine>);
    expect(screen.getByText("debug")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <LogList>
        <LogLine level="error" source="/api/courses" count={3} details="stack">
          Failed to fetch
        </LogLine>
        <LogLine level="info" source="sync">
          Reconciled 128 records
        </LogLine>
      </LogList>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

describe("LogList", () => {
  it("is an announced log region", () => {
    render(
      <LogList>
        <LogLine level="info">Ready</LogLine>
      </LogList>,
    );
    const list = screen.getByRole("log");
    expect(list).toHaveAttribute("aria-live", "polite");
  });
});

describe("InlineError", () => {
  it("renders the error message and is announced as an alert", () => {
    render(
      <InlineError
        source="/api/courses"
        error={new Error("502 Bad Gateway")}
      />,
    );
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("502 Bad Gateway")).toBeInTheDocument();
    expect(screen.getByText("/api/courses")).toBeInTheDocument();
  });

  it("accepts a bare string", () => {
    render(<InlineError error="Token expired" />);
    expect(screen.getByText("Token expired")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <InlineError source="/api/courses" error={new Error("502")} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
