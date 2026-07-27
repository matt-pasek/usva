# Contributing

usva. is one person's design system that happens to be readable in public. That shapes what is worth
your time here, so this page is blunt about which half is open.

## What gets merged

Bugs, accessibility problems, broken types, wrong or stale docs, and typos. If something is
incorrect, send the fix. These get looked at properly and I am grateful for them.

Also welcome: a report that a component behaves badly in a real app of yours. That is the most useful
issue anyone can file here, because it is the same signal the system was built on.

## What probably does not

New components, new props, renamed roles, and changes to the visual language. Not because the idea is
bad. It is that usva. has a governance rule it has to keep:

**personal-website is the source of truth, and a component earns its place by already working in a
live consumer.** The two apps that shaped this thing are the reason its APIs are the shape they are.
A component added because it seemed generally useful is exactly the "assembled, not authored" failure
the project exists to avoid.

So design direction is not an open process, and pretending otherwise would waste your afternoon. If
you want a component that is not here, open an issue describing what you are actually building. That
is real evidence, and evidence is what moves things.

If you disagree with a decision and want it your way, the license explicitly allows that: fork it, or
copy the component's source in through the registry and own it. That escape hatch is deliberate.

## Working on it

Uses [bun](https://bun.sh).

```sh
bun install
bun run build      # turbo, respects the dependency graph
bun run test       # vitest across every workspace
bun run typecheck
bun run lint       # biome, lint and format in one
bun run registry   # regenerates the registry JSON
```

Two things that will bite you:

**Do not change `bunfig.toml` off `hoisted`.** The isolated linker breaks IDE module resolution
against package-local devDependencies, and you get phantom TS2307 errors on files that `tsc` compiles
without complaint.

**The registry and the package must stay byte-identical.** CI asserts that the source the registry
emits for a component matches the package source exactly. If you edit a component, run
`bun run registry` and commit the result. A component's registry entry is discovered from disk rather
than listed by hand, so a new component needs its files in the right place, not a name added to an
array.

Green tests are not sufficient for anything visual. A missing Tailwind class never fails a build, and
neither does a component that renders in the wrong place. Open it in a browser.

## Pull requests

Conventional commit style for the title (`fix:`, `feat:`, `docs:`, `refactor:`, `chore:`). Keep the
diff to one thing. Say what you changed and how you checked it.

CI runs the suite against React 18 and 19, builds from a clean checkout, verifies package contents
with publint, and runs Chromatic. All of it has to pass.

## What is not in this repo

Specs, plans and internal working notes are gitignored on purpose. If a discussion points at a
document you cannot see, that is why, and it is not an oversight you need to report.

## Reporting something sensitive

Security issues go through [SECURITY.md](SECURITY.md), not the public tracker.
