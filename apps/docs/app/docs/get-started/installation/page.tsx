import type { Metadata } from "next";
import Link from "next/link";
import { InstallBlock } from "@/components/install-block";
import { PACKAGE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Installation",
  description:
    "usva. ships two ways: as an npm package you update, and as registry source you own. Pick per component.",
};

const packageWins = [
  "you want fixes and new variants to arrive with a bun update, not a diff review",
  "you are using a lot of it, and 70 vendored files is not a codebase you want to own",
  "you care that the registry source and the package source are asserted byte-identical in CI, and you would rather let the package be the one that moves",
];

const registryWins = [
  "you need to change the component itself, not just its tokens. a different DOM, a different behaviour",
  "you have a policy against runtime dependencies in the UI layer",
  "you want exactly one component and nothing else in your bundle",
];

const setup = `/* app/globals.css */
@import "tailwindcss";
@import "@matt-pasek/usva-tokens/theme.css";
@import "@matt-pasek/usva-tokens/themes/kajo.css";

/* the utilities live in the built package, so tailwind has to see it */
@source "../node_modules/@matt-pasek/usva/dist/**/*.js";`;

const usage = `import { Button } from "${PACKAGE_NAME}";

export function Save() {
  return <Button variant="primary">save</Button>;
}`;

export default function InstallationPage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-12 px-6 py-16 sm:px-10">
      <header className="flex flex-col gap-3">
        <span className="font-mono text-xs uppercase tracking-widest text-muted">
          get started · installation
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-ink">
          two ways in
        </h1>
        <p className="text-muted">
          every component ships both as part of the package and as copyable
          source in the registry, from one codebase. you do not pick once for
          the project. you pick per component, and you can change your mind
          later by copying the source in and dropping the import.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-ink">the commands</h2>
        <InstallBlock registryName="button" />
        <p className="text-sm text-muted">
          the tokens package comes along with the npm install. if you copy
          source in instead, install{" "}
          <code className="font-mono text-ink">@matt-pasek/usva-tokens</code>{" "}
          yourself: the source consumes role tokens and will render unstyled
          without it.
        </p>
      </section>

      <section className="grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-5">
          <h3 className="font-semibold text-ink">take the package when</h3>
          <ul className="flex flex-col gap-2 text-sm text-muted">
            {packageWins.map((item) => (
              <li key={item}>
                <span aria-hidden="true" className="text-accent">
                  →{" "}
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-5">
          <h3 className="font-semibold text-ink">copy the source when</h3>
          <ul className="flex flex-col gap-2 text-sm text-muted">
            {registryWins.map((item) => (
              <li key={item}>
                <span aria-hidden="true" className="text-accent-alt">
                  →{" "}
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-ink">wire up the CSS</h2>
        <p className="text-muted">
          usva. is Tailwind v4. the roles arrive as CSS variables and as
          utilities, so a component can say{" "}
          <code className="font-mono text-ink">bg-surface</code> and mean it in
          any theme.
        </p>
        <pre className="overflow-x-auto rounded-md border border-border bg-sunken p-3 text-xs text-on-sunken">
          <code>{setup}</code>
        </pre>
        <p className="text-sm text-muted">
          the <code className="font-mono text-ink">@source</code> line is the
          one people miss. tailwind only generates the utilities it can see
          used, and it cannot see inside a dependency unless you point at it. if
          a component renders with no colour, this is why.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-ink">then use it</h2>
        <pre className="overflow-x-auto rounded-md border border-border bg-sunken p-3 text-xs text-on-sunken">
          <code>{usage}</code>
        </pre>
        <p className="text-sm text-muted">
          next:{" "}
          <Link
            className="text-accent underline"
            href="/docs/get-started/theming"
          >
            make it yours without forking it
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
