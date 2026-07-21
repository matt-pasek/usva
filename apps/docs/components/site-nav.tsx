"use client";
import { SulaNav, type SulaNavItem, type SulaNavView } from "@matt-pasek/usva";
import { BookOpen, Contrast, Shapes, Sparkles, Type } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { CommandPalette } from "./command-palette";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { Wordmark } from "./wordmark";

const ICON = "size-5 shrink-0";

const ROUTES: SulaNavItem[] = [
  {
    href: "/docs",
    label: "docs",
    icon: <BookOpen className={ICON} strokeWidth={1.8} aria-hidden />,
  },
  {
    href: "/design-language",
    label: "design language",
    icon: <Shapes className={ICON} strokeWidth={1.8} aria-hidden />,
  },
  {
    href: "/themes",
    label: "themes",
    icon: <Contrast className={ICON} strokeWidth={1.8} aria-hidden />,
  },
  {
    href: "/studio",
    label: "studio",
    icon: <Sparkles className={ICON} strokeWidth={1.8} aria-hidden />,
  },
];

const VIEWS: SulaNavView[] = [
  {
    href: "/",
    label: "usva",
    icon: <Type className={ICON} strokeWidth={1.8} aria-hidden />,
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
    <header className="fixed inset-x-0 top-0 z-30 overflow-x-clip px-3 pt-6 sm:px-5 sm:pt-7">
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
        brand={<Wordmark />}
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
                <kbd className="hidden font-mono text-[0.6875rem] text-muted lg:inline">
                  ⌘K
                </kbd>
              </button>
            ),
          },
          {
            id: "github",
            align: "right",
            label: "GitHub",
            children: (
              <a
                href="https://github.com/matt-pasek/usva"
                target="_blank"
                rel="noreferrer"
                aria-label="usva on GitHub"
                className="flex min-h-11 min-w-11 items-center justify-center rounded-full text-muted outline-none transition-tint duration-fast ease-soft hover:text-ink focus-visible:ring-focus"
              >
                <svg
                  viewBox="0 0 16 16"
                  width="18"
                  height="18"
                  fill="currentColor"
                  className="size-4.5 shrink-0"
                  aria-hidden="true"
                >
                  <path d="M8 .2a8 8 0 0 0-2.53 15.59c.4.07.55-.17.55-.38l-.01-1.49c-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48l-.01 2.2c0 .21.15.46.55.38A8 8 0 0 0 8 .2z" />
                </svg>
                <span className="sr-only">usva on GitHub</span>
              </a>
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
