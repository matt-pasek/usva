"use client";
import { PageLoader } from "usva/primitives/spinner";
import { Playground } from "@/components/docs/playground";

const VARIANTS = ["ring", "dots", "bars", "orbit"] as const;
const SIZES = ["sm", "md", "lg"] as const;
const TONES = ["accent", "current"] as const;

type Config = {
  label: string;
  variant: (typeof VARIANTS)[number];
  size: (typeof SIZES)[number];
  tone: (typeof TONES)[number];
};

const base: Config = {
  label: "loading your dashboard",
  variant: "ring",
  size: "lg",
  tone: "accent",
};

const templates: Record<string, Config> = {
  route: { ...base },
  quiet: { ...base, label: "", variant: "dots", size: "md" },
  "in a panel": { ...base, label: "fetching", size: "sm", tone: "current" },
  orbit: { ...base, variant: "orbit" },
};

const snippetFor = (c: Config): string => {
  const attrs = [
    c.label && `label="${c.label}"`,
    c.variant !== "ring" && `variant="${c.variant}"`,
    c.size !== "lg" && `size="${c.size}"`,
    c.tone !== "accent" && `tone="${c.tone}"`,
  ]
    .filter(Boolean)
    .join(" ");
  return `import { PageLoader } from "usva/primitives/spinner";

<PageLoader${attrs ? ` ${attrs}` : ""} />`;
};

export function PageLoaderDemo() {
  return (
    <Playground<Config>
      templates={templates}
      stageClassName="w-full"
      fields={[
        {
          kind: "text",
          key: "label",
          label: "label",
          sub: "what is being waited on",
        },
        {
          kind: "select",
          key: "variant",
          label: "variant",
          sub: "the spinner it centres",
          options: VARIANTS,
        },
        {
          kind: "select",
          key: "size",
          label: "size",
          sub: "spinner scale",
          options: SIZES,
        },
        {
          kind: "select",
          key: "tone",
          label: "tone",
          sub: "accent, or inherit the ink",
          options: TONES,
        },
      ]}
      snippet={snippetFor}
      render={(c) => (
        <PageLoader
          label={c.label || undefined}
          variant={c.variant}
          size={c.size}
          tone={c.tone}
        />
      )}
    />
  );
}
