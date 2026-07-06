# Product

## Register

product

`product` is the default. It governs everything the package ships: primitives, patterns, component anatomy, and the component demo pages under `/docs/components/*`. These serve a task. Familiarity is a feature; the tool should disappear into the work.

`brand` governs the docs marketing surfaces only: `/` and `/design-language`. There the design *is* the product, because the site's job is to prove the design language is worth adopting. Expressive motion, atmosphere, and display typography are licensed here and nowhere else.

When a surface is ambiguous, ask. Do not let brand energy leak into component demos, and do not let product restraint flatten the landing page.

## Users

Three distinct consumption paths, with different needs from the same source:

**The installer.** Adds `@matt-pasek/usva` and `@matt-pasek/usva-tokens` as dependencies and lets `bun update` carry fixes forward. Wants a stable prop API, honest TypeScript types, and semantic role tokens they can retheme without forking. Never reads the component source. Breaking a prop name costs them real time.

**The copy-forker.** Runs `npx shadcn add https://usva.dev/r/<name>.json` or `usva add` and owns the source from that moment. Reads every line. Wants code that explains itself, no clever indirection, no dependency on private internals. Their first act is often to change one thing; the component must survive that.

**The evaluator.** Lands on the docs site from a link or search, and decides in under a minute whether this system is credible. Reads the rendered example, the source view, and the install block, in that order. Never installs anything.

Behind all three sit the two real consumers that keep the system honest, pulling in opposite directions:

- **personal-website** (kajo theme): presentational, dark, expressive. The *beauty* pole. Governance source of truth: when it conflicts with anything, it wins.
- **sisu-plus** (sisu theme): a browser-extension dashboard. Dense, task-bound, quiet. The *usability* pole. A tweaked instance of the same principles, never a divergent direction.

The thesis is the tension between them: **beauty that stays usable.**

## Product Purpose

usva is an authored design system, design language, token package, component library, registry, and documentation site. Its job is to turn existing strong UI work from the author's projects into reusable public primitives and patterns without flattening the personality that made those interfaces worth extracting.

It is extracted, not invented. Every component earns its place by already working in a live consumer. Scope is consumer-*driven* but not consumer-*limited*: gaps in the design language get filled even where the two apps don't yet exercise them.

Success means:

- The three themes (kajo, sisu, savi) read as one system at different energies, not three systems sharing a prefix.
- Components ship reusable APIs rather than one-off compositions lifted verbatim from a consumer.
- The registry source and the package source never drift; CI asserts byte-identity.
- A consumer can retheme via role tokens without touching component internals or breaking the visual grammar.
- The docs explain *why* a choice was made, not merely that it exists.

## Brand Personality

Precise, luminous, grounded. The system should feel lit, tactile, and alive without becoming decorative noise. Green is the shared living signal; stronger violet energy belongs to the more expressive theme, while quieter themes should feel like purposeful extensions of the same system.

The signature idea, inherited from the source brand: the gap between *working* and *right*. The 20ms animation that changes everything. Things that feel right, not just things that work.

### Voice & Tone

Canonical articulation lives in `docs/superpowers/personal_design_system/readme.md`. The rules that govern usva's own copy:

- **First person, lowercase-leaning, confident but unshowy.** Write as *I*, to *you*. State a belief, then earn it.
- **Short, declarative, a little wry.** Fragments are allowed for rhythm. "Real codebases, real clients, real stakes."
- **Plain-spoken craft pride, never corporate.** No buzzwords, no "seamless", no "enterprise-grade".
- **Casing:** display headlines sentence case; the wordmark and mono labels lowercase ("selected work", "the short version"). Section indices are zero-padded mono (`01`, `02`). Tags are UPPERCASE mono.
- **No emoji.** Unicode glyphs as punctuation and affordance: `→ ↗ ↳ · > " "`. The green period after "usva." is a motif, not decoration.
- **Accent words get color, not bold.** Tint the key phrase violet or green inline.
- **Numbers stay honest.** No invented stats, no rounded-up claims.

For component docs specifically: say what the variant is for, and say what it is *not* for. The prohibition is often the more useful sentence.

## Anti-references

**Named anti-references.** Study what each gets wrong, then do the opposite:

- **shadcn/ui sameness.** usva deliberately shares its distribution mechanism (registry, copy-in source) and must not converge on its look: over-rounded corners, low-contrast neutrals, and the everyone-ships-the-same-landing-page aesthetic. Same pipes, different water.
- **MUI / Chakra genericism.** Kitchen-sink prop APIs, theme objects nobody reads, components with no point of view. The "assembled, not authored" failure.

**Named positive references.** Borrow the specific quality, not the surface:

- **Radix / Base UI** for *component anatomy* and the accessibility contract: the slot and part vocabulary, headless correctness, keyboard behavior treated as an API. Reject their visual neutrality; usva has opinions.
- **Linear / Vercel Geist** for *restraint with one confident signal*: dense, trustworthy product surfaces where accent color marks state and nothing else. This is the sisu pole.
- **React Bits / originkit.dev** for *motion ambition*: proof that a component library can carry real visual effects without feeling like a toy. Take the ceiling, not the code. React Bits Pro material is licensed and must never be vendored into this MIT repo or its public registry; Pro-derived work stays in the private package.

**Pattern-level bans** (on top of the shared absolute bans):

- Side-stripe alert and card accents.
- Gradient text.
- Reflexive eyebrow scaffolding above every section.
- Ghost-card border plus wide diffuse shadow, together.
- Glassmorphism as a default rather than a purposeful, rare choice.
- Theme-specific API names (`accent-dev`, `portfolio-*`) that reduce portability. Role names stay generic (`accent-alt`); the identifier is `kajo`, never "portfolio".

## Design Principles

1. **Authored, not assembled.** Components should explain the author's choices instead of hiding behind generic defaults.
2. **One grammar, three registers.** Themes may change energy, density, and warmth, but share the same token roles, interaction rules, motion vocabulary, and component anatomy.
3. **Reusable before impressive.** Migrated components must be depersonalized into props, slots, and role tokens before being showcased.
4. **Coherence beats proliferation.** Fold near-duplicates into existing primitives and patterns when a variant or composition is enough.
5. **The docs are the product surface.** Examples, source views, install blocks, and theme switching need the same craft as the package.
6. **personal-website wins.** When kajo and sisu genuinely conflict, stop and escalate rather than silently picking a winner. Record the resolution; sisu aligns to usva, not the reverse.

## Accessibility & Inclusion

Target WCAG AA for text, focus visibility, keyboard operation, and reduced-motion behavior.

- **Text tiers.** `ink` and `muted` are AA-safe for informational text. `faint` is decorative only and must never carry meaning. Placeholder text meets the same 4.5:1 bar as body text, not the muted-gray default.
- **Focus.** Every interactive element has a visible focus ring drawn from `--usva-focus`. Focus is never suppressed without an equivalent replacement.
- **State completeness.** Every interactive component ships default, hover, focus, active, disabled, loading, and error. Half a set is a bug.
- **Motion.** Must convey state or spatial continuity, respect `prefers-reduced-motion`, and never gate content visibility. Reveal animations enhance an already-visible default; a headless renderer or a background tab must still show the content.
- **Color independence.** The two-accent system signals meaning, but never *only* through hue. Pair color with text, icon, or position.
