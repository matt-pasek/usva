import { CodeSnippet } from "@matt-pasek/usva";
import type { Metadata } from "next";
import Link from "next/link";
import { counts } from "@/lib/catalog";
import { pageMetadata, SITE_ORIGIN } from "@/lib/site";

export const metadata: Metadata = pageMetadata("/docs/get-started/for-agents", {
  title: "For agents",
  description:
    "How a coding agent is meant to consume usva.: an installable skill file, and llms.txt as the raw index.",
});

export default function ForAgentsPage() {
  return (
    <main className="@container flex flex-col gap-8">
      <header className="flex flex-col gap-3">
        <span className="font-mono text-xs uppercase tracking-widest text-muted">
          get started · for agents
        </span>
        <h1 className="font-extrabold text-[clamp(2rem,5cqi,3rem)] text-ink leading-[1.04] tracking-[-0.03em]">
          most of the people reading this are not people
        </h1>
        <p className="max-w-2xl text-lg text-muted">
          a design system is a set of rules about what to reach for and what to
          leave alone. that is exactly the kind of thing an agent gets wrong by
          default: it will happily put three attention-heavy components in one
          region because each of them, on its own, looked good. so the rules
          have to be machine readable, not just written down on a page.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="font-bold text-ink text-xl tracking-tight">the skill</h2>
        <p className="max-w-2xl text-muted">
          one file, at{" "}
          <Link
            className="text-accent underline"
            href="/skill.md"
            prefetch={false}
          >
            {SITE_ORIGIN}/skill.md
          </Link>
          . it carries the seven rules that survive a truncated read, the layer
          and intensity table, the workflow, the role tokens, what each import
          actually costs, and all {counts.total} components with their import
          paths. it regenerates from the same catalog the library builds from,
          so it cannot fall behind.
        </p>
        <CodeSnippet
          language="bash"
          code={`mkdir -p .claude/skills/usva
curl -o .claude/skills/usva/SKILL.md ${SITE_ORIGIN}/skill.md`}
        />
        <p className="max-w-2xl text-muted text-sm">
          no agent skills in your harness? the file is plain markdown with
          frontmatter. save it as <code className="font-mono">AGENTS.md</code>,
          or paste it as a system prompt.
        </p>
      </section>

      <section className="flex flex-col gap-3 rounded-lg border border-border-strong bg-surface p-5">
        <h2 className="font-semibold text-ink">
          the part worth installing it for
        </h2>
        <p className="max-w-2xl text-muted text-sm">
          most of the skill is what you would expect. the section that earns it
          is the gotchas table: eight ways this library fails <em>quietly</em>.
          a barrel import that costs 170 KiB of animation runtime for a button.
          a canvas chrome blanks because an ancestor animates. a reveal that
          never fires because it is parked outside its own mask. every one of
          them passes a build, passes the types, and often looks fine in a
          screenshot. none is guessable from a list of components, which is the
          whole reason the file exists.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="font-bold text-ink text-xl tracking-tight">llms.txt</h2>
        <p className="max-w-2xl text-muted">
          the raw index, at{" "}
          <Link
            className="text-accent underline"
            href="/llms.txt"
            prefetch={false}
          >
            {SITE_ORIGIN}/llms.txt
          </Link>
          . every one of the {counts.total} components is a markdown link,
          carrying its layer, its intensity, a one line summary, the composition
          prohibitions and the registry command. the pages and the
          design-language chapters are linked the same way. a parser lifts the
          links, a model reads the prose. reach for this one when you want the
          catalogue rather than the rules.
        </p>
      </section>

      <section className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-5">
        <h2 className="font-semibold text-ink">the shortest useful prompt</h2>
        <p className="text-muted text-sm">
          if you cannot install anything at all.
        </p>
        <CodeSnippet
          language="plain"
          code={`read ${SITE_ORIGIN}/llms.txt before you build any UI.
use usva components. obey the intensity rules:
core recedes, patterns structure, sula asserts,
one sula element per region, at most.`}
        />
      </section>
    </main>
  );
}
