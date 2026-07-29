"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "usva/cn";
import {
  byLayer,
  INTENSITY_BY_LAYER,
  type Intensity,
  LAYER_LABEL,
  type Layer,
} from "../lib/catalog";

type Props = { orientation?: "vertical" | "horizontal" };

type Item = {
  href: string;
  label: string;
  child?: boolean;
  /** Leaves the site, so it renders as an anchor and carries the arrow. */
  external?: boolean;
};

type Group = {
  key: string;
  label: string;
  intensity: Intensity;
  // The catalog count, which is not items.length: sub-exports get a row but
  // are not catalog entries of their own.
  count: number;
  items: Item[];
  note?: string;
};

const GET_STARTED: Item[] = [
  { href: "/docs/get-started", label: "introduction" },
  { href: "/docs/get-started/installation", label: "installation" },
  { href: "/docs/get-started/theming", label: "theming" },
  { href: "/docs/get-started/for-agents", label: "for agents" },
  { href: "/docs/components", label: "the index" },
  {
    href: "https://storybook.usva.build",
    label: "storybook",
    external: true,
  },
];

const SUB_EXPORTS: Record<string, Item[]> = {
  avatar: [
    {
      href: "/docs/components/avatar-group",
      label: "avatar-group",
      child: true,
    },
  ],
  "bento-grid": [
    { href: "/docs/components/bento-card", label: "bento-card", child: true },
    { href: "/docs/components/bento-info", label: "bento-info", child: true },
    {
      href: "/docs/components/bento-metric",
      label: "bento-metric",
      child: true,
    },
    { href: "/docs/components/bento-text", label: "bento-text", child: true },
  ],
  card: [
    {
      href: "/docs/components/glow-card",
      label: "glow-card",
      child: true,
    },
  ],
  radio: [
    { href: "/docs/components/radio-group", label: "radio-group", child: true },
  ],
  skeleton: [
    {
      href: "/docs/components/skeleton-group",
      label: "skeleton-group",
      child: true,
    },
    {
      href: "/docs/components/skeleton-mirror",
      label: "skeleton-mirror",
      child: true,
    },
  ],
  spinner: [
    { href: "/docs/components/page-loader", label: "page-loader", child: true },
  ],
  toast: [{ href: "/docs/components/toaster", label: "toaster", child: true }],
  reveal: [
    {
      href: "/docs/components/reveal-group",
      label: "reveal-group",
      child: true,
    },
  ],
};

const layerItems = (layer: Layer): Item[] =>
  byLayer(layer).flatMap((entry) => [
    { href: `/docs/components/${entry.slug}`, label: entry.slug },
    ...(SUB_EXPORTS[entry.slug] ?? []),
  ]);

const layerGroup = (layer: Layer): Group => ({
  key: layer,
  label: LAYER_LABEL[layer],
  intensity: INTENSITY_BY_LAYER[layer],
  count: byLayer(layer).length,
  items: layerItems(layer),
});

const componentGroups = (): Group[] => [
  layerGroup("primitive"),
  layerGroup("pattern"),
  layerGroup("motion"),
  layerGroup("sula"),
  layerGroup("atmosphere"),
];

function GroupHeader({ group }: { group: Group }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <span className="whitespace-nowrap font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted">
          {group.label}
        </span>
        <span className="font-mono text-[0.65rem] text-muted tabular-nums">
          {group.count}
        </span>
        <span className="hairline-accent h-px flex-1" />
      </div>
      <span className="font-mono text-[0.6rem] uppercase tracking-[0.16em] text-accent/70">
        {group.intensity}
      </span>
    </div>
  );
}

function Row({ item, active }: { item: Item; active: boolean }) {
  const className = cn(
    "flex items-center gap-1.5 border-l border-border py-1.5 pr-3 text-sm",
    "transition-[color,background-color,border-color] duration-150 ease-soft",
    "outline-none focus-visible:ring-focus",
    item.child ? "pl-6" : "pl-3",
    active
      ? "border-accent bg-surface-2 text-ink"
      : "text-muted hover:border-muted hover:bg-surface hover:text-ink",
  );

  if (item.external) {
    return (
      <li>
        <a
          href={item.href}
          target="_blank"
          rel="noreferrer"
          className={className}
        >
          {item.label}
          <span aria-hidden="true" className="text-faint">
            ↗
          </span>
        </a>
      </li>
    );
  }

  return (
    <li>
      <Link
        href={item.href}
        aria-current={active ? "page" : undefined}
        className={className}
      >
        {item.child && (
          <span aria-hidden="true" className="font-mono text-xs text-faint">
            ↳
          </span>
        )}
        {item.label}
      </Link>
    </li>
  );
}

export function ComponentNav({ orientation = "vertical" }: Props) {
  const pathname = usePathname();
  const groups = componentGroups();

  if (orientation === "horizontal") {
    const items = [...GET_STARTED, ...groups.flatMap((g) => g.items)];
    return (
      <nav
        aria-label="Documentation"
        className="flex gap-2 overflow-x-auto pb-1"
      >
        {items.map((item) => {
          const chipClass = cn(
            "shrink-0 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm",
            "outline-none transition-colors duration-150 ease-soft focus-visible:ring-focus",
            pathname === item.href
              ? "bg-surface-2 text-ink glow-accent"
              : "text-muted hover:bg-surface hover:text-ink",
          );
          return item.external ? (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className={chipClass}
            >
              {item.label} <span aria-hidden="true">↗</span>
            </a>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              className={chipClass}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <nav aria-label="Documentation" className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-muted">
            get started
          </span>
          <span className="hairline-accent h-px flex-1" />
        </div>
        <ul className="flex flex-col">
          {GET_STARTED.map((item) => (
            <Row key={item.href} item={item} active={pathname === item.href} />
          ))}
        </ul>
      </div>

      {groups.map((group) => (
        <div key={group.key} className="flex flex-col gap-2">
          <GroupHeader group={group} />
          <ul className="flex flex-col">
            {group.items.map((item) => (
              <Row
                key={item.href}
                item={item}
                active={pathname === item.href}
              />
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
