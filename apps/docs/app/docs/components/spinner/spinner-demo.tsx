"use client";
import { Spinner } from "@usva-ui/react/primitives/spinner";
import { Playground } from "@/components/docs/playground";

const VARIANTS = ["ring", "dots", "bars", "orbit"] as const;
const SIZES = ["sm", "md", "lg"] as const;
const TONES = ["accent", "current"] as const;

type Config = {
  variant: (typeof VARIANTS)[number];
  size: (typeof SIZES)[number];
  tone: (typeof TONES)[number];
  label: string;
};

const base: Config = {
  variant: "ring",
  size: "md",
  tone: "accent",
  label: "Loading",
};

const templates: Record<string, Config> = {
  default: base,
  "inline dots": { ...base, variant: "dots", size: "sm" },
  "on a filled button": { ...base, size: "sm", tone: "current" },
  loud: { ...base, variant: "orbit", size: "lg", label: "Loading workspace" },
};

const snippetFor = (c: Config): string => {
  const attrs = [
    c.variant !== "ring" && `variant="${c.variant}"`,
    c.size !== "md" && `size="${c.size}"`,
    c.tone !== "accent" && `tone="${c.tone}"`,
    c.label !== "Loading" && `label="${c.label}"`,
  ]
    .filter(Boolean)
    .join(" ");
  return `import { Spinner } from "@usva-ui/react/primitives/spinner";

<Spinner${attrs ? ` ${attrs}` : ""} />`;
};

export function SpinnerDemo() {
  return (
    <Playground<Config>
      templates={templates}
      fields={[
        {
          kind: "select",
          key: "variant",
          label: "variant",
          sub: "animation style",
          options: VARIANTS,
        },
        {
          kind: "select",
          key: "size",
          label: "size",
          sub: "diameter and stroke weight",
          options: SIZES,
        },
        {
          kind: "select",
          key: "tone",
          label: "tone",
          sub: "current drops the glow, inherits text colour",
          options: TONES,
        },
        {
          kind: "text",
          key: "label",
          label: "label",
          sub: "screen reader text",
        },
      ]}
      snippet={snippetFor}
      render={(c) => (
        <Spinner
          variant={c.variant}
          size={c.size}
          tone={c.tone}
          label={c.label}
        />
      )}
    />
  );
}
