import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Badge } from "./badge.js";

describe("Badge", () => {
  it("renders text", () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText("New")).toBeInTheDocument();
  });
  it("applies tone", () => {
    render(<Badge tone="success">ok</Badge>);
    expect(screen.getByText("ok").className).toContain("text-success");
  });
});
