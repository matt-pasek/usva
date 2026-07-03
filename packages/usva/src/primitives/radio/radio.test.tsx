import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it, vi } from "vitest";
import { Radio, RadioGroup } from "./radio.js";

describe("Radio + RadioGroup", () => {
  it("selecting a radio updates the group value", async () => {
    const onValueChange = vi.fn();
    render(
      <RadioGroup name="plan" onValueChange={onValueChange}>
        <Radio value="a" label="A" />
        <Radio value="b" label="B" />
      </RadioGroup>,
    );
    await userEvent.click(screen.getByRole("radio", { name: "B" }));
    expect(onValueChange.mock.calls[0]?.[0]).toBe("b");
  });

  it("supports uncontrolled defaultValue", () => {
    render(
      <RadioGroup name="plan" defaultValue="b">
        <Radio value="a" label="A" />
        <Radio value="b" label="B" />
      </RadioGroup>,
    );
    expect(screen.getByRole("radio", { name: "B" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  it("supports controlled value", async () => {
    const onValueChange = vi.fn();
    render(
      <RadioGroup name="plan" value="a" onValueChange={onValueChange}>
        <Radio value="a" label="A" />
        <Radio value="b" label="B" />
      </RadioGroup>,
    );
    const b = screen.getByRole("radio", { name: "B" });
    expect(b).toHaveAttribute("aria-checked", "false");
    await userEvent.click(b);
    expect(onValueChange.mock.calls[0]?.[0]).toBe("b");
    expect(b).toHaveAttribute("aria-checked", "false");
  });

  it("supports disabled radio", () => {
    render(
      <RadioGroup name="plan">
        <Radio value="a" label="A" disabled />
      </RadioGroup>,
    );
    expect(screen.getByRole("radio", { name: "A" })).toHaveAttribute(
      "aria-disabled",
      "true",
    );
  });

  it("renders description text", () => {
    render(
      <RadioGroup name="plan">
        <Radio value="a" label="A" description="Choose plan A" />
      </RadioGroup>,
    );
    expect(screen.getByText("Choose plan A")).toBeInTheDocument();
  });

  it("announces horizontal orientation via aria-orientation", () => {
    render(
      <RadioGroup name="plan" orientation="horizontal" aria-label="Plan">
        <Radio value="a" label="A" />
        <Radio value="b" label="B" />
      </RadioGroup>,
    );
    expect(screen.getByRole("radiogroup")).toHaveAttribute(
      "aria-orientation",
      "horizontal",
    );
  });

  it("no a11y violations", async () => {
    const { container } = render(
      <RadioGroup name="plan" aria-label="Plan">
        <Radio value="a" label="A" />
        <Radio value="b" label="B" />
      </RadioGroup>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
