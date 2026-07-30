import { Button } from "@usva-ui/react/primitives/button";
import { CodeSnippet } from "@usva-ui/react/primitives/code-snippet";
import type { Metadata } from "next";
import Link from "next/link";
import { DemoPanel } from "@/components/docs/demo-panel";
import { InstallBlock } from "@/components/install-block";
import { counts } from "@/lib/catalog";
import { PACKAGE_NAME, pageMetadata, TOKENS_PACKAGE } from "@/lib/site";

export const metadata: Metadata = pageMetadata(
  "/docs/get-started/installation",
  {
    title: "Installation",
    description:
      "usva. ships two ways: as an npm package you update, and as registry source you own. Pick per component.",
  },
);

const packageWins = [
  "you want fixes and new variants to arrive with a bun update, not a diff review",
  `you are using a lot of it, and ${counts.total} vendored components is not a codebase you want to own`,
  "you would rather the package be the thing that moves, and your tree stay still",
];

const registryWins = [
  "you need to change the component itself, not just its tokens. a different DOM, a different behaviour",
  "you have a policy against runtime dependencies in the UI layer",
  "you want exactly one component and nothing else in your bundle",
];

const cnUtil = `import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}`;

const setup = `@import "tailwindcss";
@import "@usva-ui/tokens/theme.css";
@import "@usva-ui/tokens/themes/kajo.css";

/* the utilities live in the built package, so tailwind has to see it */
@source "../node_modules/@usva-ui/react/dist/**/*.js";`;

const registrySetup = `@import "tailwindcss";

/* whatever shadcn init wrote, left exactly where it put it */
@import "shadcn/tailwind.css";
@theme inline {
  /* ... */
}

/* usva last. its @theme has to be read after shadcn's @theme inline */
@import "${TOKENS_PACKAGE}/theme.css";
@import "${TOKENS_PACKAGE}/themes/kajo.css";`;

const usage = `import { Button } from "${PACKAGE_NAME}";

export function Save() {
  return <Button variant="solid">save</Button>;
}`;

export default function InstallationPage() {
  return (
    <main className="@container flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <span className="font-mono text-xs uppercase tracking-widest text-muted">
          get started · installation
        </span>
        <h1 className="font-extrabold text-[clamp(2rem,5cqi,3rem)] text-ink leading-[1.04] tracking-[-0.03em]">
          two ways in
        </h1>
        <p className="max-w-2xl text-lg text-muted">
          every component ships both as part of the package and as copyable
          source in the registry, from one codebase. you do not pick once for
          the project. you pick per component, and you can change your mind
          later by copying the source in and dropping the import.
        </p>
      </header>

      <section className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-5">
        <h2 className="font-semibold text-ink">what it expects to find</h2>
        <p className="text-sm text-muted">
          React 18 or 19, and{" "}
          <b className="font-semibold text-ink">Tailwind v4</b>. the v4 part is
          not negotiable: the tokens ship as a{" "}
          <code className="font-mono text-ink">@theme</code> block and an{" "}
          <code className="font-mono text-ink">@import</code>, neither of which
          v3 can read. there is no config file to write and no plugin to
          register.
        </p>
        <p className="text-sm text-muted">
          it works wherever React does.{" "}
          <b className="font-semibold text-ink">Next</b>, including the app
          router and server components: every component that needs the client
          declares it, and the build splits client from server per file, so
          there is no wrapping and no{" "}
          <code className="font-mono text-ink">ssr: false</code>.{" "}
          <b className="font-semibold text-ink">Vite</b> and{" "}
          <b className="font-semibold text-ink">Astro</b> the same, on React 18
          or 19.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-bold text-ink text-xl tracking-tight">
          the commands
        </h2>
        <InstallBlock registryName="button" />
        <p className="text-sm text-muted">
          the tokens package comes along with the npm install. if you copy
          source in instead, install{" "}
          <code className="font-mono text-ink">@usva-ui/tokens</code> yourself:
          the source consumes role tokens and will render unstyled without it.
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
        <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-5 col-span-2">
          <h2 className="font-semibold text-ink">
            the licence, before you copy
          </h2>
          <p className="text-sm text-muted">
            the source you copy in is still licensed. usva. is mit with the
            commons clause: build on it, fork it, change it, ship it in whatever
            you make. the one line you cannot cross is repackaging the
            components themselves to sell or republish them as a competing
            library.
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-bold text-ink text-xl tracking-tight">
          the cn util, if you copy source
        </h2>
        <p className="text-muted">
          copied source imports <code className="font-mono text-ink">cn</code>{" "}
          from <code className="font-mono text-ink">@/lib/utils</code>, the same
          contract shadcn uses. if your project ran{" "}
          <code className="font-mono text-ink">npx shadcn init</code> it is
          already there, and the add command wires everything up. copying by
          hand instead, create it once:
        </p>
        <CodeSnippet label="lib/utils.ts" language="typescript" code={cnUtil} />
        <p className="text-sm text-muted">
          it needs <code className="font-mono text-ink">clsx</code> and{" "}
          <code className="font-mono text-ink">tailwind-merge</code>. a
          component that leans on a sibling, like Button on Spinner, declares it
          as a registry dependency, so the add command copies both. hand copiers
          grab the sibling from its own page.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-bold text-ink text-xl tracking-tight">
          wire up the CSS
        </h2>
        <p className="text-muted">
          usva. is Tailwind v4. the roles arrive as CSS variables and as
          utilities, so a component can say{" "}
          <code className="font-mono text-ink">bg-surface</code> and mean it in
          any theme.
        </p>
        <CodeSnippet label="app/globals.css" language="css" code={setup} />
        <p className="text-sm text-muted">
          the <code className="font-mono text-ink">@source</code> line is the
          one people miss. tailwind only generates the utilities it can see
          used, and it cannot see inside a dependency unless you point at it. if
          a component renders with no colour, this is why. copying source in
          instead, you do not need it: the files land in your own tree, which
          tailwind already scans.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-bold text-ink text-xl tracking-tight">
          if you ran shadcn init, order matters
        </h2>
        <p className="text-muted">
          <code className="font-mono text-ink">shadcn init</code> appends its
          own <code className="font-mono text-ink">@theme inline</code> block to
          your css, and four of its role names are also ours:{" "}
          <code className="font-mono text-ink">border</code>,{" "}
          <code className="font-mono text-ink">accent</code>,{" "}
          <code className="font-mono text-ink">muted</code> and{" "}
          <code className="font-mono text-ink">ring</code>. whichever block is
          read last wins, and init appends, so it wins by default.
        </p>
        <CodeSnippet
          label="src/index.css"
          language="css"
          code={registrySetup}
        />
        <p className="text-sm text-muted">
          the failure is quiet, which is what makes it worth knowing. the other
          twenty-one roles still resolve, so the component looks deliberate and
          only those four colours are someone else&rsquo;s. an outline Button
          with a near-white border instead of a dim one is the usual tell. move
          the usva imports to the bottom and all four come back.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-bold text-ink text-xl tracking-tight">
          then use it
        </h2>
        <CodeSnippet label="anywhere" language="tsx" code={usage} />
        <DemoPanel label="what you should be seeing" note="rendered here, now">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="solid">save</Button>
            <Button variant="outline">cancel</Button>
            <Button variant="ghost">skip</Button>
          </div>
        </DemoPanel>
        <p className="text-sm text-muted">
          that is the real component, on this page, from the same package you
          just installed. tab to it and it takes a focus ring; the colour moves
          over 150ms and the surface does not. if yours came out unstyled, the{" "}
          <code className="font-mono text-ink">@source</code> line above is
          almost always the reason.
        </p>
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
