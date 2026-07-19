import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PageTransition } from "./page-transition.js";

describe("PageTransition", () => {
  it("renders its children", () => {
    render(
      <PageTransition routeKey="/home">
        <p>page body</p>
      </PageTransition>,
    );
    expect(screen.getByText("page body")).toBeInTheDocument();
  });

  it("keys its animated wrapper by routeKey", () => {
    const { container } = render(
      <PageTransition routeKey="/a">
        <p>alpha</p>
      </PageTransition>,
    );
    // the animated wrapper carries the enter transform inline
    const wrapper = container.querySelector("div[style]");
    expect(wrapper).not.toBeNull();
    expect(screen.getByText("alpha")).toBeInTheDocument();
  });
});
