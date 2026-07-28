import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CodeSnippet } from "./code-snippet/code-snippet.js";
import { LogLine } from "./log-line/log-line.js";
import { Terminal } from "./terminal/terminal.js";

describe("scrollable regions are keyboard reachable", () => {
  it("CodeSnippet exposes its pre as a focus stop", () => {
    const { container } = render(<CodeSnippet code="const a = 1;" />);
    const pre = container.querySelector("pre");
    expect(pre).toHaveClass("overflow-x-auto");
    expect(pre).toHaveAttribute("tabindex", "0");
  });

  it("Terminal exposes its command line as a focus stop", () => {
    const { container } = render(<Terminal command="bun add usva" />);
    const code = container.querySelector("code");
    expect(code).toHaveClass("overflow-x-auto");
    expect(code).toHaveAttribute("tabindex", "0");
  });

  it("LogLine exposes its details payload as a focus stop", () => {
    const { container } = render(
      <LogLine level="error" details={"at foo\n  at bar"}>
        request failed
      </LogLine>,
    );
    const payload = container.querySelector(".overflow-x-auto");
    expect(payload).not.toBeNull();
    expect(payload).toHaveAttribute("tabindex", "0");
  });
});
