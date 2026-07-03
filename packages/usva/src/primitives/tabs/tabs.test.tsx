import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it, vi } from "vitest";
import { Tabs } from "./tabs.js";

function ThreeTabs() {
  return (
    <Tabs defaultValue="one">
      <Tabs.List>
        <Tabs.Tab value="one">One</Tabs.Tab>
        <Tabs.Tab value="two">Two</Tabs.Tab>
        <Tabs.Tab value="three">Three</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="one">Panel one content</Tabs.Panel>
      <Tabs.Panel value="two">Panel two content</Tabs.Panel>
      <Tabs.Panel value="three">Panel three content</Tabs.Panel>
    </Tabs>
  );
}

describe("Tabs", () => {
  it("clicking a tab shows its panel and hides the others", async () => {
    render(<ThreeTabs />);
    expect(screen.getByText("Panel one content")).toBeInTheDocument();
    expect(screen.queryByText("Panel two content")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("tab", { name: "Two" }));

    expect(screen.getByText("Panel two content")).toBeInTheDocument();
    expect(screen.queryByText("Panel one content")).not.toBeInTheDocument();
    expect(screen.queryByText("Panel three content")).not.toBeInTheDocument();
  });

  it("moves the active tab with ArrowRight (roving focus)", async () => {
    const onValueChange = vi.fn();
    render(
      <Tabs defaultValue="one" onValueChange={onValueChange}>
        <Tabs.List>
          <Tabs.Tab value="one">One</Tabs.Tab>
          <Tabs.Tab value="two">Two</Tabs.Tab>
          <Tabs.Tab value="three">Three</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="one">Panel one content</Tabs.Panel>
        <Tabs.Panel value="two">Panel two content</Tabs.Panel>
        <Tabs.Panel value="three">Panel three content</Tabs.Panel>
      </Tabs>,
    );

    await userEvent.tab();
    expect(screen.getByRole("tab", { name: "One" })).toHaveFocus();

    await userEvent.keyboard("{ArrowRight}");

    expect(screen.getByRole("tab", { name: "Two" })).toHaveFocus();
    expect(onValueChange.mock.calls[0]?.[0]).toBe("two");
    expect(screen.getByText("Panel two content")).toBeInTheDocument();
  });

  it("no a11y violations", async () => {
    const { container } = render(<ThreeTabs />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
