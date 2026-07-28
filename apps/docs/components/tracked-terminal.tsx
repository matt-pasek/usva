"use client";
import type { ComponentProps } from "react";
import { Terminal } from "usva/primitives/terminal";
import type { CopyKind } from "@/lib/analytics/kinds";
import { trackCopy } from "@/lib/analytics/track-copy";

export interface TrackedTerminalProps extends ComponentProps<typeof Terminal> {
  kind: CopyKind;
  name: string;
}

export function TrackedTerminal({ kind, name, ...rest }: TrackedTerminalProps) {
  return <Terminal {...rest} onCopied={() => trackCopy(kind, name)} />;
}
