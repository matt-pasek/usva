"use client";
import {
  CardBody,
  CardEyebrow,
  CardHeader,
  CardTitle,
  GlowCard,
} from "@matt-pasek/usva/primitives/card";
import { Playground } from "@/components/docs/playground";

const SURFACES = ["elevated", "flat", "glass", "outline"] as const;

type Config = {
  surface: (typeof SURFACES)[number];
  eyebrow: string;
  title: string;
};

const base: Config = {
  surface: "elevated",
  eyebrow: "interactive",
  title: "hover near the edges",
};

const templates: Record<string, Config> = {
  default: base,
  "on glass": { ...base, surface: "glass" },
  outline: { ...base, surface: "outline" },
};

const snippetFor = (c: Config): string => {
  const attrs = c.surface !== "elevated" ? ` surface="${c.surface}"` : "";
  return `import { CardBody, CardEyebrow, CardHeader, CardTitle, GlowCard } from "@matt-pasek/usva/primitives/card";

<GlowCard${attrs}>
  <CardHeader>
    <CardEyebrow>${c.eyebrow}</CardEyebrow>
    <CardTitle>${c.title}</CardTitle>
  </CardHeader>
  <CardBody>Move your cursor toward the border.</CardBody>
</GlowCard>`;
};

export function GlowCardDemo() {
  return (
    <Playground<Config>
      templates={templates}
      note="the lit arc turns to follow the pointer"
      fields={[
        {
          kind: "select",
          key: "surface",
          label: "surface",
          sub: "shares Card's surface scale",
          options: SURFACES,
        },
        { kind: "text", key: "eyebrow", label: "eyebrow", sub: "mono label" },
        { kind: "text", key: "title", label: "title", sub: "the card heading" },
      ]}
      snippet={snippetFor}
      render={(c) => (
        <div className="mx-auto max-w-md">
          <GlowCard surface={c.surface}>
            <CardHeader>
              <CardEyebrow>{c.eyebrow}</CardEyebrow>
              <CardTitle>{c.title}</CardTitle>
            </CardHeader>
            <CardBody>
              <p className="text-sm text-muted">
                Move your cursor toward the border. The lit arc turns to follow
                the pointer.
              </p>
            </CardBody>
          </GlowCard>
        </div>
      )}
    />
  );
}
