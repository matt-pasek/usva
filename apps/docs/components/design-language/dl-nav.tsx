"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { cn } from "usva/cn";
import { DL_CHAPTERS, DL_GROUPS, dlHref } from "@/lib/design-language";
import { useCenteredChip } from "@/lib/use-centered-chip";

const HUB = "/design-language";

function GroupHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="whitespace-nowrap font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted">
        {label}
      </span>
      <span className="hairline-accent h-px flex-1" />
    </div>
  );
}

function Row({
  href,
  number,
  label,
  active,
}: {
  href: string;
  number: string;
  label: string;
  active: boolean;
}) {
  return (
    <li>
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex items-center gap-2 border-l py-1.5 pr-3 pl-3 text-sm",
          "transition-[color,background-color,border-color] duration-150 ease-soft",
          "outline-none focus-visible:ring-focus",
          active
            ? "border-accent bg-surface-2 text-ink"
            : "border-border text-muted hover:border-muted hover:bg-surface hover:text-ink",
        )}
      >
        <span
          aria-hidden="true"
          className="font-mono text-xs text-faint tabular-nums"
        >
          {number}
        </span>
        {label}
      </Link>
    </li>
  );
}

export function DesignLanguageNav({
  orientation = "vertical",
}: {
  orientation?: "vertical" | "horizontal";
}) {
  const pathname = usePathname();
  const strip = useRef<HTMLElement>(null);
  useCenteredChip(strip);

  if (orientation === "horizontal") {
    const all = [
      { href: HUB, number: "00", label: "overview" },
      ...DL_CHAPTERS.map((c) => ({
        href: dlHref(c.slug),
        number: c.number,
        label: c.title,
      })),
      { href: "/themes", number: "↗", label: "themes" },
    ];
    return (
      <nav
        ref={strip}
        className="flex gap-2 overflow-x-auto scroll-px-4 px-4 py-3 scrollbar-none [&::-webkit-scrollbar]:hidden"
      >
        {all.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            aria-current={pathname === item.href ? "page" : undefined}
            className={cn(
              "shrink-0 rounded-md border border-transparent px-2.5 py-1.5 font-mono text-xs transition-colors duration-150 ease-soft",
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
    <nav className="flex flex-col gap-6">
      <ul className="flex flex-col gap-1">
        <Row
          href={HUB}
          number="00"
          label="overview"
          active={pathname === HUB}
        />
      </ul>
      {DL_GROUPS.map((group) => (
        <div key={group} className="flex flex-col gap-1">
          <GroupHeader label={group} />
          <ul className="flex flex-col gap-1">
            {DL_CHAPTERS.filter((chapter) => chapter.group === group).map(
              (chapter) => (
                <Row
                  key={chapter.slug}
                  href={dlHref(chapter.slug)}
                  number={chapter.number}
                  label={chapter.title}
                  active={pathname === dlHref(chapter.slug)}
                />
              ),
            )}
          </ul>
        </div>
      ))}
      <div className="flex flex-col gap-1">
        <GroupHeader label="see also" />
        <ul className="flex flex-col gap-1">
          <Row href="/themes" number="↗" label="themes" active={false} />
        </ul>
      </div>
    </nav>
  );
}
