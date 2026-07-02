import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./button.js";

describe("Button", () => {
  it("renders children and fires onClick", async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Go</Button>);
    await userEvent.click(screen.getByRole("button", { name: "Go" }));
    expect(onClick).toHaveBeenCalledOnce();
  });
  it("applies variant classes", () => {
    render(<Button variant="ghost">x</Button>);
    expect(screen.getByRole("button").className).toContain("bg-transparent");
  });
  it("has no a11y violations", async () => {
    const { container } = render(<Button>ok</Button>);
    expect(await axe(container)).toHaveNoViolations();
  });
});
