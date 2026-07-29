"use client";
import { Badge } from "usva/primitives/badge";
import { Playground } from "@/components/docs/playground";

const TONES = [
  "neutral",
  "accent",
  "accent-alt",
  "success",
  "warning",
  "danger",
] as const;

type Config = {
  tone: (typeof TONES)[number];
  label: string;
  mono: boolean;
  live: boolean;
};

const base: Config = {
  tone: "neutral",
  label: "New",
  mono: false,
  live: false,
};

const templates: Record<string, Config> = {
  status: { ...base, tone: "success", label: "Passing" },
  "version tag": { ...base, tone: "accent-alt", label: "v1.0.0", mono: true },
  live: { ...base, label: "production", live: true, mono: true },
  warning: { ...base, tone: "warning", label: "Deprecated" },
};

const snippetFor = (c: Config): string => {
  const attrs = [
    c.live ? "live" : c.tone !== "neutral" && `tone="${c.tone}"`,
    c.mono && "mono",
  ]
    .filter(Boolean)
    .join(" ");
  return `import { Badge } from "usva/primitives/badge";

<Badge${attrs ? ` ${attrs}` : ""}>${c.label}</Badge>`;
};

export function BadgeDemo() {
  return (
    <Playground<Config>
      templates={templates}
      fields={[
        {
          kind: "select",
          key: "tone",
          label: "tone",
          sub: "semantic color role",
          options: TONES,
        },
        {
          kind: "text",
          key: "label",
          label: "label",
          sub: "the text inside",
        },
        {
          kind: "switch",
          key: "mono",
          label: "mono",
          sub: "uppercase tag for versions, keys",
        },
        {
          kind: "switch",
          key: "live",
          label: "live",
          sub: "pulsing green, overrides tone",
        },
      ]}
      snippet={snippetFor}
      render={(c) => (
        <Badge tone={c.tone} mono={c.mono} live={c.live}>
          {c.label}
        </Badge>
      )}
    />
  );
}
