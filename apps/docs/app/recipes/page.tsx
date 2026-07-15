import type { Metadata } from "next";
import Link from "next/link";
import { CATALOG, type Provenance } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Recipes",
  description:
    "The two real screens usva. was extracted from, and the components each one composes.",
};

interface Recipe {
  key: Provenance;
  title: string;
  kind: string;
  theme: string;
  body: string;
}

const RECIPES: Recipe[] = [
  {
    key: "personal-website",
    title: "personal-website",
    kind: "Next 16 · React 19 · a portfolio",
    theme: "kajo",
    body: "the beauty pole. a dark, presentational site: an atmosphere behind the hero, a liquid frame at the viewport edge, case studies laid out in a bento. it is where most of the loud parts of the language came from, and it is the reason the loud parts have rules.",
  },
  {
    key: "sisu-plus",
    title: "sisu-plus",
    kind: "Vite extension · Astro landing · React 18",
    theme: "sisu",
    body: "the usability pole. a browser extension someone keeps open: panels, toolbars, logs, counts, a grid of widgets they drag into their own order. nothing here sparkles, and that is the argument. the same tokens, turned all the way down.",
  },
];

const composes = (key: Provenance) =>
  CATALOG.filter((entry) => entry.provenance.includes(key));

export default function RecipesPage() {
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-12 px-6 py-16 sm:px-10">
      <header className="flex max-w-2xl flex-col gap-3">
        <span className="font-mono text-xs uppercase tracking-widest text-muted">
          recipes
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-ink">
          two screens, one vocabulary
        </h1>
        <p className="text-muted">
          usva. was not designed in the abstract and then looked for a use. it
          was pulled out of two apps that already shipped, one built to be
          looked at and one built to be worked in. every component below earned
          its place by being needed twice.
        </p>
        <p className="text-sm text-muted">
          there are no screenshots on this page yet. i have not captured them,
          so i am not going to draw you a grey rectangle and call it evidence.
          the component lists are real: they are the provenance recorded in the
          catalog, and the same data drives the badge on every component page.
        </p>
      </header>

      {RECIPES.map((recipe) => {
        const parts = composes(recipe.key);
        return (
          <section key={recipe.key} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2 border-b border-border pb-4">
              <div className="flex flex-wrap items-baseline gap-3">
                <h2 className="text-2xl font-bold text-ink">{recipe.title}</h2>
                <span className="font-mono text-xs uppercase tracking-widest text-muted">
                  {recipe.kind}
                </span>
              </div>
              <p className="max-w-2xl text-muted">{recipe.body}</p>
              <p className="font-mono text-xs text-muted">
                theme{" "}
                <Link
                  className="text-accent underline"
                  href={`/themes/${recipe.theme}`}
                >
                  {recipe.theme}
                </Link>{" "}
                · {parts.length} components
              </p>
            </div>

            <ul className="flex flex-wrap gap-2">
              {parts.map((entry) => (
                <li key={entry.slug}>
                  <Link
                    className="block rounded-md border border-border bg-surface px-2.5 py-1 font-mono text-xs text-muted transition-colors hover:border-border-strong hover:text-ink"
                    href={`/docs/components/${entry.slug}`}
                  >
                    {entry.slug}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </main>
  );
}
