"use client";
import {
  Badge,
  Button,
  EntityActions,
  EntityBody,
  EntityCard,
  EntityContent,
  EntityIndex,
  EntityMedia,
  EntityMeta,
  EntityTitle,
} from "@matt-pasek/usva";
import { Playground } from "@/components/docs/playground";

const VARIANTS = ["stack", "row", "showcase"] as const;

type Config = {
  variant: (typeof VARIANTS)[number];
  interactive: boolean;
  media: boolean;
  actions: boolean;
  title: string;
  body: string;
};

const base: Config = {
  variant: "stack",
  interactive: false,
  media: true,
  actions: true,
  title: "Aurora tokens",
  body: "A layered token pipeline that emits Tailwind v4 and DTCG from one source of truth.",
};

const templates: Record<string, Config> = {
  tile: base,
  "list row": {
    ...base,
    variant: "row",
    interactive: true,
    title: "Discrete Mathematics",
    body: "MA-140 · 4 cr · a compact row that keeps media, meta, and title in one line-up.",
  },
  showcase: {
    ...base,
    variant: "showcase",
    interactive: true,
    media: false,
    title: "jAIn 2.0",
    body: "Solo frontend developer on an AI-powered HR platform: architecture, design system, and every user-facing feature.",
  },
  "text only": {
    ...base,
    media: false,
    title: "Designing with fog",
    body: "Six lessons on building beauty that stays usable across two brand poles.",
  },
};

const mediaGradient =
  '<div className="h-full w-full [background:linear-gradient(135deg,color-mix(in_srgb,var(--color-accent)_30%,transparent),transparent)]" />';

const indent = (block: string, pad: string): string =>
  block
    .split("\n")
    .map((line) => (line ? pad + line : line))
    .join("\n");

const snippetFor = (c: Config): string => {
  const showcase = c.variant === "showcase";
  const rootAttrs = [
    c.variant !== "stack" && `variant="${c.variant}"`,
    c.interactive && "interactive",
  ]
    .filter(Boolean)
    .join(" ");

  const media = c.media
    ? `<EntityMedia>\n  ${mediaGradient}\n</EntityMedia>`
    : "";

  const meta = showcase
    ? `<EntityMeta>\n  <EntityIndex>001</EntityIndex>\n  <Badge tone="accent" mono>Frontend</Badge>\n</EntityMeta>`
    : `<EntityMeta>\n  <Badge tone="accent">Project</Badge>\n</EntityMeta>`;

  const actions = c.actions
    ? `<EntityActions>\n  <Button size="sm">Open</Button>\n</EntityActions>`
    : "";

  const textParts = [
    meta,
    `<EntityTitle>${c.title}</EntityTitle>`,
    `<EntityBody>${c.body}</EntityBody>`,
    actions,
  ]
    .filter(Boolean)
    .join("\n");

  const wrapped =
    c.variant === "stack"
      ? textParts
      : `<EntityContent>\n${indent(textParts, "  ")}\n</EntityContent>`;

  const inner = [c.media && !showcase ? media : "", wrapped]
    .filter(Boolean)
    .join("\n");

  return `<EntityCard${rootAttrs ? ` ${rootAttrs}` : ""}>
${indent(inner, "  ")}
</EntityCard>`;
};

export function EntityCardDemo() {
  return (
    <Playground<Config>
      templates={templates}
      stageClassName="mx-auto w-full max-w-md"
      fields={[
        {
          kind: "select",
          key: "variant",
          label: "variant",
          sub: "stack tile, row list, showcase card",
          options: VARIANTS,
        },
        {
          kind: "switch",
          key: "interactive",
          label: "interactive",
          sub: "hover lift and title arrow",
        },
        {
          kind: "switch",
          key: "media",
          label: "media",
          sub: "the cover panel",
        },
        {
          kind: "switch",
          key: "actions",
          label: "actions",
          sub: "the button row",
        },
        {
          kind: "text",
          key: "title",
          label: "title",
          sub: "the h3 heading",
        },
        {
          kind: "text",
          key: "body",
          label: "body",
          sub: "the description",
        },
      ]}
      snippet={snippetFor}
      render={(c) => {
        const showcase = c.variant === "showcase";
        const media = c.media && !showcase && (
          <EntityMedia>
            <div className="h-full w-full [background:linear-gradient(135deg,color-mix(in_srgb,var(--color-accent)_30%,transparent),transparent)]" />
          </EntityMedia>
        );
        const textParts = (
          <>
            <EntityMeta>
              {showcase && <EntityIndex>001</EntityIndex>}
              <Badge tone="accent" mono={showcase}>
                {showcase ? "Frontend" : "Project"}
              </Badge>
            </EntityMeta>
            <EntityTitle>{c.title}</EntityTitle>
            <EntityBody>{c.body}</EntityBody>
            {c.actions && (
              <EntityActions>
                <Button size="sm">Open</Button>
              </EntityActions>
            )}
          </>
        );
        return (
          <EntityCard
            key={c.variant}
            variant={c.variant}
            interactive={c.interactive}
          >
            {media}
            {c.variant === "stack" ? (
              textParts
            ) : (
              <EntityContent>{textParts}</EntityContent>
            )}
          </EntityCard>
        );
      }}
    />
  );
}
