"use client";
import { cn } from "@matt-pasek/usva/cn";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  byLayer,
  INTENSITY_BY_LAYER,
  type Intensity,
  LAYER_LABEL,
  type Layer,
} from "../lib/catalog";

type Props = { orientation?: "vertical" | "horizontal" };

type Item = { href: string; label: string; child?: boolean };

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
  { href: "/docs/get-started/index", label: "index" },
];

// AvatarGroup is a sub-export of avatar with no directory of its own, so the
// catalog has no entry for it. Its docs page is real, so it hangs off avatar.
const SUB_EXPORTS: Record<string, Item[]> = {
  avatar: [
    {
      href: "/docs/components/avatar-group",
      label: "avatar-group",
      child: true,
    },
  ],
};

const MOTION_ITEMS: Item[] = [
  { href: "/docs/components/reveal", label: "reveal" },
  { href: "/docs/components/page-transition", label: "page-transition" },
];

const LAYERS: Layer[] = ["primitive", "pattern", "sula"];

const layerItems = (layer: Layer): Item[] =>
  byLayer(layer).flatMap((entry) => [
    { href: `/docs/components/${entry.slug}`, label: entry.slug },
    ...(SUB_EXPORTS[entry.slug] ?? []),
  ]);

const componentGroups = (): Group[] => [
  ...LAYERS.map((layer) => ({
    key: layer,
    label: LAYER_LABEL[layer],
    intensity: INTENSITY_BY_LAYER[layer],
    count: byLayer(layer).length,
    items: layerItems(layer),
  })),
  {
    key: "motion",
    // reveal and page-transition are utilities, not one of the four layers.
    // They recede: you are meant to feel them and never look at them.
    label: "core · motion",
    intensity: "recedes" as Intensity,
    count: MOTION_ITEMS.length,
    items: MOTION_ITEMS,
  },
];

const atmosphereGroup = (): Group => ({
  key: "atmosphere",
  label: LAYER_LABEL.atmosphere,
  intensity: INTENSITY_BY_LAYER.atmosphere,
  count: byLayer("atmosphere").length,
  items: layerItems("atmosphere"),
  note: "these are backgrounds, not siblings of Button. you reach them from the atmosphere you are standing in.",
});

function GroupHeader({ group }: { group: Group }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <span className="whitespace-nowrap font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted">
          {group.label}
        </span>
        <span className="font-mono text-[0.65rem] text-faint tabular-nums">
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
  return (
    <li>
      <Link
        href={item.href}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex items-center gap-1.5 border-l border-border py-1.5 pr-3 text-sm",
          "transition-[color,background-color,border-color] duration-150 ease-soft",
          "outline-none focus-visible:ring-focus",
          item.child ? "pl-6" : "pl-3",
          active
            ? "border-accent bg-surface-2 text-ink"
            : "text-muted hover:border-muted hover:bg-surface hover:text-ink",
        )}
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
  const atmospheres = atmosphereGroup();

  if (orientation === "horizontal") {
    const items = [
      ...GET_STARTED,
      ...groups.flatMap((g) => g.items),
      ...atmospheres.items,
    ];
    return (
      <nav
        aria-label="Documentation"
        className="flex gap-2 overflow-x-auto pb-1"
      >
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={pathname === item.href ? "page" : undefined}
            className={cn(
              "shrink-0 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm",
              "outline-none transition-colors duration-150 ease-soft focus-visible:ring-focus",
              pathname === item.href
                ? "bg-surface-2 text-ink glow-accent"
                : "text-muted hover:bg-surface hover:text-ink",
            )}
          >
            {item.label}
          </Link>
        ))}
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

      <div className="flex flex-col gap-2">
        <GroupHeader group={atmospheres} />
        <p className="text-xs leading-relaxed text-faint">{atmospheres.note}</p>
        <ul className="flex flex-col">
          {atmospheres.items.map((item) => (
            <Row key={item.href} item={item} active={pathname === item.href} />
          ))}
        </ul>
      </div>

      <p className="font-mono text-[0.6rem] leading-relaxed text-faint">
        no NEW chips: nothing is new until v1.0.0 ships.
      </p>
    </nav>
  );
}
