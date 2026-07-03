import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import {
  FieldControl,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "./field-group.js";

describe("FieldGroup", () => {
  it("connects label to control via generated id", () => {
    render(
      <FieldGroup>
        <FieldLabel>Name</FieldLabel>
        <FieldControl>
          <input />
        </FieldControl>
      </FieldGroup>,
    );
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
  });

  it("wires aria-describedby to description", () => {
    render(
      <FieldGroup>
        <FieldLabel>Name</FieldLabel>
        <FieldControl>
          <input />
        </FieldControl>
        <FieldDescription>Helper text</FieldDescription>
      </FieldGroup>,
    );
    const control = screen.getByLabelText("Name");
    const describedBy = control.getAttribute("aria-describedby");
    const description = screen.getByText("Helper text");
    expect(describedBy).toContain(description.id);
  });

  it("marks control invalid and describes the error when present", () => {
    render(
      <FieldGroup>
        <FieldLabel>Email</FieldLabel>
        <FieldControl>
          <input />
        </FieldControl>
        <FieldError>Required</FieldError>
      </FieldGroup>,
    );
    const control = screen.getByLabelText("Email");
    expect(control).toHaveAttribute("aria-invalid", "true");
    const error = screen.getByRole("alert");
    expect(control.getAttribute("aria-describedby")).toContain(error.id);
  });

  it("respects an explicit FieldGroup id", () => {
    render(
      <FieldGroup id="custom-field">
        <FieldLabel>Name</FieldLabel>
        <FieldControl>
          <input />
        </FieldControl>
      </FieldGroup>,
    );
    expect(screen.getByLabelText("Name")).toHaveAttribute("id", "custom-field");
  });

  it("does not mark control invalid without an error", () => {
    render(
      <FieldGroup>
        <FieldLabel>Name</FieldLabel>
        <FieldControl>
          <input />
        </FieldControl>
      </FieldGroup>,
    );
    expect(screen.getByLabelText("Name")).not.toHaveAttribute("aria-invalid");
  });

  it("no a11y violations", async () => {
    const { container } = render(
      <FieldGroup>
        <FieldLabel>Email</FieldLabel>
        <FieldControl>
          <input type="email" />
        </FieldControl>
        <FieldDescription>We never share it.</FieldDescription>
        <FieldError>Enter a valid email.</FieldError>
      </FieldGroup>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
