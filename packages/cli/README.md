# @usva-ui/cli

Private, and not published. This is the build tool that produces usva's registry, plus one shelved
command described at the bottom.

## What it does

`build-registry.ts` walks the component source in `packages/usva/src` and emits one JSON file per
component into `registry/r/`, which the docs site serves at `https://usva.build/r/<name>.json`. That
is the endpoint `npx shadcn add` reads.

```sh
bun run registry
```

Entries are discovered from disk rather than listed in an array, so adding a component means putting
its files where the convention expects them. There is no manifest to forget to update, and a test
fails if a component directory and its registry entry disagree.

`rewrite-imports.ts` is the part that makes a copied component standalone. Package-internal imports
like `../../cn.js` are not resolvable once the file lands in someone else's `components/ui/`, so they
are rewritten to the consumer's alias form on the way out.

CI asserts that what the registry emits for a component is byte-identical to the package source. The
two distribution paths are one source, and that check is what keeps it true.

## The shelved `usva add`

`src/usva.ts` implements a `usva add <name>` command that fetches a registry entry and writes its
files. It works. It is not published, and the package stays `private: true`.

The reason is that `npx shadcn add https://usva.build/r/button.json` already does this, against a
registry format usva. deliberately conforms to. Shipping a second CLI would mean asking people to
learn a tool to get a worse version of a workflow they already have, and then maintaining its flags,
its config resolution and its update path forever.

It survives in the tree because the registry format is usva's to keep compatible, not shadcn's. If
that compatibility ever breaks, or if usva. needs an install step shadcn's format cannot express, this
is the starting point rather than a blank file. Until one of those is true, it stays unpublished.

If you are reading this because you wanted a `usva` command: use `npx shadcn add`. That is the
supported path, not a fallback.
