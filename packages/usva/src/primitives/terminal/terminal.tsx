"use client";
import * as React from "react";
import { cn } from "../../cn.js";
import { CopySnippetButton } from "../code-snippet/code-snippet.js";

export interface TerminalProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** The command, without the prompt. Also what the copy button copies. */
  command: string;
  prompt?: string;
  copyable?: boolean;
  /** Runs after the clipboard write succeeds, never on a denied one. */
  onCopied?: (value: string) => void;
}

/* Scoped packages and URLs are what the eye scans a command for. Unscoped
   package names have no such marker, so an install verb makes the words after
   it hot too, which is the only way `bun add usva` reads like `bun add @scope/x`. */
const INSTALL_VERBS = new Set(["add", "install", "i"]);
const isHot = (word: string) => word.startsWith("@") || /^https?:/.test(word);

export const Terminal = React.forwardRef<HTMLDivElement, TerminalProps>(
  (
    { command, prompt = "$", copyable = true, onCopied, className, ...rest },
    ref,
  ) => {
    const words: { text: string; hot: boolean; at: number }[] = [];
    let at = 0;
    let installing = false;
    for (const text of command.split(" ")) {
      words.push({
        text,
        hot: isHot(text) || (installing && !text.startsWith("-")),
        at,
      });
      if (INSTALL_VERBS.has(text)) installing = true;
      at += text.length + 1;
    }

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-between gap-2 rounded-lg border border-border bg-sunken px-3 py-2",
          className,
        )}
        {...rest}
      >
        <code
          // A scrolling region has to be reachable by keyboard (WCAG 2.1.1), which
          // is the documented exception to this rule.
          // biome-ignore lint/a11y/noNoninteractiveTabindex: see above
          tabIndex={0}
          className="overflow-x-auto whitespace-nowrap font-mono text-[0.74rem] text-on-sunken outline-none focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-border-strong/60 [&::-webkit-scrollbar-track]:bg-transparent"
        >
          <span aria-hidden="true" className="text-faint">
            {prompt}{" "}
          </span>
          {words.map((word) => (
            <React.Fragment key={word.at}>
              {word.at > 0 ? " " : ""}
              {word.hot ? (
                <span className="text-accent-alt">{word.text}</span>
              ) : (
                word.text
              )}
            </React.Fragment>
          ))}
        </code>
        {copyable && (
          <CopySnippetButton
            value={command}
            label="copy the command"
            onCopied={onCopied}
          />
        )}
      </div>
    );
  },
);
Terminal.displayName = "Terminal";
