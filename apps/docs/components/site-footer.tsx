"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Wordmark } from "./wordmark";

const footerLink =
  "outline-none transition-tint duration-fast ease-soft hover:text-ink focus-visible:ring-focus";

const GROUPS = [
  {
    heading: "start",
    links: [
      { href: "/docs/get-started", label: "get started" },
      { href: "/docs/get-started/installation", label: "installation" },
      { href: "/docs/get-started/for-agents", label: "for agents" },
    ],
  },
  {
    heading: "library",
    links: [
      { href: "/docs/components", label: "components" },
      { href: "/themes", label: "themes" },
      { href: "/studio", label: "studio" },
    ],
  },
  {
    heading: "design",
    links: [
      { href: "/design-language", label: "overview" },
      { href: "/design-language/voice", label: "voice" },
      { href: "/design-language/accessibility", label: "accessibility" },
      { href: "/design-language/tokens", label: "tokens" },
    ],
  },
];

export function SiteFooter() {
  const pathname = usePathname();
  if (pathname === "/studio") return null;

  return (
    <footer className="relative z-30 border-t border-border bg-bg">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-12 sm:px-10">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div className="flex flex-col gap-2">
            <Link href="/" className="text-lg">
              <Wordmark />
            </Link>
            <p className="max-w-xs text-sm text-muted">
              a highly opinionated design system and component library, free to
              build with
            </p>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-8 sm:grid-cols-3"
          >
            {GROUPS.map((group) => (
              <div key={group.heading} className="flex flex-col gap-3">
                <h2 className="font-mono text-xs tracking-wide text-muted">
                  {group.heading}
                </h2>
                <ul className="flex flex-col gap-2">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted outline-none transition-tint duration-fast ease-soft hover:text-ink focus-visible:ring-focus"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-xs text-muted">
          <span>© 2026 usva</span>
          <span aria-hidden="true">·</span>
          <span>
            built by{" "}
            <a
              href="https://matt-pasek.dev"
              target="_blank"
              rel="noreferrer"
              className={footerLink}
            >
              matt pasek
            </a>
          </span>
          <span aria-hidden="true">·</span>
          <a
            href="https://github.com/matt-pasek/usva/blob/main/LICENSE.md"
            target="_blank"
            rel="noreferrer"
            className={footerLink}
          >
            license
          </a>
          <span aria-hidden="true">·</span>
          <a
            href="https://github.com/matt-pasek/usva"
            target="_blank"
            rel="noreferrer"
            className={footerLink}
          >
            github
          </a>
        </p>
      </div>
    </footer>
  );
}
