import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";
import { Avatar } from "./avatar.js";
import { AvatarGroup } from "./avatar-group.js";

describe("AvatarGroup", () => {
  it("renders its avatars", () => {
    render(
      <AvatarGroup>
        <Avatar alt="Ada" fallback="A" />
        <Avatar alt="Blaise" fallback="B" />
      </AvatarGroup>,
    );
    expect(screen.getByText("A")).toBeInTheDocument();
    expect(screen.getByText("B")).toBeInTheDocument();
  });

  it("collapses overflow into a +N chip", () => {
    render(
      <AvatarGroup max={2}>
        <Avatar alt="A" fallback="A" />
        <Avatar alt="B" fallback="B" />
        <Avatar alt="C" fallback="C" />
        <Avatar alt="D" fallback="D" />
      </AvatarGroup>,
    );
    expect(screen.getByText("+2")).toBeInTheDocument();
  });

  it("renders a caption label", () => {
    render(
      <AvatarGroup label="+128 students">
        <Avatar alt="A" fallback="A" />
      </AvatarGroup>,
    );
    expect(screen.getByText("+128 students")).toBeInTheDocument();
  });

  it("has no a11y violations", async () => {
    const { container } = render(
      <AvatarGroup max={2} label="trusted by teams">
        <Avatar alt="Ada" fallback="A" />
        <Avatar alt="Blaise" fallback="B" />
        <Avatar alt="Curie" fallback="C" />
      </AvatarGroup>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
