import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Input } from "./input.js";

describe("Input", () => {
  it("accepts typing (uncontrolled)", async () => {
    render(<Input aria-label="name" />);
    const el = screen.getByLabelText("name");
    await userEvent.type(el, "hi");
    expect(el).toHaveValue("hi");
  });
  it("reflects invalid state", () => {
    render(<Input aria-label="x" aria-invalid />);
    expect(screen.getByLabelText("x").className).toContain(
      "aria-invalid:border-danger",
    );
  });
});
