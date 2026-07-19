"use client";
import hljs from "highlight.js/lib/common";
import typescript from "highlight.js/lib/languages/typescript";
import * as React from "react";
import { cn } from "../../cn.js";
import { Button } from "../button/button.js";

hljs.registerLanguage("tsx", typescript);

/** Any grammar in highlight.js's common set, or "plain" to skip highlighting. */
export type CodeSnippetLanguage = "plain" | (string & {});

export interface CodeSnippetProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** The code, verbatim. Also what the copy button writes to the clipboard. */
  code: string;
  language?: CodeSnippetLanguage;
  /** Header caption, e.g. "usage" or a file path. No label, no header bar. */
  label?: React.ReactNode;
  /** Right side of the header bar. */
  note?: React.ReactNode;
  copyable?: boolean;
  /** Extra classes for the scrolling pre, e.g. a max-height cap. */
  preClassName?: string;
}

export function useCopyToClipboard(value: string) {
  const [copied, setCopied] = React.useState(false);
  const timer = React.useRef(0);

  React.useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* A denied clipboard is not worth a dialog: the text is right there to
       * select by hand, and the button simply does not confirm. */
    }
  }, [value]);

  return { copied, copy };
}

const CopyIcon = () => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-3.5"
    aria-hidden="true"
  >
    <rect x="5.5" y="5.5" width="8" height="8" rx="1.5" />
    <path d="M10.5 3.5A1.5 1.5 0 0 0 9 2H4a2 2 0 0 0-2 2v5a1.5 1.5 0 0 0 1.5 1.5" />
  </svg>
);

const CheckIcon = () => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-3.5"
    aria-hidden="true"
  >
    <path d="m3 8.5 3.5 3.5L13 4.5" />
  </svg>
);

export function CopySnippetButton({
  value,
  label = "copy the snippet",
}: {
  value: string;
  label?: string;
}) {
  const { copied, copy } = useCopyToClipboard(value);

  return (
    <Button
      type="button"
      variant="outline"
      iconOnly
      size="sm"
      active={copied}
      onClick={copy}
      aria-label={copied ? "copied" : label}
      tooltip={copied ? "copied" : "copy"}
      className="shrink-0"
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
    </Button>
  );
}

export const CodeSnippet = React.forwardRef<HTMLDivElement, CodeSnippetProps>(
  (
    {
      code,
      language = "tsx",
      label,
      note,
      copyable = true,
      preClassName,
      className,
      ...rest
    },
    ref,
  ) => {
    const html = React.useMemo(
      () =>
        language !== "plain" && hljs.getLanguage(language)
          ? hljs.highlight(code, { language }).value
          : null,
      [code, language],
    );

    const body = (
      <pre
        className={cn(
          "hljs overflow-x-auto p-4 font-mono text-[0.76rem] leading-[1.7] text-on-sunken",
          preClassName,
        )}
      >
        {html === null ? (
          <code>{code}</code>
        ) : (
          <code
            // Output of highlight.js over the caller's own code string.
            // biome-ignore lint/security/noDangerouslySetInnerHtml: see above
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
      </pre>
    );

    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-xl border border-border bg-sunken/70",
          className,
        )}
        {...rest}
      >
        {label != null ? (
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-border bg-surface px-4 py-2">
            <span className="font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-muted">
              {label}
            </span>
            <span className="flex items-center gap-3">
              {note != null && (
                <span className="font-mono text-[0.7rem] text-muted">
                  {note}
                </span>
              )}
              {copyable && <CopySnippetButton value={code} />}
            </span>
          </div>
        ) : (
          copyable && (
            <span className="absolute right-2 top-2 z-10">
              <CopySnippetButton value={code} />
            </span>
          )
        )}
        {body}
      </div>
    );
  },
);
CodeSnippet.displayName = "CodeSnippet";
