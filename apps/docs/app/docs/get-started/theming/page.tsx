import { CodeSnippet } from "@matt-pasek/usva";
import type { Metadata } from "next";
import Link from "next/link";
import { THEMES } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Theming",
  description:
    "Retheme usva. by moving role tokens. Forking a component to change a colour is the failure mode this design prevents.",
};

const brandTheme = `[data-theme="brand"] {
  --usva-bg: #07110f;
  --usva-surface: #0d1a17;
  --usva-ink: #e8f2ef;
  --usva-muted: #9db3ac;   /* must still clear 4.5:1 on bg and surface */
  --usva-faint: #35514a;   /* decoration only, so 2:1 is fine here */
  --usva-accent: #35e3a4;
  --usva-accent-alt: #ffb454;
  --usva-border: #1c2a26;
}`;

const apply = `<html data-theme="brand">`;

const scope = `<section data-theme="sisu">
  {/* this region is sisu, whatever the rest of the page is */}
  <Panel title="requests" />
</section>`;

export default function ThemingPage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-12 px-6 py-16 sm:px-10">
      <header className="flex flex-col gap-3">
        <span className="font-mono text-xs uppercase tracking-widest text-muted">
          get started · theming
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-ink">
          reskin it, do not fork it
        </h1>
        <p className="text-muted">
          no component in usva. contains a colour. every one of them consumes a
          role: <code className="font-mono text-ink">surface</code>,{" "}
          <code className="font-mono text-ink">accent</code>,{" "}
          <code className="font-mono text-ink">danger</code>. a theme is nothing
          but a block of variables that says what those roles mean. that is the
          whole mechanism, and it is why {THEMES.length} very different looking
          themes run the same components with zero component changes.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-ink">use a theme that ships</h2>
        <p className="text-muted">
          import the theme CSS and put its name on any element. it cascades, so{" "}
          <code className="font-mono text-ink">&lt;html&gt;</code> themes the
          app and a <code className="font-mono text-ink">&lt;section&gt;</code>{" "}
          themes one region.
        </p>
        <CodeSnippet language="xml" code={scope} />
        <p className="text-sm text-muted">
          the three:{" "}
          {THEMES.map((theme, i) => (
            <span key={theme}>
              {i > 0 ? " · " : ""}
              <Link className="text-accent underline" href={`/themes/${theme}`}>
                {theme}
              </Link>
            </span>
          ))}
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-ink">write your own</h2>
        <p className="text-muted">
          a theme is one selector and a list of roles. override the ones you
          care about, inherit the rest.
        </p>
        <CodeSnippet label="your-theme.css" language="css" code={brandTheme} />
        <CodeSnippet language="xml" code={apply} />
      </section>

      <section className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-5">
        <h2 className="font-semibold text-ink">the two constraints</h2>
        <p className="text-sm text-muted">
          keep <code className="font-mono text-ink">ink</code> and{" "}
          <code className="font-mono text-ink">muted</code> above 4.5:1 against{" "}
          <code className="font-mono text-ink">bg</code>,{" "}
          <code className="font-mono text-ink">sunken</code>,{" "}
          <code className="font-mono text-ink">surface</code> and{" "}
          <code className="font-mono text-ink">surface-2</code>. every component
          assumes it. and keep <code className="font-mono text-ink">faint</code>{" "}
          decorative: it is allowed to be quiet precisely because nothing
          depends on it being read. the full table is at{" "}
          <Link className="text-accent underline" href="/tokens">
            /tokens
          </Link>
          .
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-xl font-bold text-ink">
          when forking is the right call
        </h2>
        <p className="text-muted">
          if what you want is a different DOM or a different behaviour, tokens
          will not get you there and you should not try. copy the source in from
          the registry and own it. that is the second distribution, and it
          exists for exactly this.
        </p>
      </section>
    </main>
  );
}
