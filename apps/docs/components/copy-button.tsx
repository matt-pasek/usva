"use client";
import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "usva/primitives/button";

const CopyIcon = () => (
  <Copy className="size-3.5" strokeWidth={1.6} aria-hidden />
);

const CheckIcon = () => (
  <Check className="size-3.5" strokeWidth={1.6} aria-hidden />
);

export interface CopyButtonProps {
  value: string;
  label?: string;
}

export function useCopy(value: string) {
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

  return { copied, copy };
}

export { CheckIcon, CopyIcon };

export function CopyButton({
  value,
  label = "copy the command",
}: CopyButtonProps) {
  const { copied, copy } = useCopy(value);

  return (
    <Button
      variant="outline"
      iconOnly
      type="button"
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
