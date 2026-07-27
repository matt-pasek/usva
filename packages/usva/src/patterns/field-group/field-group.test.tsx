import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import {
  FieldControl,
  FieldCount,
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

describe("FieldCount", () => {
  it("reads the limit off the control", () => {
    render(
      <FieldGroup>
        <FieldLabel>Bio</FieldLabel>
        <FieldControl>
          <textarea maxLength={280} />
        </FieldControl>
        <FieldCount />
      </FieldGroup>,
    );
    expect(screen.getByText("0 / 280")).toBeInTheDocument();
  });

  it("counts an uncontrolled defaultValue", () => {
    render(
      <FieldGroup>
        <FieldLabel>Bio</FieldLabel>
        <FieldControl>
          <textarea maxLength={280} defaultValue="hello" />
        </FieldControl>
        <FieldCount />
      </FieldGroup>,
    );
    expect(screen.getByText("5 / 280")).toBeInTheDocument();
  });

  it("tracks typing without owning the value", async () => {
    render(
      <FieldGroup>
        <FieldLabel>Bio</FieldLabel>
        <FieldControl>
          <textarea maxLength={280} />
        </FieldControl>
        <FieldCount />
      </FieldGroup>,
    );
    await userEvent.type(screen.getByLabelText("Bio"), "hey");
    expect(screen.getByLabelText("Bio")).toHaveValue("hey");
    expect(screen.getByText("3 / 280")).toBeInTheDocument();
  });

  it("reflects a controlled value changing from outside", () => {
    const { rerender } = render(
      <FieldGroup>
        <FieldLabel>Bio</FieldLabel>
        <FieldControl>
          <textarea maxLength={280} value="ab" onChange={() => {}} />
        </FieldControl>
        <FieldCount />
      </FieldGroup>,
    );
    expect(screen.getByText("2 / 280")).toBeInTheDocument();

    rerender(
      <FieldGroup>
        <FieldLabel>Bio</FieldLabel>
        <FieldControl>
          <textarea maxLength={280} value="abcd" onChange={() => {}} />
        </FieldControl>
        <FieldCount />
      </FieldGroup>,
    );
    expect(screen.getByText("4 / 280")).toBeInTheDocument();
  });

  it("drops the limit when the control has none", () => {
    render(
      <FieldGroup>
        <FieldLabel>Bio</FieldLabel>
        <FieldControl>
          <textarea defaultValue="hello" />
        </FieldControl>
        <FieldCount />
      </FieldGroup>,
    );
    expect(screen.getByText("5")).toBeInTheDocument();
  });

  it("turns danger once the value is over the limit", () => {
    render(
      <FieldGroup>
        <FieldLabel>Bio</FieldLabel>
        <FieldControl>
          <textarea maxLength={3} value="abcde" onChange={() => {}} />
        </FieldControl>
        <FieldCount />
      </FieldGroup>,
    );
    expect(screen.getByText("5 / 3").className).toContain("text-danger");
  });

  it("stays muted while within the limit", () => {
    render(
      <FieldGroup>
        <FieldLabel>Bio</FieldLabel>
        <FieldControl>
          <textarea maxLength={280} defaultValue="hello" />
        </FieldControl>
        <FieldCount />
      </FieldGroup>,
    );
    expect(screen.getByText("5 / 280").className).toContain("text-muted");
  });
});
