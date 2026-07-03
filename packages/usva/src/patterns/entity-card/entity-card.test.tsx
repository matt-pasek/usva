import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import {
  EntityActions,
  EntityBody,
  EntityCard,
  EntityMedia,
  EntityMeta,
  EntityTitle,
} from "./entity-card.js";

describe("EntityCard", () => {
  it("composes its parts", () => {
    render(
      <EntityCard>
        <EntityMedia>
          <img src="/x.png" alt="Cover" />
        </EntityMedia>
        <EntityMeta>meta</EntityMeta>
        <EntityTitle>Title</EntityTitle>
        <EntityBody>Body copy</EntityBody>
        <EntityActions>
          <button type="button">Go</button>
        </EntityActions>
      </EntityCard>,
    );
    expect(screen.getByRole("heading", { name: "Title" })).toBeInTheDocument();
    expect(screen.getByText("Body copy")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Cover" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Go" })).toBeInTheDocument();
  });

  it("carries the card surface look", () => {
    const { container } = render(<EntityCard>x</EntityCard>);
    const el = container.firstElementChild;
    expect(el?.className).toContain("bg-surface");
    expect(el?.className).toContain("rounded-2xl");
  });

  it("adds the hover-lift when interactive", () => {
    const { container } = render(<EntityCard interactive>x</EntityCard>);
    expect(container.firstElementChild?.className).toContain(
      "hover:-translate-y-0.5",
    );
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <EntityCard>
        <EntityMedia>
          <img src="/x.png" alt="Cover" />
        </EntityMedia>
        <EntityTitle>Title</EntityTitle>
        <EntityBody>Body copy</EntityBody>
        <EntityActions>
          <button type="button">Go</button>
        </EntityActions>
      </EntityCard>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
