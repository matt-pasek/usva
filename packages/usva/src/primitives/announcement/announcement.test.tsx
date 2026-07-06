import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { Announcement } from "./announcement.js";

describe("Announcement", () => {
  it("renders the badge and the label", () => {
    render(<Announcement badge="NEW">v2.0.1 just shipped</Announcement>);
    expect(screen.getByText("NEW")).toBeInTheDocument();
    expect(screen.getByText("v2.0.1 just shipped")).toBeInTheDocument();
  });

  it("renders as a span by default", () => {
    render(<Announcement badge="NEW">shipped</Announcement>);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("renders as a link when href is set", () => {
    render(
      <Announcement badge="NEW" href="/changelog">
        shipped
      </Announcement>,
    );
    expect(screen.getByRole("link")).toHaveAttribute("href", "/changelog");
  });

  it("applies the tone to the badge", () => {
    render(
      <Announcement badge="BETA" tone="warning">
        preview
      </Announcement>,
    );
    expect(screen.getByText("BETA").className).toContain("bg-warning");
  });

  it("has no a11y violations as a link", async () => {
    const { container } = render(
      <Announcement badge="NEW" href="/changelog">
        v2.0.1 just shipped
      </Announcement>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
