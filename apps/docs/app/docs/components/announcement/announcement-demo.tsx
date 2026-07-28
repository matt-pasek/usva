"use client";
import { Announcement } from "usva/primitives/announcement";
import { Playground } from "@/components/docs/playground";

const TONES = [
  "live",
  "accent",
  "accent-alt",
  "success",
  "warning",
  "danger",
] as const;

type Config = {
  badge: string;
  label: string;
  tone: (typeof TONES)[number];
  asLink: boolean;
};

const base: Config = {
  badge: "NEW",
  label: "v2.0.1 just shipped",
  tone: "live",
  asLink: false,
};

const templates: Record<string, Config> = {
  release: { ...base, asLink: true },
  beta: { ...base, badge: "BETA", label: "Try the new editor", tone: "accent" },
  warning: {
    ...base,
    badge: "SOON",
    label: "Pricing update incoming",
    tone: "warning",
  },
};

const HREF = "/changelog";

const snippetFor = (c: Config): string => {
  const attrs = [
    `badge="${c.badge}"`,
    c.tone !== "live" && `tone="${c.tone}"`,
    c.asLink && `href="${HREF}"`,
  ]
    .filter(Boolean)
    .join(" ");
  return `import { Announcement } from "usva/primitives/announcement";

<Announcement ${attrs}>${c.label}</Announcement>`;
};

export function AnnouncementDemo() {
  return (
    <Playground<Config>
      templates={templates}
      fields={[
        {
          kind: "text",
          key: "badge",
          label: "badge",
          sub: "solid leading badge, one word",
        },
        {
          kind: "text",
          key: "label",
          label: "label",
          sub: "the text after the badge",
        },
        {
          kind: "select",
          key: "tone",
          label: "tone",
          sub: "color of the leading badge",
          options: TONES,
        },
        {
          kind: "switch",
          key: "asLink",
          label: "href",
          sub: "render a link with a trailing arrow",
        },
      ]}
      snippet={snippetFor}
      render={(c) =>
        c.asLink ? (
          <Announcement badge={c.badge} tone={c.tone} href={HREF}>
            {c.label}
          </Announcement>
        ) : (
          <Announcement badge={c.badge} tone={c.tone}>
            {c.label}
          </Announcement>
        )
      }
    />
  );
}
