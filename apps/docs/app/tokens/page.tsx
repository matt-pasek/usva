import type { Metadata } from "next";
import { THEMES } from "@/lib/catalog";
import { buildTokenReference } from "@/lib/token-reference";

export const metadata: Metadata = {
  title: "Tokens",
  description:
    "Every semantic role token in usva., rendered live in kajo, sisu and savi at once.",
};

const ROLE_NOTES: Record<string, string> = {
  bg: "the page ground. one per document.",
  sunken: "below the ground: code blocks, wells, inset areas.",
  surface: "a card, a panel, anything raised off the ground.",
  "surface-2": "raised again. a row inside a card, a hovered cell.",
  overlay: "a dialog, a popover, a menu. it floats.",
  scrim: "the dimmed layer behind an overlay.",
  ink: "primary text. AA on every surface role.",
  muted: "secondary text, and anything information bearing. still AA.",
  faint: "decorative glyphs only. near 2:1 by design.",
  "on-accent": "text and icons on an accent fill.",
  "on-sunken": "text inside a sunken well, usually code.",
  "on-tint": "text on an accent tint, not on the accent itself.",
  accent: "the primary voice. the one live control.",
  "accent-2": "a supporting accent, for a second series or state.",
  "accent-alt": "the paired second voice. the period in the wordmark.",
  "accent-tint": "a translucent accent fill you can put text on.",
  "accent-ink": "accent used as text, contrast corrected for it.",
  success: "it worked.",
  warning: "it will not work for long.",
  danger: "it broke, or it is about to.",
  info: "neutral status, no alarm.",
  border: "the hairline. most separation is this.",
  "border-strong": "the edge you actually need to see.",
  ring: "the focus ring. never removed, only restyled.",
};

const TIERS: Record<string, "text" | "decorative"> = {
  ink: "text",
  muted: "text",
  faint: "decorative",
};

export default function TokensPage() {
  const { color } = buildTokenReference();

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16 sm:px-10">
      <header className="flex max-w-2xl flex-col gap-3">
        <span className="font-mono text-xs uppercase tracking-widest text-muted">
          tokens
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-ink">
          {color.length} roles, three themes
        </h1>
        <p className="text-muted">
          you never write a hex. you write a role, and the theme decides what it
          means. this table is generated from the tokens package, so it cannot
          drift from what ships. every swatch below is live: each column is a
          real theme scope, painting the same class.
        </p>
      </header>

      <section className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-5">
        <h2 className="text-sm font-semibold text-ink">the text tier rule</h2>
        <p className="max-w-2xl text-sm text-muted">
          <code className="font-mono text-ink">ink</code> and{" "}
          <code className="font-mono text-ink">muted</code> both clear 4.5:1 on
          every surface role, so anything a reader has to understand goes in one
          of those two. that includes the things people quietly downgrade: units
          on a stat, placeholder text, a group label.{" "}
          <code className="font-mono text-ink">faint</code> sits near 2:1 on
          purpose. it is for decoration, a divider glyph, a dimmed icon behind
          content, and it must never be the only thing carrying a piece of
          information.
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[42rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border bg-surface">
                <th className="p-3 font-mono text-xs uppercase tracking-widest text-muted">
                  role
                </th>
                {THEMES.map((theme) => (
                  <th
                    key={theme}
                    className="p-3 font-mono text-xs uppercase tracking-widest text-muted"
                  >
                    {theme}
                  </th>
                ))}
                <th className="p-3 font-mono text-xs uppercase tracking-widest text-muted">
                  what it is for
                </th>
              </tr>
            </thead>
            <tbody>
              {color.map(({ name }) => (
                <tr key={name} className="border-b border-border last:border-0">
                  <td className="whitespace-nowrap p-3 align-middle">
                    <code className="font-mono text-xs text-ink">{name}</code>
                    {TIERS[name] ? (
                      <span
                        className={`ml-2 rounded-sm px-1.5 py-0.5 font-mono text-[10px] uppercase ${
                          TIERS[name] === "text"
                            ? "bg-accent-tint text-on-tint"
                            : "bg-surface-2 text-muted"
                        }`}
                      >
                        {TIERS[name]}
                      </span>
                    ) : null}
                  </td>
                  {THEMES.map((theme) => (
                    <td
                      key={theme}
                      className="p-3 align-middle"
                      data-theme={theme}
                    >
                      {/* the tailwind utility would resolve --usva-* at :root, so a
                       * per-cell theme scope never reaches it. the raw role variable does. */}
                      <span
                        aria-hidden="true"
                        className="block h-8 w-16 rounded-md border border-border-strong"
                        style={{ background: `var(--usva-${name})` }}
                      />
                    </td>
                  ))}
                  <td className="p-3 align-middle text-muted">
                    {ROLE_NOTES[name] ?? ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted">
          the table scrolls sideways on a narrow screen. the page does not.
        </p>
      </section>
    </main>
  );
}
