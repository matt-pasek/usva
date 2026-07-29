import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { Label } from "./label.js";

describe("Label", () => {
  it("associates with a control via htmlFor", () => {
    render(
      <>
        <Label htmlFor="name">Name</Label>
        <input id="name" />
      </>,
    );
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
  });

  it("reflects disabled styling", () => {
    render(<Label disabled>Locked</Label>);
    expect(screen.getByText("Locked").className).toContain("text-muted");
  });

  it("uses mono font when requested", () => {
    render(<Label mono>Token</Label>);
    expect(screen.getByText("Token").className).toContain("font-mono");
  });

  it("no a11y violations", async () => {
    const { container } = render(
      <>
        <Label htmlFor="email">Email</Label>
        <input id="email" />
      </>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
