"use client";
import { HeroSplit } from "@usva-ui/react/patterns/hero-split";
import { Avatar, AvatarGroup } from "@usva-ui/react/primitives/avatar";
import { Button } from "@usva-ui/react/primitives/button";
import { Playground } from "@/components/docs/playground";

type Config = {
  title: string;
  titleAccent: string;
  accentColor: string;
  body: string;
  note: string;
  badge: boolean;
  actions: boolean;
  proof: boolean;
  visual: boolean;
};

const DEFAULT_ACCENT = "#52c989";

const base: Config = {
  title: "Your whole degree,",
  titleAccent: "in one place.",
  accentColor: DEFAULT_ACCENT,
  body: "Four registries reconciled into one planner. Nothing to configure.",
  note: "",
  badge: false,
  actions: true,
  proof: true,
  visual: true,
};

const templates: Record<string, Config> = {
  "full landing": base,
  "copy only": {
    ...base,
    body: "One planner, four registries, zero setup.",
    proof: false,
    visual: false,
  },
  "keyed accent": {
    ...base,
    accentColor: "#7c5cff",
    proof: false,
    note: "Free while in beta.",
  },
  minimal: {
    ...base,
    titleAccent: "",
    body: "",
    proof: false,
    visual: false,
  },
};

const visual = (
  <div className="flex aspect-[4/3] w-full items-center justify-center rounded-2xl bg-ink/[0.04] text-sm text-muted">
    product shot
  </div>
);

const badgeNode = (
  <span className="rounded-full bg-ink/[0.06] px-3 py-1 text-xs font-semibold text-muted">
    Now in beta
  </span>
);

const actionsNode = (
  <>
    <Button>Add to Chrome</Button>
    <Button variant="onSurface">Source code</Button>
  </>
);

const proofNode = (
  <AvatarGroup max={3} tone="accent" label="2,400 active users">
    <Avatar alt="Mateusz Pasek" />
    <Avatar alt="Anna Korhonen" />
    <Avatar alt="Jussi Laine" />
    <Avatar alt="Liisa Virtanen" />
  </AvatarGroup>
);

const indent = (block: string): string =>
  block
    .split("\n")
    .map((line) => `  ${line}`)
    .join("\n");

const snippetFor = (c: Config): string => {
  const lines: string[] = [`  title="${c.title}"`];
  if (c.titleAccent) lines.push(`  titleAccent="${c.titleAccent}"`);
  if (c.accentColor && c.accentColor !== DEFAULT_ACCENT)
    lines.push(`  accentColor="${c.accentColor}"`);
  if (c.badge)
    lines.push(`  badge={<Badge tone="accent-alt">Now in beta</Badge>}`);
  if (c.body) lines.push(`  body="${c.body}"`);
  if (c.note) lines.push(`  note="${c.note}"`);
  if (c.actions)
    lines.push(
      indent(`actions={
  <>
    <Button>Add to Chrome</Button>
    <Button variant="onSurface">Source code</Button>
  </>
}`),
    );
  if (c.proof)
    lines.push(
      indent(`proof={
  <AvatarGroup max={3} tone="accent" label="2,400 active users">
    <Avatar alt="Mateusz Pasek" />
    <Avatar alt="Anna Korhonen" />
    <Avatar alt="Jussi Laine" />
  </AvatarGroup>
}`),
    );
  if (c.visual)
    lines.push(
      `  visual={<MockupShowcase>{/* screenshot */}</MockupShowcase>}`,
    );

  return `import { HeroSplit } from "@usva-ui/react/patterns/hero-split";
import { MockupShowcase } from "@usva-ui/react/patterns/mockup-showcase";
import { Avatar, AvatarGroup } from "@usva-ui/react/primitives/avatar";
import { Badge } from "@usva-ui/react/primitives/badge";
import { Button } from "@usva-ui/react/primitives/button";

<HeroSplit
${lines.join("\n")}
/>`;
};

export function HeroSplitDemo() {
  return (
    <Playground<Config>
      templates={templates}
      stageClassName="w-full"
      fields={[
        { kind: "text", key: "title", label: "title", sub: "the headline" },
        {
          kind: "text",
          key: "titleAccent",
          label: "titleAccent",
          sub: "second phrase, carries the accent color",
        },
        {
          kind: "color",
          key: "accentColor",
          label: "accentColor",
          sub: "keyed to the product, defaults to accent-alt",
        },
        { kind: "text", key: "body", label: "body", sub: "the lede" },
        {
          kind: "text",
          key: "note",
          label: "note",
          sub: "small print under the copy",
        },
        {
          kind: "switch",
          key: "badge",
          label: "badge",
          sub: "pill above the title",
        },
        {
          kind: "switch",
          key: "actions",
          label: "actions",
          sub: "the call to action row",
        },
        {
          kind: "switch",
          key: "proof",
          label: "proof",
          sub: "an avatar group as social proof",
        },
        {
          kind: "switch",
          key: "visual",
          label: "visual",
          sub: "the product shot beside the copy",
        },
      ]}
      snippet={snippetFor}
      render={(c) => (
        <HeroSplit
          className="px-0 py-4 sm:px-0"
          headingLevel="h2"
          title={c.title}
          titleAccent={c.titleAccent || undefined}
          accentColor={c.accentColor || undefined}
          body={c.body || undefined}
          note={c.note || undefined}
          badge={c.badge ? badgeNode : undefined}
          actions={c.actions ? actionsNode : undefined}
          proof={c.proof ? proofNode : undefined}
          visual={c.visual ? visual : undefined}
        />
      )}
    />
  );
}
