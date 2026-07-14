import Link from "next/link";
import { counts } from "@/lib/catalog";

const GROUPS = [
  {
    heading: "library",
    links: [
      { href: "/docs/components", label: "components" },
      { href: "/tokens", label: "tokens" },
      { href: "/themes", label: "themes" },
      { href: "/recipes", label: "recipes" },
    ],
  },
  {
    heading: "language",
    links: [
      { href: "/design-language", label: "design language" },
      { href: "/composer", label: "composer" },
    ],
  },
  {
    heading: "start",
    links: [
      { href: "/docs/get-started", label: "get started" },
      { href: "/docs/get-started/installation", label: "installation" },
      { href: "/docs/get-started/for-agents", label: "for agents" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-12 md:px-8">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div className="flex flex-col gap-2">
            <Link
              href="/"
              className="text-lg font-semibold tracking-tight text-ink outline-none focus-visible:ring-focus"
            >
              usva<span className="text-accent-alt">.</span>
            </Link>
            <p className="max-w-xs text-sm text-muted">
              beauty that stays usable. {counts.total} components,{" "}
              {counts.themes} themes, one grammar.
            </p>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-8 sm:grid-cols-3"
          >
            {GROUPS.map((group) => (
              <div key={group.heading} className="flex flex-col gap-3">
                <h2 className="font-mono text-xs tracking-wide text-faint">
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

        <p className="font-mono text-xs text-faint">
          MIT licensed · built by matt pasek
        </p>
      </div>
    </footer>
  );
}
