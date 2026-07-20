import { THEMES } from "@/lib/catalog";

const ACCENTS = [
  {
    role: "accent",
    what: "the primary voice. one live control, one focal thing, per view.",
  },
  {
    role: "accent-alt",
    what: "the paired second voice. the period in the wordmark, the other half of a two-series chart. never on its own.",
  },
];

const TIERS = [
  {
    role: "ink",
    rule: "AA on every surface. anything a reader has to understand.",
    safe: true,
  },
  {
    role: "muted",
    rule: "AA too, and that is deliberate. secondary does not mean unreadable: units, placeholders, group labels all live here.",
    safe: true,
  },
  {
    role: "faint",
    rule: "near 2:1 by design. a divider glyph, a dimmed icon behind content. it must never be the only thing carrying a piece of information.",
    safe: false,
  },
];

function Swatch({ role, className }: { role: string; className?: string }) {
  return (
    <span
      aria-hidden
      className={`block rounded-md border border-border-strong ${className ?? "h-9 w-full"}`}
      style={{ background: `var(--usva-${role})` }}
    />
  );
}

export function ColorRoles({ total }: { total: number }) {
  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col gap-4">
        <div className="flex max-w-2xl flex-col gap-2">
          <h2 className="font-bold text-ink text-xl tracking-tight">
            the two accents
          </h2>
          <p className="text-muted text-sm">
            one accent is a monologue. two are a language. every place usva
            shows its own construction, a token name, a registry slug, the
            period in the wordmark, it uses the pair. what it is not for:
            decorating things at random. if both accents are on screen and
            neither means anything, you have spent the whole budget on nothing.
          </p>
        </div>
        <div className="flex flex-col divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface">
          {ACCENTS.map((accent) => (
            <div
              key={accent.role}
              className="grid gap-3 p-4 sm:grid-cols-[7rem_auto_1fr] sm:items-center sm:gap-6"
            >
              <code className="font-mono text-ink text-xs">{accent.role}</code>
              <div className="flex gap-1.5">
                {THEMES.map((theme) => (
                  <div
                    key={theme}
                    data-theme={theme}
                    className="flex flex-col items-center gap-1"
                  >
                    <Swatch role={accent.role} className="h-9 w-12" />
                    <span className="font-mono text-[10px] text-muted">
                      {theme}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-muted text-xs sm:text-sm">{accent.what}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex max-w-2xl flex-col gap-2">
          <h2 className="font-bold text-ink text-xl tracking-tight">
            three text tiers, and one hard rule
          </h2>
          <p className="text-muted text-sm">
            <code className="font-mono text-ink text-xs">ink</code> and{" "}
            <code className="font-mono text-ink text-xs">muted</code> both clear
            4.5:1 on every surface, so anything a reader has to understand goes
            in one of them, units and placeholders and group labels included.{" "}
            <code className="font-mono text-ink text-xs">faint</code> sits near
            2:1 on purpose, and may never be the only thing carrying a fact.
          </p>
        </div>
        <div className="flex flex-col divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface">
          {TIERS.map((tier) => (
            <div
              key={tier.role}
              className="grid gap-1.5 p-4 sm:grid-cols-[9rem_1fr] sm:gap-6"
            >
              <div className="flex h-fit items-center gap-2">
                <code className="font-mono text-ink text-xs">{tier.role}</code>
                <span
                  className={`rounded-sm px-1.5 py-0.5 font-mono text-[10px] uppercase ${
                    tier.safe
                      ? "bg-accent-tint text-on-tint"
                      : "bg-surface-2 text-muted"
                  }`}
                >
                  {tier.safe ? "informational" : "decorative"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <p
                  className="text-sm"
                  style={{ color: `var(--usva-${tier.role})` }}
                >
                  this sentence is set in {tier.role}.
                </p>
                <p className="text-muted text-xs">{tier.rule}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="text-muted text-xs">
          read the faint line again. if you had to squint, that is the point: it
          is doing its job, and it is why nothing you need may ever be written
          in it. all {total} roles are in the table below.
        </p>
      </section>
    </div>
  );
}
