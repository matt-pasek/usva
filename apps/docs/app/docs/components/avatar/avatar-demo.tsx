"use client";
import { Avatar } from "@matt-pasek/usva/primitives/avatar";
import { Playground } from "@/components/docs/playground";

const SIZES = ["sm", "md", "lg"] as const;
const TONES = ["solid", "accent", "neutral"] as const;
const STATUSES = ["none", "online", "away", "busy", "offline"] as const;

const PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" fill="#7c6fd6"/><circle cx="40" cy="32" r="16" fill="#f4f1ff"/><path d="M12 76c4-20 20-28 28-28s24 8 28 28" fill="#f4f1ff"/></svg>',
  );

type Config = {
  size: (typeof SIZES)[number];
  tone: (typeof TONES)[number];
  status: (typeof STATUSES)[number];
  image: boolean;
  alt: string;
  fallback: string;
};

const base: Config = {
  size: "md",
  tone: "solid",
  status: "none",
  image: true,
  alt: "Jane Doe",
  fallback: "JD",
};

const templates: Record<string, Config> = {
  "photo, online": { ...base, status: "online" },
  "initials fallback": { ...base, image: false, tone: "accent" },
  "neutral placeholder": {
    ...base,
    image: false,
    tone: "neutral",
    alt: "Ada Lovelace",
    fallback: "AL",
  },
  "large, busy": { ...base, size: "lg", status: "busy" },
};

const snippetFor = (c: Config): string => {
  const attrs = [
    c.image ? `src="/jane.png"` : null,
    `alt="${c.alt}"`,
    `fallback="${c.fallback}"`,
    c.size !== "md" && `size="${c.size}"`,
    c.tone !== "solid" && `tone="${c.tone}"`,
    c.status !== "none" && `status="${c.status}"`,
  ]
    .filter(Boolean)
    .join(" ");
  return `import { Avatar } from "@matt-pasek/usva/primitives/avatar";

<Avatar ${attrs} />`;
};

export function AvatarDemo() {
  return (
    <Playground<Config>
      templates={templates}
      fields={[
        {
          kind: "select",
          key: "size",
          label: "size",
          sub: "diameter and initials size",
          options: SIZES,
        },
        {
          kind: "select",
          key: "tone",
          label: "tone",
          sub: "fallback fill",
          options: TONES,
        },
        {
          kind: "select",
          key: "status",
          label: "status",
          sub: "presence dot in the corner",
          options: STATUSES,
        },
        {
          kind: "switch",
          key: "image",
          label: "image",
          sub: "off shows the fallback initials",
        },
        {
          kind: "text",
          key: "alt",
          label: "alt",
          sub: "the person's accessible name",
        },
        {
          kind: "text",
          key: "fallback",
          label: "fallback",
          sub: "initials shown without an image",
        },
      ]}
      snippet={snippetFor}
      render={(c) => (
        <Avatar
          src={c.image ? PLACEHOLDER : undefined}
          alt={c.alt}
          fallback={c.fallback}
          size={c.size}
          tone={c.tone}
          status={c.status === "none" ? undefined : c.status}
        />
      )}
    />
  );
}
