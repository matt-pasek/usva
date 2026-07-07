import * as React from "react";
import { cn } from "../../cn.js";

export type FooterTone = "accent" | "accent-alt";

export interface FooterLink {
  label: React.ReactNode;
  href: string;
  /** Overrides the target derived from the protocol. */
  external?: boolean;
  icon?: React.ReactNode;
}

export interface FooterColumn {
  /** Doubles as the column's accessible name, so keep it a string. */
  title: string;
  tone?: FooterTone;
  links: FooterLink[];
}

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  brand?: React.ReactNode;
  tagline?: React.ReactNode;
  columns?: FooterColumn[];
  /** `full` keeps the titled columns. `compact` flattens them into one row. */
  variant?: "full" | "compact";
  copyright?: React.ReactNode;
  /** Trailing note, set opposite the copyright. */
  note?: React.ReactNode;
  /** Two decorative radial washes. They assume a dark page, so they are opt-in. */
  glow?: boolean;
}

const toneHover: Record<FooterTone, string> = {
  accent: "hover:text-accent",
  "accent-alt": "hover:text-accent-alt",
};

/** An offsite link opens a tab. `mailto:`, `tel:` and in-page anchors do not. */
function isOffsite(href: string): boolean {
  return /^https?:\/\//.test(href);
}

function FooterAnchor({
  link,
  tone = "accent",
  compact,
}: {
  link: FooterLink;
  tone?: FooterTone;
  compact?: boolean;
}) {
  const offsite = link.external ?? isOffsite(link.href);
  return (
    <a
      href={link.href}
      {...(offsite ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className={cn(
        "relative inline-flex items-center gap-2 text-ink outline-none [&_svg]:size-4",
        "transition-tint duration-fast ease-soft motion-reduce:transition-none",
        "focus-visible:ring-focus",
        toneHover[tone],
        compact
          ? "leading-5 after:absolute after:inset-x-0 after:-inset-y-3 after:content-['']"
          : "min-h-11",
      )}
    >
      {link.icon}
      {link.label}
      {offsite && <span className="sr-only"> (opens in a new tab)</span>}
    </a>
  );
}

/**
 * kajo's footer pulls itself up under the section above with a negative margin. That
 * is page layout, not footer, so it stays in the consumer's className.
 */
export const Footer = React.forwardRef<HTMLElement, FooterProps>(
  (
    {
      className,
      brand,
      tagline,
      columns = [],
      variant = "full",
      copyright,
      note,
      glow,
      ...props
    },
    ref,
  ) => {
    const compact = variant === "compact";
    const flatLinks = compact ? columns.flatMap((c) => c.links) : [];
    const hasBottom = copyright != null || note != null;

    return (
      <footer
        ref={ref}
        className={cn(
          "relative isolate w-full overflow-hidden px-6 py-12 text-ink sm:px-10",
          className,
        )}
        {...props}
      >
        <span
          data-footer-rule=""
          aria-hidden="true"
          style={{
            backgroundImage:
              "linear-gradient(90deg, transparent, color-mix(in oklab, var(--color-ink) 26%, transparent), color-mix(in oklab, var(--color-accent-alt) 24%, transparent), transparent)",
          }}
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
        />

        {glow && (
          <>
            <span
              data-footer-glow=""
              aria-hidden="true"
              style={{
                backgroundImage:
                  "radial-gradient(circle, color-mix(in oklab, var(--color-accent) 20%, transparent), transparent 64%)",
              }}
              className="pointer-events-none absolute -top-1/3 right-0 -z-10 h-[105%] w-1/2"
            />
            <span
              data-footer-glow=""
              aria-hidden="true"
              style={{
                backgroundImage:
                  "radial-gradient(circle, color-mix(in oklab, var(--color-accent-alt) 16%, transparent), transparent 64%)",
              }}
              className="pointer-events-none absolute -bottom-1/3 left-0 -z-10 h-[110%] w-1/2"
            />
          </>
        )}

        <div className="relative mx-auto flex max-w-[72.5rem] flex-col gap-12">
          <div
            className={cn(
              "flex flex-col gap-10",
              compact
                ? "sm:flex-row sm:items-center sm:justify-between"
                : "md:flex-row md:items-start md:justify-between",
            )}
          >
            {(brand != null || tagline != null) && (
              <div className="flex max-w-md flex-col gap-3">
                {brand}
                {tagline != null && (
                  <p className="text-[0.9375rem] leading-[1.75] text-muted">
                    {tagline}
                  </p>
                )}
              </div>
            )}

            {compact ? (
              <nav aria-label="Footer">
                <ul className="flex list-none flex-wrap items-center gap-x-6 gap-y-3 text-sm">
                  {flatLinks.map((link) => (
                    <li key={link.href}>
                      <FooterAnchor link={link} compact />
                    </li>
                  ))}
                </ul>
              </nav>
            ) : (
              <div className="grid grid-cols-2 gap-x-14 gap-y-9">
                {columns.map((column) => (
                  <nav key={column.title} aria-label={column.title}>
                    <p className="mb-4 font-mono text-xs uppercase tracking-[0.14em] text-muted">
                      {column.title}
                    </p>
                    <ul className="flex list-none flex-col text-[0.96875rem]">
                      {column.links.map((link) => (
                        <li key={link.href}>
                          <FooterAnchor link={link} tone={column.tone} />
                        </li>
                      ))}
                    </ul>
                  </nav>
                ))}
              </div>
            )}
          </div>

          {hasBottom && (
            <div
              data-footer-bottom=""
              className="grid gap-3 border-t border-border pt-6 text-center font-mono text-[0.8125rem] tracking-[0.04em] text-muted md:grid-cols-[1fr_auto_1fr] md:text-left"
            >
              <span>{copyright}</span>
              {note != null && (
                <span className="md:col-start-3 md:text-right">{note}</span>
              )}
            </div>
          )}
        </div>
      </footer>
    );
  },
);
Footer.displayName = "Footer";
