"use client";
import { SulaNav, type SulaNavItem, type SulaNavView } from "@matt-pasek/usva";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { CommandPalette } from "./command-palette";
import { ThemeSwitcher } from "./ThemeSwitcher";

const icon = (children: React.ReactNode) => (
  <svg
    viewBox="0 0 24 24"
    width="20"
    height="20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="size-5 shrink-0"
    aria-hidden="true"
  >
    <title>{""}</title>
    {children}
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
    icon: icon(
      <>
        <path d="M12 7.5v13" />
        <path d="M12 7.5C12 5.6 10 4 7.5 4H3v12.5h4.5c2.5 0 4.5 1.6 4.5 4z" />
        <path d="M12 7.5C12 5.6 14 4 16.5 4H21v12.5h-4.5c-2.5 0-4.5 1.6-4.5 4z" />
      </>,
    ),
  },
  {
    href: "/design-language",
    label: "design language",
    icon: icon(
      <>
        <path d="M3.5 13.5h7v7h-7z" />
        <path d="M15 3.5 21 13h-12z" />
      </>,
    ),
  },
  {
    href: "/themes",
    label: "themes",
    icon: icon(
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path
          d="M12 3.5a8.5 8.5 0 0 1 0 17z"
          fill="currentColor"
          stroke="none"
        />
      </>,
    ),
  },
  {
    href: "/tokens",
    label: "tokens",
    icon: icon(
      <>
        <path d="M12 3 21 9.5 12 21 3 9.5z" />
        <path d="M3 9.5h18" />
        <path d="M9 9.5 12 21l3-11.5" />
      </>,
    ),
  },
  {
    href: "/recipes",
    label: "recipes",
    icon: icon(
      <>
        <path d="M9.5 6.5H21" />
        <path d="M9.5 12H21" />
        <path d="M9.5 17.5H21" />
        <circle cx="4.5" cy="6.5" r="1.4" />
        <circle cx="4.5" cy="12" r="1.4" />
        <circle cx="4.5" cy="17.5" r="1.4" />
      </>,
    ),
  },
  {
    href: "/composer",
    label: "composer",
    icon: icon(
      <>
        <path d="M3.5 3.5h7v7h-7z" />
        <path d="M13.5 3.5h7v7h-7z" />
        <path d="M3.5 13.5h7v7h-7z" />
        <path d="M17 14v6" />
        <path d="M14 17h6" />
      </>,
    ),
  },
];

const VIEWS: SulaNavView[] = [
  {
    href: "/",
    label: "usva",
    icon: icon(<path d="M4 12h16" />),
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
    <header className="fixed inset-x-0 top-0 z-50 overflow-x-clip px-3 pt-6 sm:px-5 sm:pt-7">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-24 bg-linear-to-b from-bg/85 to-bg/0 backdrop-blur-sm [mask-image:linear-gradient(to_bottom,#000_55%,transparent)] sm:h-28"
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
