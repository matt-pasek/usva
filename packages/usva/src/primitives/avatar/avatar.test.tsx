import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { beforeAll, describe, expect, it } from "vitest";
import { Avatar } from "./avatar.js";

// jsdom never performs a real network fetch, so `<img>` load events never
// fire. Base UI's Avatar.Image only mounts once loading status is "loaded",
// which it derives synchronously from `image.complete`/`naturalWidth` right
// after the `src` setter runs. Simulating a resolved load there (instead of
// waiting on a real load event) keeps the test deterministic.
beforeAll(() => {
  Object.defineProperty(window.Image.prototype, "complete", {
    configurable: true,
    get() {
      return true;
    },
  });
  Object.defineProperty(window.Image.prototype, "naturalWidth", {
    configurable: true,
    get() {
      return 100;
    },
  });
});

describe("Avatar", () => {
  it("renders the image with src/alt when src is given", () => {
    render(<Avatar src="/avatar.png" alt="Jane Doe" fallback="JD" />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("src", "/avatar.png");
    expect(img).toHaveAttribute("alt", "Jane Doe");
  });

  it("renders fallback initials when no src is given", () => {
    render(<Avatar alt="Jane Doe" fallback="JD" />);
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("has no a11y violations with an image", async () => {
    const { container } = render(
      <Avatar src="/avatar.png" alt="Jane Doe" fallback="JD" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("has no a11y violations with fallback only", async () => {
    const { container } = render(<Avatar alt="Jane Doe" fallback="JD" />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
