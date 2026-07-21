import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ThemeId } from "@/components/theme-provider";
import { lexeme } from "@/lib/lexicon";
import { THEME_DOCS, THEME_ORDER } from "@/lib/themes";

const DOTS = ["accent", "accent-alt", "surface-2", "border-strong"];

/* a data-theme scope on the card re-declares the --usva-* variables for its
 * subtree, and inline var() resolves at the element, so each card paints in
 * its own theme while the page stays in yours. tailwind role utilities would
 * resolve at :root and paint every card the same. */
function RegisterCard({ id }: { id: ThemeId }) {
  const doc = THEME_DOCS[id];
  const word = lexeme(id);

  return (
    <Link
      href={`/themes/${id}`}
      data-theme={id}
      className="group relative flex flex-col gap-3 overflow-hidden rounded-xl p-6 transition-transform duration-200 ease-soft hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      style={{
        background: "var(--usva-bg)",
        border: "1px solid var(--usva-border-strong)",
      }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(80% 90% at 10% 0%, color-mix(in oklab, var(--usva-accent) 16%, transparent), transparent 70%)",
        }}
      />
      <span
        className="relative font-mono text-xs uppercase tracking-widest"
        style={{ color: "var(--usva-muted)" }}
      >
        0{doc.index} · {word?.labels}
      </span>
      <span
        className="relative font-extrabold text-3xl tracking-tight"
        style={{ color: "var(--usva-ink)" }}
      >
        {id}
        <span style={{ color: "var(--usva-accent-alt)" }}>.</span>
      </span>
      <span className="relative text-sm" style={{ color: "var(--usva-muted)" }}>
        {doc.capsule}
      </span>
      <span className="relative mt-2 flex items-center justify-between">
        <span className="flex gap-1.5">
          {DOTS.map((role) => (
            <span
              key={role}
              aria-hidden="true"
              className="size-4 rounded-full"
              style={{
                background: `var(--usva-${role})`,
                border: "1px solid var(--usva-border-strong)",
              }}
            />
          ))}
        </span>
        <span
          className="flex items-center gap-1 font-mono text-xs"
          style={{ color: "var(--usva-accent)" }}
        >
          stand in it
          <ArrowRight
            aria-hidden="true"
            className="size-3.5 transition-transform duration-200 ease-soft group-hover:translate-x-0.5"
          />
        </span>
      </span>
    </Link>
  );
}

export function OtherRegisters({ current }: { current: ThemeId }) {
  const others = THEME_ORDER.filter((id) => id !== current);
  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-mono text-sm uppercase tracking-widest text-muted">
        the other registers
      </h2>
      <p className="max-w-2xl text-muted">
        same components, same roles, a different reading of every one of them.
        nothing forks.
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {others.map((id) => (
          <RegisterCard key={id} id={id} />
        ))}
      </div>
    </section>
  );
}
