"use client";
import { Pullquote } from "@matt-pasek/usva";
import { Playground } from "@/components/docs/playground";

type Config = {
  quote: string;
  attribution: string;
  ornament: boolean;
};

const base: Config = {
  quote: "Beauty that stays usable.",
  attribution: "usva, design principles",
  ornament: false,
};

const templates: Record<string, Config> = {
  attributed: { ...base },
  bare: { ...base, attribution: "" },
  ornamented: { ...base, ornament: true },
  manifesto: {
    quote: "Every name is a phenomenon, never an object.",
    attribution: "usva, naming",
    ornament: false,
  },
};

const ORNAMENT =
  '<div className="size-full rounded-full bg-accent-tint [filter:drop-shadow(var(--usva-glow-accent))]" />';

const snippetFor = (c: Config): string => {
  const attrs = [
    c.attribution && `attribution="${c.attribution}"`,
    c.ornament && "ornament={" + ORNAMENT + "}",
  ]
    .filter(Boolean)
    .join("\n  ");
  return `import { Pullquote } from "@matt-pasek/usva";

<Pullquote${attrs ? `\n  ${attrs}\n` : ""}>${attrs ? "  " : ""}${c.quote}${attrs ? "\n" : ""}</Pullquote>`;
};

export function PullquoteDemo() {
  return (
    <Playground<Config>
      templates={templates}
      fields={[
        {
          kind: "text",
          key: "quote",
          label: "children",
          sub: "the quote itself",
        },
        {
          kind: "text",
          key: "attribution",
          label: "attribution",
          sub: "empty leaves a bare blockquote",
        },
        {
          kind: "switch",
          key: "ornament",
          label: "ornament",
          sub: "decorative flourish in the 80px slot",
        },
      ]}
      snippet={snippetFor}
      render={(c) => (
        <Pullquote
          attribution={c.attribution || undefined}
          ornament={
            c.ornament ? (
              <div className="size-full rounded-full bg-accent-tint [filter:drop-shadow(var(--usva-glow-accent))]" />
            ) : undefined
          }
        >
          {c.quote}
        </Pullquote>
      )}
    />
  );
}
