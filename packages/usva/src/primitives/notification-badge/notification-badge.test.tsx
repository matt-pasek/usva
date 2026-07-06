import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { NotificationBadge } from "./notification-badge.js";

describe("NotificationBadge", () => {
  it("shows the count over its child", () => {
    render(
      <NotificationBadge count={3}>
        <button type="button">Inbox</button>
      </NotificationBadge>,
    );
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Inbox" })).toBeInTheDocument();
  });

  it("caps overflow at max with a plus", () => {
    render(
      <NotificationBadge count={42} max={9}>
        <span>bell</span>
      </NotificationBadge>,
    );
    expect(screen.getByText("9+")).toBeInTheDocument();
  });

  it("hides at zero unless showZero", () => {
    const { rerender } = render(
      <NotificationBadge count={0}>
        <span>bell</span>
      </NotificationBadge>,
    );
    expect(screen.queryByText("0")).not.toBeInTheDocument();
    rerender(
      <NotificationBadge count={0} showZero>
        <span>bell</span>
      </NotificationBadge>,
    );
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <NotificationBadge count={5}>
        <button type="button" aria-label="Notifications">
          <svg viewBox="0 0 4 4" aria-hidden="true">
            <circle cx="2" cy="2" r="2" />
          </svg>
        </button>
      </NotificationBadge>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
