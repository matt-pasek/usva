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
}

/* Scoped packages and URLs are what the eye scans a command for. */
const isHot = (word: string) => word.startsWith("@") || /^https?:/.test(word);

export const Terminal = React.forwardRef<HTMLDivElement, TerminalProps>(
  ({ command, prompt = "$", copyable = true, className, ...rest }, ref) => {
    const words: { text: string; hot: boolean; at: number }[] = [];
    let at = 0;
    for (const text of command.split(" ")) {
      words.push({ text, hot: isHot(text), at });
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
        <code className="overflow-x-auto whitespace-nowrap font-mono text-[0.74rem] text-on-sunken">
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
          <CopySnippetButton value={command} label="copy the command" />
        )}
      </div>
    );
  },
);
Terminal.displayName = "Terminal";
