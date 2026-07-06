---
name: usva.
description: An authored React design language where three Finnish-named themes share one grammar of light.
colors:
  aurora-violet: "#a78bfa"
  deep-aurora: "#8b5cf6"
  signal-green: "#52c989"
  violet-black: "#0a0613"
  violet-sunken: "#0c0719"
  violet-surface: "#100b1f"
  violet-surface-2: "#181328"
  fog-ink: "#e6e3f2"
  fog-muted: "#8b85a8"
  fog-faint: "#4c4663"
  fog-border: "#221c30"
  fog-border-strong: "#3a3350"
  graphite-black: "#0d0d11"
  graphite-surface: "#15151c"
  graphite-ink: "#ddddf0"
  graphite-muted: "#8282ab"
  clay-bg: "#e7dcc8"
  oat-sunken: "#d6cdb6"
  clay-surface: "#f1ead9"
  espresso-ink: "#33291d"
  coffee-muted: "#635544"
  sage: "#2f6a41"
  deep-sage: "#234f31"
  fired-clay: "#86562e"
  pastel-sage: "#aec2a6"
  success: "#52c989"
  warning: "#e0b341"
  danger: "#e0556b"
  info: "#6ea8fe"
typography:
  display:
    fontFamily: "Fira Sans, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 7vw, 5.5rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Fira Sans, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.03em"
  title:
    fontFamily: "Fira Sans, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Fira Sans, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.75
    letterSpacing: "normal"
  label:
    fontFamily: "Fira Mono, ui-monospace, monospace"
    fontSize: "0.6875rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.18em"
rounded:
  sm: "0.25rem"
  md: "0.5rem"
  lg: "0.75rem"
  xl: "1rem"
  2xl: "1.25rem"
  3xl: "1.5rem"
spacing:
  control-sm: "0.75rem"
  control-md: "1rem"
  control-lg: "1.5rem"
  card: "1.5rem"
  gutter: "clamp(1.5rem, 5vw, 2.5rem)"
  section: "clamp(4.5rem, 11vw, 8.125rem)"
components:
  button-solid:
    backgroundColor: "{colors.aurora-violet}"
    textColor: "{colors.violet-black}"
    rounded: "{rounded.lg}"
    padding: "0 1rem"
    height: "2.5rem"
    typography: "{typography.body}"
  button-solid-hover:
    backgroundColor: "{colors.aurora-violet}"
    textColor: "{colors.violet-black}"
  button-soft:
    backgroundColor: "{colors.violet-surface-2}"
    textColor: "{colors.fog-ink}"
    rounded: "{rounded.lg}"
    padding: "0 1rem"
    height: "2.5rem"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.fog-muted}"
    rounded: "{rounded.lg}"
    padding: "0 1rem"
    height: "2.5rem"
  button-ghost-hover:
    textColor: "{colors.fog-ink}"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.fog-ink}"
    rounded: "{rounded.lg}"
    padding: "0 1rem"
    height: "2.5rem"
  input:
    backgroundColor: "{colors.violet-black}"
    textColor: "{colors.fog-ink}"
    rounded: "{rounded.lg}"
    padding: "0 0.75rem"
    height: "2.5rem"
  card:
    backgroundColor: "{colors.violet-surface}"
    textColor: "{colors.fog-ink}"
    rounded: "{rounded.2xl}"
    padding: "1.5rem"
  chip:
    backgroundColor: "{colors.violet-surface-2}"
    textColor: "{colors.fog-muted}"
    rounded: "{rounded.sm}"
    padding: "0.125rem 0.5rem"
---

# Design System: usva.

## 1. Overview

**Creative North Star: "usva." (Finnish: thick vapor near the ground)**

The names are not decoration; each one is the specification. **usva** is the mist everything sits in: a dark, near-black-violet vapor that is a material, not an absence. **kajo** is the faint gleam on the horizon, the first light of dawn or the last of dusk. **sisu** is stoic determination, the grit that survives a long working session. **savi** is clay, the fine-grained earth you shape with your hands. Read the names and you already know what each surface is for.

That gives the system one physical premise: **there is a light source, and it is above you.** Every visual decision follows from it. Surfaces catch a hairline highlight along their top edge. Shadows fall below. The accent does not fill a shape so much as illuminate it, which is why solid buttons carry an inner-lit gradient rather than a flat swatch, and why glow is spent only on the things that are genuinely live. Colors do not sit on the page; they emerge from it.

The three themes are not skins with equal footing. **kajo is the showpiece**: it exists to be memorable, and it spends light freely. Cinematic 90px ambient shadows, a dual violet-and-green radial wash, a spring easing that overshoots by 4%. **sisu and savi are augmented beauty made digestible**: the same grammar, the same token roles, the same component anatomy, tuned down until it can carry a data-dense dashboard for eight hours without fatiguing anyone. sisu holds its accent glow to near-silence and compresses motion to 120ms. savi moves the whole system into daylight and casts warm-brown shadows instead of black. Neither is a lesser kajo. They are the same instrument played quietly.

This system explicitly rejects the **shadcn/ui sameness** it shares a distribution mechanism with: over-rounded corners, low-contrast neutrals, the everyone-ships-the-same-landing-page look. It rejects **MUI and Chakra genericism**: kitchen-sink prop APIs and components with no point of view. It is authored, not assembled.

**Key Characteristics:**
- One implied overhead light source governs every shadow, rim, and glow.
- Two accents that mean things: violet is the thing being made, green is the thing that is alive.
- Three themes, one grammar. Energy, density and warmth change; token roles, interaction rules, motion vocabulary and component anatomy do not.
- Atmosphere over flat fill: radial washes, gradient hairlines, and pointer-tracked edge light instead of solid blocks.
- Restraint as the mechanism of impact. Glow is rationed so that when it appears it means something.

## 2. Colors: The Aurora Palette

A deep violet-black vapor lit by two accents, one of which is always a statement about state.

### Primary
- **Aurora Violet** (`#a78bfa`): The making. Primary actions, focus rings, selection, the top-right radial wash, the pointer-tracked edge glow. In kajo it is the dominant signal. It marks intent and interactivity, never decoration.
- **Deep Aurora** (`#8b5cf6`): The pressed and weighted register of the same hue. Gradient stops, translucent accent borders (`rgba(139,92,246,.15)`), the low end of the inner-lit button fill.

### Secondary
- **Signal Green** (`#52c989`): The living. Status dots, the `--usva-live` heartbeat, the success role, the bottom-left half of the dual wash, the far end of the edge-glow gradient. In sisu it is promoted to the primary accent, because a dashboard's dominant question is "is this working right now."

### Tertiary (savi only)
- **Sage** (`#2f6a41`) and **Deep Sage** (`#234f31`): The daylight accent. Sage is deliberately dark because it must clear 4.5:1 as text on `clay-surface`. The softer **Pastel Sage** (`#aec2a6`) exists only as a fill and wash tint, and carries its own foreground token because grounding it drops sage below contrast on top of it.
- **Fired Clay** (`#86562e`): savi's second accent, the earth counterpart to Signal Green's position in the dual wash. Dark enough to clear 4.5:1 as text, because it carries ordinal numerals (`EntityIndex`, `StepList`, `FeatureCarousel`), not just washes.

### Neutral
- **Violet Black** (`#0a0613`): kajo's page base. Not pure black; a violet vapor.
- **Violet Sunken** (`#0c0719`) → **Violet Surface** (`#100b1f`) → **Violet Surface 2** (`#181328`): the honest elevation ramp. A well is darker than the page; a raised surface is lighter.
- **Fog Ink** (`#e6e3f2`) → **Fog Muted** (`#8b85a8`) → **Fog Faint** (`#4c4663`): the three text tiers. Ink and Muted are AA-safe for information. Faint is decorative and may never carry meaning.
- **Fog Border** (`#221c30`) / **Fog Border Strong** (`#3a3350`): the resting hairline and its hover state.
- **Graphite Black** (`#0d0d11`) → **Graphite Surface** (`#15151c`), with **Graphite Ink** (`#ddddf0`): sisu's cooler, more neutral vapor. Less violet, more machine.
- **Clay** (`#e7dcc8`) → **Clay Surface** (`#f1ead9`), over **Oat Sunken** (`#d6cdb6`), with **Espresso Ink** (`#33291d`): savi's daylight. Brown is dark orange, so brown lives in the type, not the surfaces; a well up near the top of the lightness scale would read peach.

### Named Rules

**The Two-Accent Rule.** Violet is the thing being made. Green is the thing that is alive right now. A green pulse on something that is not actually live is a lie, and the system's only real superstition. Never use the live pulse decoratively.

**The Rationed Glow Rule.** Accent bloom is a state, not a texture. In kajo it appears on hover, focus, and live elements. In sisu `--usva-glow-accent` is set to `0 0 0 0 transparent` on purpose. If everything glows, nothing is lit.

**The Portable Role Rule.** Tokens are named for their role, never their brand meaning. `accent-alt`, never `accent-dev`. The theme identifier is `kajo`, never "portfolio". A consumer must be able to retheme without renaming.

## 3. Typography

**Display Font:** Fira Sans (with `system-ui`, `sans-serif`)
**Body Font:** Fira Sans (the same family, carrying every role through weight contrast)
**Label/Mono Font:** Fira Mono in kajo and savi; Fira Code in sisu, where ligatures serve code-adjacent dashboard data.

**Character:** One humanist family doing all the work, which is the product register's virtue: no display pairing, no competing voices. Personality comes from extremes of weight (400 body against 800 display) and from very tight display tracking. The mono is not a third voice, it is the system's structural annotation: indices, labels, metadata, the things that describe rather than speak.

### Hierarchy
- **Display** (800, `clamp(2.75rem, 7vw, 5.5rem)`, line-height 1, `-0.04em`): Brand-register surfaces only. The docs home and `/design-language`. Never in product UI.
- **Headline** (700, 1.75rem, line-height 1.2, `-0.03em`): Page and section titles.
- **Title** (600, 1.125rem, line-height 1.35, `-0.02em`): Card headings, dialog titles, component names.
- **Body** (400, 0.9375rem, line-height 1.75): Prose and UI text, capped at 65–75ch. Set in Fog Muted for secondary prose, Fog Ink for anything the reader must not miss.
- **Label** (500, 0.6875rem, `0.18em`, UPPERCASE, mono): Section eyebrows, tags, metadata, zero-padded indices (`01`, `02`).

### Named Rules

**The Tracking Floor Rule.** Display tracking stops at `-0.04em`. Tighter and the letters touch, which reads as cramped, not designed.

**The Faint-Is-Not-Text Rule.** Fog Faint (`#4c4663`) fails AA against every surface in the system, deliberately. It is a hairline, a disabled glyph, a decorative index. The moment it carries information, it is a bug.

**The One-Family Rule.** Fira Sans carries display through label. A second sans would read as indecision. The mono is the only permitted second voice, and only for structural annotation.

## 4. Elevation

Depth is not drawn, it is lit. A single implied light source sits above and slightly in front of every surface, and the entire shadow vocabulary is the consequence. Each level is a three-layer recipe: a tight contact shadow directly beneath the element, a hairline rim ring tracing its edge, and a large diffuse ambient falloff. Every level also bundles an inset top-highlight (`--usva-inset-hairline`), which is the light striking the upper edge of the material. Tonal layering reinforces this rather than replacing it: `sunken < bg < surface < surface-2` in all three themes, so a well is genuinely recessed and a card genuinely stands off the page.

The themes skin the same recipe. kajo runs it cinematic (a 90px ambient bloom, a violet-tinted rim). sisu runs it tight and quiet (a 38px falloff, a near-white rim at 8% opacity). savi casts warm brown rather than black, because a light theme's shadows are the absence of daylight, not the presence of ink.

### Shadow Vocabulary
- **Raised** (`var(--usva-inset-hairline), var(--usva-shadow-raised)`): The resting state of any surface that sits above the page. Cards, solid buttons, panels.
- **Floating** (`var(--usva-inset-hairline), var(--usva-shadow-floating)`): Elements lifted by interaction or intent. Hover states, popovers, sticky toolbars.
- **Overlay** (`var(--usva-inset-hairline), var(--usva-shadow-overlay)`): Anything that escapes the document flow. Dialogs, dropdowns, toasts.
- **Glow Ring** (`var(--usva-glow-ring)`): Not elevation. A crisp accent ring hugging the edge, plus an outer bloom in bold skins. The shared selection and energy idiom.
- **Focus** (`var(--usva-focus)`): Ring, halo, and (in kajo) accent bloom. Applied through `:focus-visible` only.

### Named Rules

**The Lit-From-Above Rule.** One light source, overhead. Every elevation level bundles its own inset top-highlight. A surface with a shadow but no rim highlight is unfinished.

**The Swap-Never-Stack Rule.** State transitions replace one elevation level with another. They never compose two shadows on one element. This is why the system has no `box-shadow` conflicts, and it is not optional: stacking `shadow-raised` and `glow-accent` on the same node breaks the light model.

**The Daylight Casts Brown Rule.** In savi, shadows are `rgba(58,45,32,…)`, never black. A neutral-black shadow on a warm clay surface reads as dirt.

## 5. Components

The feel is **tactile, controlled, quietly alive.** Controls respond to the hand: press scales to `0.96`. Solid fills are inner-lit gradients so they read as a material catching light rather than a flat swatch. Glow is spent on hover, focus, and genuine liveness, nowhere else.

### Buttons
- **Shape:** Gently curved (`0.75rem` / `rounded-lg`); small buttons tighten to `0.5rem`, large relax to `1rem`.
- **Solid:** Aurora Violet under an inner-lit vertical gradient, Violet Black text, semibold, `shadow-raised`. Heights are fixed, not fluid: 2rem / 2.5rem / 3rem for sm / md / lg.
- **Hover / Focus:** Hover swaps `shadow-raised` for `glow-ring` and darkens via a 10%-ink pseudo-element overlay rather than a color change, so the gradient survives. Focus is `ring-focus` on `:focus-visible` only.
- **Active:** `scale(0.96)`, suppressed entirely under `prefers-reduced-motion`.
- **Soft:** Surface-2 fill, Ink text, raised. The workhorse in dense UI.
- **Ghost:** Transparent, Muted text warming to Ink on hover. For toolbars, where six solid buttons would fight.
- **Outline:** Border-only, strengthening to `border-strong` on hover.
- **Disabled:** 50% opacity plus `saturate(0.7)`, because opacity alone leaves the accent looking merely dimmed rather than inert.

### Chips
- **Style:** Surface-2 fill, Muted text, tight `0.25rem` radius. Mono uppercase for tags.
- **State:** Selected chips take `glow-ring`, not a background swap.

### Cards / Containers
- **Corner Style:** Generous (`1.25rem`; feature cards go to `1.5rem`).
- **Surface vocabulary:** One word picks how any card-like surface sits, consistently across Card, StatCard, Panel and Dialog. `elevated` (rim light + surface fill + shadow, the default), `flat` (fill only, the sisu workhorse), `glass` (translucent, blurred, used purposefully and rarely), `outline` (carried by its border alone).
- **Shadow Strategy:** Per the Elevation section. `elevated` and `glass` take their host's shadow; `flat` and `outline` take none.
- **Highlight:** Optional and named: `wash` (radial accent atmosphere), `edge` (a gradient hairline across the top edge), `ring` (accent selection ring). Pointer-tracked border light is a separate thing: see `GlowCard` and `BentoGrid` under Edge Glow.
- **Internal Padding:** `1.5rem`.

### Inputs / Fields
- **Style:** Recessed. Background is the page color (`bg`), not the surface, so the field reads as cut into the material. 1px border, `0.75rem` radius, 2.5rem tall.
- **Focus:** Border goes transparent and `ring-focus` takes over, so the ring is never doubled against a border.
- **Error:** `aria-invalid` drives a danger border and a 40%-opacity danger ring. The attribute is the source of truth, not a prop.
- **Disabled:** `not-allowed` cursor, 50% opacity.
- **Placeholder:** Muted, never Faint. It must clear 4.5:1.

### Navigation
- Mono uppercase labels at 0.6875rem with `0.18em` tracking. Rest state Muted, hover Ink, active carries the accent. Links never underline; they signal through color, gap, and Unicode arrows (`→` `↗`). The floating nav pill is the one sanctioned glassmorphism in the system: `backdrop-blur` over an 82%-opaque dark fill.

### Signature: Edge Glow
The system's most distinctive behavior. A pointer-tracked radial gradient painted onto borders through a `mask-composite: exclude` border-only mask. Because the radius is fixed and the light is positioned in each element's own pixel space, brightness at any point on any border depends only on its distance to the pointer. Two adjacent bento cards meeting at a shared edge therefore light identically along that seam and read as one continuous line, with no per-card unevenness. The gradient runs `accent → live`, which is violet-to-green in kajo and green-to-green in sisu, so the theme picks the hue with no branching. It is removed entirely under `prefers-reduced-motion`.

## 6. Do's and Don'ts

### Do:
- **Do** treat green as a claim of liveness. `--usva-live` and `animate-live-pulse` belong on things that are actually happening right now.
- **Do** swap elevation levels on state change. `shadow-raised` becomes `glow-ring` on hover; it does not gain a second shadow.
- **Do** give every interactive component all seven states: default, hover, focus, active, disabled, loading, error. Half a set is a bug.
- **Do** use fixed rem heights for controls (2rem / 2.5rem / 3rem). Fluid `clamp()` type belongs to display headings on brand surfaces, never to product UI.
- **Do** reach for Fog Muted for secondary prose and Fog Ink for anything load-bearing. Both clear AA.
- **Do** name tokens by role. `accent-alt`, not `accent-dev`. `kajo`, not "portfolio".
- **Do** let savi's brown live in the type. `on-sunken` is espresso; the well itself stays low-chroma oat.
- **Do** keep reveal animations enhancing an already-visible default. A hidden tab or a headless renderer must still show the content.
- **Do** use an inset, fully-rounded stripe as a **categorical color key** when the color encodes data, as `StripeCard` does for course-to-module mapping. It sits inside the card's padding, is `self-stretch` to the content block, and never touches the card's edge or radius. Pair it with a non-color carrier (the mono code, `CS-201`) so the category survives color blindness. This is the sanctioned form; the banned form is the edge-hugging border below.

### Don't:
- **Don't** use `border-left` or `border-right` greater than 1px as a colored accent stripe on cards, alerts, or list items. Named in PRODUCT.md; forbidden here. This bans the *border*: an edge-hugging rule that fights the corner radius and carries no information. It does not ban `StripeCard`'s inset key (see the Do above), which is a different element doing a different job.
- **Don't** apply `background-clip: text` to a gradient. **Gradient text is prohibited.** The accent tints a word by coloring it, not by masking it.
- **Don't** use glassmorphism as a default. It is licensed for the floating nav and overlay badges. Everywhere else it is decorative noise.
- **Don't** combine a ghost-card border with a wide diffuse shadow. Pick one: the surface is either carried by its edge or by its light.
- **Don't** put a tiny uppercase tracked eyebrow above every section. The mono label is a deliberate motif with a job (indices, tags, metadata), not scaffolding.
- **Don't** let Fog Faint (`#4c4663`) carry information. If a user has to read it, it is the wrong token.
- **Don't** stack `shadow-raised` and `glow-accent` on one element. See the Swap-Never-Stack Rule.
- **Don't** pulse, bloom, or glow anything that is not in a state worth announcing. If it looks like a component kit demo reel, the glow budget has been spent on decoration.
- **Don't** let kajo's energy leak into a component demo page, and don't let sisu's restraint flatten the landing page. Register is chosen per surface.
- **Don't** introduce a second sans family. **Don't** ship theme-specific prop names. **Don't** hide a choice behind a generic default; this system is authored, not assembled.
