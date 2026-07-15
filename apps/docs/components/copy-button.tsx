"use client";
import { IconButton } from "@matt-pasek/usva";
import { useEffect, useRef, useState } from "react";

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
    <title>{""}</title>
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
    <title>{""}</title>
    <path d="m3 8.5 3.5 3.5L13 4.5" />
  </svg>
);

export interface CopyButtonProps {
  value: string;
  label?: string;
}

export function CopyButton({
  value,
  label = "copy the command",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* A denied clipboard is not worth a dialog: the command is right there to
       * select by hand, and the button simply does not confirm. */
    }
  };

  return (
    <IconButton
      type="button"
      size="sm"
      active={copied}
      onClick={copy}
      aria-label={copied ? "copied" : label}
      tooltip={copied ? "copied" : "copy"}
      className="shrink-0"
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
    </IconButton>
  );
}
