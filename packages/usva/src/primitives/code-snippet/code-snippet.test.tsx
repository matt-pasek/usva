import { fireEvent, render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CodeSnippet } from "./code-snippet.js";

const CODE = `import { Button } from "@matt-pasek/usva";`;

describe("CodeSnippet", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the code", () => {
    render(<CodeSnippet code={CODE} />);
    expect(screen.getByText(/@matt-pasek\/usva/)).toBeInTheDocument();
  });

  it("highlights tokens for a known language", () => {
    const { container } = render(<CodeSnippet code={CODE} language="tsx" />);
    expect(container.querySelector(".hljs-keyword")).not.toBeNull();
    expect(container.querySelector(".hljs-string")).not.toBeNull();
  });

  it("renders plain text without token spans", () => {
    const { container } = render(<CodeSnippet code={CODE} language="plain" />);
    expect(container.querySelector('[class*="hljs-"]')).toBeNull();
  });

  it("shows the header bar when labelled", () => {
    render(<CodeSnippet code={CODE} label="usage" note="one shape" />);
    expect(screen.getByText("usage")).toBeInTheDocument();
    expect(screen.getByText("one shape")).toBeInTheDocument();
  });

  it("copies the raw code to the clipboard", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { ...navigator, clipboard: { writeText } });

    render(<CodeSnippet code={CODE} label="usage" />);
    fireEvent.click(screen.getByRole("button", { name: "copy the snippet" }));
    expect(writeText).toHaveBeenCalledWith(CODE);
  });

  it("omits the copy button when not copyable", () => {
    render(<CodeSnippet code={CODE} copyable={false} />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("no a11y violations", async () => {
    const { container } = render(
      <CodeSnippet code={CODE} label="usage" note="reflects nothing" />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
