import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { axe } from "jest-axe";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CodeSnippet, registerCodeLanguage } from "./code-snippet.js";

const CODE = `import { Button } from "usva";`;

describe("CodeSnippet", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the code", () => {
    render(<CodeSnippet code={CODE} />);
    expect(screen.getByText(/usva/)).toBeInTheDocument();
  });

  it("highlights tokens for a known language", () => {
    const { container } = render(<CodeSnippet code={CODE} language="tsx" />);
    expect(container.querySelector(".hljs-keyword")).not.toBeNull();
    expect(container.querySelector(".hljs-string")).not.toBeNull();
  });

  it.each([
    ["tsx", CODE],
    ["ts", CODE],
    ["typescript", CODE],
    ["jsx", CODE],
    ["js", CODE],
    ["json", `{ "name": "usva" }`],
    ["bash", '# install\necho "usva"'],
    ["css", ".usva { color: red; }"],
    ["html", "<p>usva</p>"],
    ["xml", "<p>usva</p>"],
    ["md", "# usva"],
  ])("bundles the %s grammar", (language, code) => {
    const { container } = render(
      <CodeSnippet code={code} language={language} />,
    );
    expect(container.querySelector('[class*="hljs-"]')).not.toBeNull();
  });

  it("highlights a grammar the consumer registers", async () => {
    const cpp = (await import("highlight.js/lib/languages/cpp")).default;
    registerCodeLanguage("cpp", cpp);

    const { container } = render(
      <CodeSnippet
        code={"#include <vector>\nint main() { return 0; }"}
        language="cpp"
      />,
    );
    expect(container.querySelector('[class*="hljs-"]')).not.toBeNull();
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

  it("calls onCopied with the copied value", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { ...navigator, clipboard: { writeText } });
    const onCopied = vi.fn();

    render(<CodeSnippet code={CODE} label="usage" onCopied={onCopied} />);
    fireEvent.click(screen.getByRole("button", { name: "copy the snippet" }));
    await waitFor(() => expect(onCopied).toHaveBeenCalledWith(CODE));
  });

  it("does not call onCopied when the clipboard is denied", async () => {
    const writeText = vi.fn().mockRejectedValue(new Error("denied"));
    vi.stubGlobal("navigator", { ...navigator, clipboard: { writeText } });
    const onCopied = vi.fn();

    render(<CodeSnippet code={CODE} label="usage" onCopied={onCopied} />);
    fireEvent.click(screen.getByRole("button", { name: "copy the snippet" }));
    await waitFor(() => expect(writeText).toHaveBeenCalled());
    expect(onCopied).not.toHaveBeenCalled();
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
