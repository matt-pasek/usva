"use client";

import { Input } from "@matt-pasek/usva";
import * as React from "react";
import {
  motion,
  RefusalChip,
  useShake,
} from "@/components/design-language/refusal";

interface Rule {
  test: (value: string) => boolean;
  message: string;
}

const RULES: Rule[] = [
  {
    test: (v) => /[—–]/.test(v),
    message: "em dash. refused. use a colon or a full stop.",
  },
  {
    test: (v) => /\p{Extended_Pictographic}/u.test(v),
    message: "emoji. refused. the glyphs are the punctuation here: → ↗ ·",
  },
  {
    test: (v) => /\b[A-Z][a-z]/.test(v),
    message: "a Capital letter. refused. usva writes low, in lowercase.",
  },
  {
    test: (v) => /!/.test(v),
    message: "refused. usva states a thing; it does not shout it.",
  },
];

function firstViolation(value: string): string | null {
  if (value.trim().length === 0) return null;
  for (const rule of RULES) {
    if (rule.test(value)) return rule.message;
  }
  return null;
}

export function VoiceRefusalInput() {
  const [value, setValue] = React.useState("");
  const { controls, shake } = useShake();
  const violation = firstViolation(value);
  const clean = value.trim().length > 0 && violation === null;

  const previous = React.useRef<string | null>(null);
  React.useEffect(() => {
    if (violation && violation !== previous.current) shake();
    previous.current = violation;
  }, [violation, shake]);

  return (
    <div className="flex flex-col gap-3">
      <motion.div animate={controls}>
        <Input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          spellCheck={false}
          aria-invalid={violation ? true : undefined}
          aria-label="write a line the way you would ship it"
          placeholder="write a line the way you would ship it"
          className={
            clean ? "border-accent/60 focus-visible:border-accent" : undefined
          }
        />
      </motion.div>
      <div aria-live="polite" className="min-h-7">
        {violation ? (
          <RefusalChip>{violation}</RefusalChip>
        ) : clean ? (
          <span className="font-mono text-accent-ink text-xs">
            ✓ that reads like usva.
          </span>
        ) : (
          <span className="text-muted text-xs">
            try an em dash, an emoji, an exclamation mark, or a Capital letter.
          </span>
        )}
      </div>
    </div>
  );
}
