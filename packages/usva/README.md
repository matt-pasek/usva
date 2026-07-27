# @matt-pasek/usva

The components. A React design language in three themes, where kajo is atmospheric and dark, sisu is
dense and quick, and savi is the light ground. One token vocabulary under all three.

Docs and live demos: **[usva.build](https://usva.build)**.

```sh
bun add @matt-pasek/usva @matt-pasek/usva-tokens
```

React 18 or 19. Tailwind v4. `@matt-pasek/usva-tokens` is not optional; it holds every value the
components resolve against.

## Setup

In your global stylesheet:

```css
@import "tailwindcss";
@import "@matt-pasek/usva-tokens/theme.css";
@import "@matt-pasek/usva-tokens/themes/kajo.css";
@import "@matt-pasek/usva-tokens/roles-safelist.css";

@source "../node_modules/@matt-pasek/usva/dist/**/*.js";
```

**The `@source` line is the one people miss.** Tailwind v4 only generates classes it has seen in a
file it scanned, and it does not scan `node_modules` on its own. Leave it out and any class used
only inside usva's own components is never emitted. What you get is overlays that render at the top
of the document flow instead of centred, in dev and in production, with a build that passes. A
missing class is not a compile error, so nothing catches this but your eyes.

Point the glob at wherever your package manager actually put the package. The path above is the
common case; pnpm's default store and monorepo workspaces both put it elsewhere.

## Importing

Import from a component's own path. The package root exists, but reaching through it pulls the whole
graph, including `motion` and `ogl`, into anything that touches one badge.

```tsx
import { Button } from "@matt-pasek/usva/primitives/button";
import { StatCard } from "@matt-pasek/usva/patterns/stat-card";
import { cn } from "@matt-pasek/usva/cn";
```

Every component is its own subpath export, in one of five layers:

| layer | count | what it is |
|---|---|---|
| `primitives/*` | 36 | button, input, dialog, select, toast, knob, slider, tabs, and the rest of the vocabulary. |
| `patterns/*` | 27 | compositions that recur: stat cards, page headers, empty states, bento grids. |
| `atmospheres/*` | 8 | backgrounds that carry a mood. Some are WebGL, all degrade. |
| `sula/*` | 6 | the fluid surfaces. One per region of the page, never two. |
| `motion/*` | 2 | reveal on scroll, and page transitions. |

`cn` has its own entry so it stays free of the `"use client"` boundary and can be called from a
server component.

## An example

```tsx
"use client";
import { Button, type ButtonStatus } from "@matt-pasek/usva/primitives/button";
import { Card } from "@matt-pasek/usva/primitives/card";
import * as React from "react";

export function SaveCard({ save }: { save: () => Promise<void> }) {
  const [status, setStatus] = React.useState<ButtonStatus>("idle");

  return (
    <Card surface="flat">
      <p className="text-muted">Changes apply to every environment.</p>
      <Button
        status={status}
        successText="Saved"
        errorText="Try again"
        onClick={async () => {
          setStatus("loading");
          try {
            await save();
            setStatus("success");
          } catch {
            setStatus("error");
          }
        }}
      >
        Save
      </Button>
    </Card>
  );
}
```

`status` is yours to drive, not something the button infers from a promise. Loading is not disabled.
The button carries `aria-busy` and stays focusable, because a disabled control drops out of the tab
order and stops announcing itself at the moment the user most wants to know what is happening.
`success` and `error` are momentary: they hold for `settleDelay` (1200ms) and settle back to idle.

`surface` is the shared vocabulary across every card-like thing in the system. `elevated` is the
default lit surface, `flat` is the dashboard workhorse, `outline` is carried by its border alone, and
`glass` is a rare deliberate choice rather than a default.

## Theming

Set `data-theme` on any element, not only on `<html>`. Every colour role is remapped inside that
subtree, so a dashboard panel can run sisu while the page around it runs kajo.

```tsx
<section data-theme="sisu">…</section>
```

Timing is part of a theme, not a constant. kajo is languid at 220ms, sisu is quick at 160ms, savi
sits at 200ms. Anything that quotes one duration scale for the whole system has the wrong model.

Roles, not colours: `bg-surface`, `text-muted`, `border-border`, `text-accent`. There are 24 of them,
and retheming never means touching a component.

## Accessibility

Overlay primitives are built on [Base UI](https://base-ui.com), so focus trapping, dismissal and
keyboard behaviour are the library's contract rather than yours. Almost every component carries a
`jest-axe` assertion in CI (70 test files of 75), and anything that animates checks
`prefers-reduced-motion` before it moves.

`faint` is decorative and never carries information. Anything meant to be read is `muted` or
stronger, which clears AA.

## Copy the source instead

Any component can be pulled into your own repo rather than installed:

```sh
npx shadcn add https://usva.build/r/button.json
```

Same source. It is generated from this package and CI asserts the two are byte-identical, so the
copy is not a fork that drifted. Choose per component; mixing the two is the intended use.

## License

MIT with the Commons Clause. Ship it inside your product, commercially or not. Do not sell the
components themselves, alone or bundled or ported. See `LICENSE.md`.
