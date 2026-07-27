import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { axe } from "jest-axe";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Terminal } from "./terminal.js";

const COMMAND = "bun add @matt-pasek/usva";

describe("Terminal", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders the command with a prompt", () => {
    render(<Terminal command={COMMAND} />);
    expect(screen.getByText("$")).toBeInTheDocument();
    expect(screen.getByText("@matt-pasek/usva")).toBeInTheDocument();
  });

  it("accents scoped packages and urls", () => {
    render(
      <Terminal command="npx shadcn add https://usva.dev/r/button.json" />,
    );
    expect(screen.getByText("https://usva.dev/r/button.json")).toHaveClass(
      "text-accent-alt",
    );
  });

  it("copies the command without the prompt", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { ...navigator, clipboard: { writeText } });

    render(<Terminal command={COMMAND} />);
    fireEvent.click(screen.getByRole("button", { name: "copy the command" }));
    expect(writeText).toHaveBeenCalledWith(COMMAND);
  });

  it("calls onCopied with the command", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { ...navigator, clipboard: { writeText } });
    const onCopied = vi.fn();

    render(<Terminal command={COMMAND} onCopied={onCopied} />);
    fireEvent.click(screen.getByRole("button", { name: "copy the command" }));
    await waitFor(() => expect(onCopied).toHaveBeenCalledWith(COMMAND));
  });

  it("supports a custom prompt and no copy button", () => {
    render(<Terminal command="ls" prompt=">" copyable={false} />);
    expect(screen.getByText(">")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("no a11y violations", async () => {
    const { container } = render(<Terminal command={COMMAND} />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
