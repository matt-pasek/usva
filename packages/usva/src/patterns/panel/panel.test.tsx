import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { Panel } from "./panel.js";

describe("Panel", () => {
  it("renders title, eyebrow and body", () => {
    render(
      <Panel eyebrow="overview" title="Deployments">
        <p>body content</p>
      </Panel>,
    );
    expect(screen.getByText("overview")).toBeInTheDocument();
    expect(screen.getByText("Deployments")).toBeInTheDocument();
    expect(screen.getByText("body content")).toBeInTheDocument();
  });

  it("shows a loader and hides the body while loading", () => {
    render(
      <Panel title="Loading" loading>
        <p>should be hidden</p>
      </Panel>,
    );
    expect(screen.queryByText("should be hidden")).not.toBeInTheDocument();
  });

  it("renders badge and actions", () => {
    render(
      <Panel
        title="With slots"
        badge={<span>live</span>}
        actions={<button type="button">refresh</button>}
      />,
    );
    expect(screen.getByText("live")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "refresh" })).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <Panel eyebrow="status" title="System">
        <p>All green.</p>
      </Panel>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
