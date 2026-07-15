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

function Swatch({ role }: { role: string }) {
  return (
    <span
      aria-hidden
      className="block h-9 w-full rounded-md border border-border-strong"
      style={{ background: `var(--usva-${role})` }}
    />
  );
}

export function ColorRoles({ total }: { total: number }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-5">
        <h3 className="font-semibold text-ink text-sm">the two accents</h3>
        <p className="max-w-2xl text-muted text-sm">
          one accent is a monologue. two are a language. every place usva shows
          its own construction, a token name, a registry slug, the period in the
          wordmark, it uses the pair. what it is not for: decorating things at
          random. if both accents are on screen and neither means anything, you
          have spent the whole budget on nothing.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          {ACCENTS.map((accent) => (
            <div
              key={accent.role}
              className="flex flex-col gap-2 rounded-md border border-border p-3"
            >
              <code className="font-mono text-ink text-xs">{accent.role}</code>
              <div className="grid grid-cols-3 gap-2">
                {THEMES.map((theme) => (
                  <div
                    key={theme}
                    data-theme={theme}
                    className="flex flex-col gap-1"
                  >
                    <Swatch role={accent.role} />
                    <span className="font-mono text-[10px] text-muted">
                      {theme}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-muted text-xs">{accent.what}</p>
            </div>
          ))}
        </div>
        <p className="font-mono text-[10px] text-muted uppercase tracking-widest">
          each column is a real theme scope. the utility class would resolve at
          the root, so the swatch paints the raw role variable instead.
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-5">
        <h3 className="font-semibold text-ink text-sm">
          three text tiers, and one hard rule
        </h3>
        <div className="flex flex-col divide-y divide-border">
          {TIERS.map((tier) => (
            <div
              key={tier.role}
              className="flex flex-col gap-1.5 py-3 first:pt-0 last:pb-0 sm:grid sm:grid-cols-[9rem_1fr] sm:gap-6"
            >
              <div className="flex items-center gap-2">
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
          in it. all {total} roles are listed on the tokens page.
        </p>
      </div>
    </div>
  );
}
