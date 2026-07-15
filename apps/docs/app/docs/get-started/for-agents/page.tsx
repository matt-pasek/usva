import type { Metadata } from "next";
import Link from "next/link";
import { counts } from "@/lib/catalog";
import { SITE_ORIGIN } from "@/lib/site";

export const metadata: Metadata = {
  title: "For agents",
  description:
    "How a coding agent is meant to consume usva.: llms.txt today, a skill file next, and no MCP server on purpose.",
};

export default function ForAgentsPage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-12 px-6 py-16 sm:px-10">
      <header className="flex flex-col gap-3">
        <span className="font-mono text-xs uppercase tracking-widest text-muted">
          get started · for agents
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight text-ink">
          most of the people reading this are not people
        </h1>
        <p className="text-muted">
          a design system is a set of rules about what to reach for and what to
          leave alone. that is exactly the kind of thing an agent gets wrong by
          default: it will happily put three attention-heavy components in one
          region because each of them, on its own, looked good. so the rules
          have to be machine readable, not just written down on a page.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-ink">
          llms.txt <span className="font-mono text-sm text-accent">live</span>
        </h2>
        <p className="text-muted">
          a plain text summary of the whole library at{" "}
          <Link
            className="text-accent underline"
            href="/llms.txt"
            prefetch={false}
          >
            {SITE_ORIGIN}/llms.txt
          </Link>
          . it lists all {counts.total} components with their layer, their
          intensity and a one line summary, plus the composition prohibitions
          and the registry URL for each. it is generated from the same catalog
          that renders this site, so it cannot advertise a component that does
          not exist and it cannot miss one that does.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-ink">
          a skill file{" "}
          <span className="font-mono text-sm text-muted">not yet</span>
        </h2>
        <p className="text-muted">
          the plan is a skill file that lives in the repo: the intensity rules,
          the one-sula-per-region prohibition, the token tiers, and the registry
          commands, in the format a coding agent already knows how to load. it
          is not written. when it is, it will be in the repository rather than
          behind a service, so it can be vendored, read and diffed like any
          other file.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-bold text-ink">
          no MCP server{" "}
          <span className="font-mono text-sm text-muted">on purpose</span>
        </h2>
        <p className="text-muted">
          there is no usva MCP server and i am not planning one right now. a
          server is a thing to run, to version, to keep up, and to trust, and
          everything it would hand back is already a static file this site
          serves: the catalog, the rules, the registry JSON. an agent that can
          fetch a URL has the whole system. if that ever stops being true, the
          server can be built then, and i would rather say so than ship a stub
          to look current.
        </p>
      </section>

      <section className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-5">
        <h2 className="font-semibold text-ink">the shortest useful prompt</h2>
        <pre className="overflow-x-auto rounded-md border border-border bg-sunken p-3 text-xs text-on-sunken">
          <code>{`read ${SITE_ORIGIN}/llms.txt before you build any UI.
use usva components. obey the intensity rules:
core recedes, patterns structure, sula asserts,
one sula element per region, at most.`}</code>
        </pre>
      </section>
    </main>
  );
}
