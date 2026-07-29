# usva-tokens

The token layer: semantic roles, the three themes, and the exports that carry the same values into
Figma. Installed on its own if you want usva's vocabulary without its components, and required
alongside [`usva`](https://www.npmjs.com/package/usva) if you want both.

```sh
bun add usva-tokens
```

Tailwind v4, which needs no plugin or preset. Import the CSS and the roles become utilities:

```css
@import "tailwindcss";
@import "usva-tokens/theme.css";
@import "usva-tokens/themes/kajo.css";
@import "usva-tokens/roles-safelist.css";
```

`theme.css` maps the roles onto Tailwind's `@theme` layer. Each theme file supplies the values, and
you import only the ones you ship. From there it is `bg-surface`, `text-muted`, `border-border`, and
`data-theme="sisu"` on any element to reroute the lot inside that subtree.

Docs: **[usva.build/design-language/tokens](https://usva.build/design-language/tokens)**.

## Where a value lives

Role **names** are TypeScript (`src/roles.ts`). Role **values** are CSS, and only CSS
(`themes/kajo.css`, `themes/sisu.css`, `themes/savi.css`). Nothing else holds a colour. The Figma
exports read those files at build time rather than keeping a second copy, so there is no version of
the palette that can drift from the one you edit.

Two roles are deliberately defined by savi alone. A light ground needs its own foreground on the
sunken well (`on-sunken`) and on the accent tint (`on-tint`); the dark themes omit them and fall back
to `ink` and `accent`, which is what `theme.css` encodes in its `var()` chains and what the exporter
reproduces.

## Building

```sh
bun run build
```

Emits, alongside the JS bundle:

| file | what it is |
|---|---|
| `dist/tokens.dtcg.json` | W3C DTCG. Scales at the top level, then a `theme` group per theme carrying all 24 colour roles and the four duration tiers. |
| `dist/tokens.studio.json` | Tokens Studio format. This is the one Figma actually eats. |
| `dist/roles-safelist.css` | Tailwind safelist for the role utilities. |

## Getting the tokens into Figma

Figma has no native DTCG import, and its Variables REST API is Enterprise-only, so the working path
is the **Tokens Studio** plugin. The sync is manual and deliberately so: a designer pulls when they
want to, rather than having a build overwrite their file.

1. Run `bun run build` in this package. The artefact is `dist/tokens.studio.json`.
2. In Figma, open the **Tokens Studio for Figma** plugin.
3. Choose **Import** and load `tokens.studio.json` (drag it in, or point the plugin at the file).
4. The plugin will show four token sets: `core`, `kajo`, `sisu`, `savi`.
5. Open the **Themes** tab. Three themes are pre-declared, each enabling `core` plus its own set.
6. Hit **Create Variables** (or **Update Variables** on a later sync). Each theme becomes a Figma
   variable **mode**, so switching a frame between kajo, sisu and savi restyles it wholesale.

`core` carries what every theme shares (radius, spacing, type scale). The per-theme sets carry the
colours, the fonts, and the duration tiers.

### What is intentionally not exported

Shadows, glows, gradients, the focus ring and the easing curves. They are built out of `color-mix()`
and multi-layer CSS that has no Figma equivalent, and a lossy approximation in a designer's file is
worse than an honest absence: it would look like the truth while quietly disagreeing with the code.
Rebuild those in Figma as styles if you need them.

### Durations really are per theme

kajo is languid (220ms base), sisu is quick (160ms), savi is the baseline (200ms). The export keeps
them separate. Anything quoting one flat duration scale for the whole system is wrong.
