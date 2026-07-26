"use client";
import { Avatar, AvatarGroup } from "@matt-pasek/usva/primitives/avatar";
import { Playground } from "@/components/docs/playground";

const SIZES = ["sm", "md", "lg"] as const;
const TONES = ["neutral", "solid", "accent"] as const;

const people = [
  { alt: "Ada", fallback: "AL" },
  { alt: "Blaise", fallback: "BP" },
  { alt: "Curie", fallback: "MC" },
  { alt: "Dijkstra", fallback: "ED" },
  { alt: "Euler", fallback: "LE" },
  { alt: "Fermat", fallback: "PF" },
];

type Config = {
  max: number;
  size: (typeof SIZES)[number];
  tone: (typeof TONES)[number];
  label: string;
};

const base: Config = {
  max: 4,
  size: "md",
  tone: "neutral",
  label: "+128 students",
};

const templates: Record<string, Config> = {
  "social proof": base,
  compact: { ...base, size: "sm", max: 3 },
  "tinted cluster": {
    ...base,
    size: "sm",
    max: 3,
    tone: "accent",
    label: "25+ active users",
  },
};

const snippetFor = (c: Config): string => {
  const attrs = [
    c.max < people.length && `max={${c.max}}`,
    c.size !== "md" && `size="${c.size}"`,
    c.tone !== "neutral" && `tone="${c.tone}"`,
    c.label && `label="${c.label}"`,
  ]
    .filter(Boolean)
    .join(" ");
  const tone = c.tone !== "neutral" ? ` tone="${c.tone}"` : "";
  const size = c.size !== "md" ? ` size="${c.size}"` : "";
  return `import { Avatar, AvatarGroup } from "@matt-pasek/usva/primitives/avatar";

<AvatarGroup ${attrs}>
  <Avatar${size}${tone} alt="Ada" fallback="AL" />
  <Avatar${size}${tone} alt="Blaise" fallback="BP" />
  <Avatar${size}${tone} alt="Curie" fallback="MC" />
</AvatarGroup>`;
};

export function AvatarGroupDemo() {
  return (
    <Playground<Config>
      templates={templates}
      fields={[
        {
          kind: "slider",
          key: "max",
          label: "max",
          sub: "visible faces before +N",
          min: 1,
          max: people.length,
          step: 1,
        },
        {
          kind: "select",
          key: "size",
          label: "size",
          sub: "overlap and +N chip size",
          options: SIZES,
        },
        {
          kind: "select",
          key: "tone",
          label: "tone",
          sub: "colours the +N chip and faces",
          options: TONES,
        },
        {
          kind: "text",
          key: "label",
          label: "label",
          sub: "the caption after the stack",
        },
      ]}
      snippet={snippetFor}
      render={(c) => (
        <AvatarGroup
          key={`${c.size}-${c.tone}`}
          max={c.max}
          size={c.size}
          tone={c.tone}
          label={c.label}
        >
          {people.map((person) => (
            <Avatar
              key={person.alt}
              size={c.size}
              tone={c.tone}
              alt={person.alt}
              fallback={person.fallback}
            />
          ))}
        </AvatarGroup>
      )}
    />
  );
}
