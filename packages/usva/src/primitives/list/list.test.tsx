import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { List, ListItem } from "./list.js";

function CheckIcon() {
  return <svg data-testid="check" aria-hidden="true" />;
}

describe("List", () => {
  it("renders an unordered list by default", () => {
    render(
      <List>
        <ListItem>Local only</ListItem>
      </List>,
    );
    const list = screen.getByRole("list");
    expect(list.tagName).toBe("UL");
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
  });

  it("renders an ordered list when asked", () => {
    render(
      <List as="ol">
        <ListItem>First</ListItem>
      </List>,
    );
    expect(screen.getByRole("list").tagName).toBe("OL");
  });

  it("renders a shared marker on every item", () => {
    render(
      <List marker={<CheckIcon />}>
        <ListItem>One</ListItem>
        <ListItem>Two</ListItem>
      </List>,
    );
    expect(screen.getAllByTestId("check")).toHaveLength(2);
  });

  it("lets an item override the shared marker", () => {
    render(
      <List marker={<CheckIcon />}>
        <ListItem marker={<svg data-testid="custom" aria-hidden="true" />}>
          One
        </ListItem>
      </List>,
    );
    expect(screen.getByTestId("custom")).toBeInTheDocument();
    expect(screen.queryByTestId("check")).not.toBeInTheDocument();
  });

  /** A marker is decoration. The text carries the meaning. */
  it("hides the marker from assistive tech", () => {
    const { container } = render(
      <List marker={<CheckIcon />}>
        <ListItem>One</ListItem>
      </List>,
    );
    expect(container.querySelector("[data-list-marker]")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });

  it("renders no marker slot when there is no marker", () => {
    const { container } = render(
      <List>
        <ListItem>One</ListItem>
      </List>,
    );
    expect(container.querySelector("[data-list-marker]")).toBeNull();
  });

  it("divides items with a rule that stops at the last one", () => {
    render(
      <List divided>
        <ListItem>One</ListItem>
      </List>,
    );
    const list = screen.getByRole("list");
    expect(list.className).toContain("[&>li]:border-b");
    expect(list.className).toContain("[&>li:last-child]:border-0");
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <List marker={<CheckIcon />} divided>
        <ListItem>Runs locally</ListItem>
        <ListItem>No tracking</ListItem>
      </List>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
