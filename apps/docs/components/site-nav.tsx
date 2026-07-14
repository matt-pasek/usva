"use client";
import { SulaNav, type SulaNavItem, type SulaNavView } from "@matt-pasek/usva";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { CommandPalette } from "./command-palette";
import { ThemeSwitcher } from "./ThemeSwitcher";

const icon = (path: string) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.3"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-4"
    aria-hidden="true"
  >
    <title>{""}</title>
    {path.split("|").map((d) => (
      <path key={d} d={d} />
    ))}
  </svg>
);

/**
 * The bar cannot hold six labelled routes below 1280px, so the labels fold to
 * icons. Below 768px it cannot hold six of anything alongside search and the
 * theme control, so the whole set folds into the menu droplet and the nav's own
 * body swells open to hold it. Nothing is dropped at any width.
 */
const ROUTES: SulaNavItem[] = [
  {
    href: "/docs",
    label: "docs",
    icon: icon("M2 2h5v5H2z|M9 2h5v5H9z|M2 9h5v5H2z|M9 9h5v5H9z"),
  },
  {
    href: "/design-language",
    label: "design language",
    icon: icon("M8 1.5 14 5v6l-6 3.5L2 11V5z|M8 1.5v13|M2 5l6 3.5L14 5"),
  },
  {
    href: "/themes",
    label: "themes",
    icon: icon("M8 1.5a6.5 6.5 0 1 0 0 13z|M8 1.5a6.5 6.5 0 0 1 0 13"),
  },
  {
    href: "/tokens",
    label: "tokens",
    icon: icon("M8 1.5 14.5 8 8 14.5 1.5 8z"),
  },
  {
    href: "/recipes",
    label: "recipes",
    icon: icon("M3 3h10|M3 8h10|M3 13h6"),
  },
  {
    href: "/composer",
    label: "composer",
    icon: icon("M2 8h12|M8 2v12"),
  },
];

const VIEWS: SulaNavView[] = [
  {
    href: "/",
    label: "usva",
    icon: icon("M2 8h12"),
    items: ROUTES,
  },
];

/** The deepest route that owns the current path, so /docs/components/button
 * still lights `components`. */
const activeRoute = (pathname: string): string | undefined =>
  ROUTES.map((route) => route.href)
    .filter((href) => pathname === href || pathname.startsWith(`${href}/`))
    .sort((a, b) => b.length - a.length)[0];

export function SiteNav({ onOpenSearch }: { onOpenSearch?: () => void }) {
  const pathname = usePathname() ?? "/";
  const [searchOpen, setSearchOpen] = useState(false);

  const openSearch = useCallback(() => {
    if (onOpenSearch) {
      onOpenSearch();
      return;
    }
    setSearchOpen(true);
  }, [onOpenSearch]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== "k") return;
      if (!event.metaKey && !event.ctrlKey) return;
      event.preventDefault();
      openSearch();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openSearch]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 overflow-x-clip px-3 pt-3 sm:px-5 sm:pt-4">
      {/* The nav floats, so scrolled content passes beneath it, and through it:
          the glass is thin enough to read a paragraph through, which looks like
          a collision. The band gives the chrome a ground of its own. It is
          masked out at the bottom, so an atmosphere behind it goes soft rather
          than getting a hard edge cut across it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-24 bg-gradient-to-b from-bg/85 to-bg/0 backdrop-blur-sm [mask-image:linear-gradient(to_bottom,#000_55%,transparent)] sm:h-28"
      />
      <SulaNav
        ariaLabel="Primary"
        views={VIEWS}
        activeItem={activeRoute(pathname)}
        linkComponent={Link}
        labelsFrom="xl"
        collapseBelow="md"
        menuLabel="Menu"
        brand={
          <>
            usva<span className="text-accent-alt">.</span>
          </>
        }
        brandHref="/"
        brandLabel="usva, home"
        satellites={[
          {
            id: "search",
            align: "left",
            label: "Search",
            children: (
              <button
                type="button"
                onClick={openSearch}
                aria-keyshortcuts="Meta+K Control+K"
                className="flex min-h-11 items-center gap-2 rounded-full px-3.5 text-sm text-muted outline-none transition-tint duration-fast ease-soft hover:text-ink focus-visible:ring-focus"
              >
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  className="size-4 shrink-0"
                  aria-hidden="true"
                >
                  <title>{""}</title>
                  <circle cx="7" cy="7" r="4.5" />
                  <path d="m10.5 10.5 3 3" />
                </svg>
                {/* Legible in the mobile menu panel and in the wide bar; only
                    the cramped middle range hides it. */}
                <span className="not-sr-only md:max-lg:sr-only">search</span>
                <kbd className="hidden font-mono text-[0.6875rem] text-faint lg:inline">
                  ⌘K
                </kbd>
              </button>
            ),
          },
          {
            id: "theme",
            align: "right",
            label: "Theme",
            children: <ThemeSwitcher />,
          },
        ]}
      />
      <CommandPalette open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}
