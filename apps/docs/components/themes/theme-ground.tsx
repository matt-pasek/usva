import Link from "next/link";
import type { ThemeDoc } from "@/lib/themes";

/* bg-<role> utilities resolve their custom properties at :root, and a
 * constructed class name is invisible to Tailwind anyway, so the paint
 * has to be the raw role variable. */
export function ThemeGround({ doc }: { doc: ThemeDoc }) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-mono text-sm uppercase tracking-widest text-muted">
        the ground
      </h2>
      <p className="max-w-2xl text-muted">
        every theme speaks the same{" "}
        <Link
          className="text-accent underline-offset-4 hover:underline"
          href="/design-language/color"
        >
          role vocabulary
        </Link>
        . these six are the ones doing the heavy lifting in {doc.id}.
      </p>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-6">
        {doc.palette.map(({ role, note }) => (
          <li key={role} className="flex flex-col gap-2.5">
            <span
              aria-hidden="true"
              className="h-24 rounded-lg border border-border-strong"
              style={{ background: `var(--usva-${role})` }}
            />
            <code className="font-mono text-xs text-ink">{role}</code>
            <span className="text-sm text-muted">{note}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
