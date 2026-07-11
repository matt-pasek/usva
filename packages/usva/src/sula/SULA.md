# sula

sula is the fluid part of usva. Finnish for molten, for something that melts. It is the family of
components painted by a live WebGL field, where the parts merge, neck, pinch off and settle like
drops of water instead of sliding around as rigid boxes. SulaNav was the first of them.

This is the specification for the family: what makes a component sula, how the fluid behaves, and the
rules any new one holds to. The motion is defined once in `sula-motion` and the rendering in
`sula-core`, so every member moves and looks like the same material.

## The family

Three components today, on two shared modules.

- SulaNav, a liquid-glass navigation bar whose parts merge and separate as you move between views.
- SulaSegmented, a segmented control whose indicator pinches a droplet off the old segment and merges
  it into the new one. This is the brand-surface segmented control; the plain `SegmentedControl` is
  the one for dense UI.
- SulaFab, a floating action button whose actions emerge as liquid beads and pinch back on close.

`sula-motion` holds the springs, curves and energy, how things move. `sula-core` holds the geometry,
shader, field and the `emergeDroplet` primitive, what things are made of and how they are drawn. A
component is its own phase logic on top of the two. Nothing invents its own physics.

## When to use it

Liquid motion is expensive attention. It pulls the eye on purpose, so it belongs only where you want
the eye pulled. usva draws this line already: expressive motion is licensed on the brand surfaces and
nowhere else, and sula is that motion made into components.

Reach for it on a wow beat. A primary nav, a hero, an enter or exit, a moment meant to be felt. One
sula surface per view, at most. Two liquid fields in the same viewport compete and read as noise.

Keep it out of dense, task-bound UI. Not a table, not a form, not a dashboard where someone is trying
to get work done. kajo leans into sula. sisu uses it once, if at all.

## The material

A sula component is one distance field. Every part is a blob, a rounded box with a centre,
half-extents and a corner radius. Parts join through necks, capsules that the field's smooth-min
bends into concave, surface-tension curves. Merging and separating are the same operation run in two
directions.

Adjacent parts hold a gentle surface-tension neck at rest. A sula surface reads as parts pulling
toward each other, not as boxes floating separately. This rest neck is a thin floor, not a fusing:
it never thickens into one continuous slab, it only keeps a faint pull between neighbours that are
within bridge reach.

The content lives in real DOM on top of the field, never painted in WebGL. Text stays crisp HTML,
hit targets are real elements, tab order is native, and any hidden part is `inert`. The field is
glass and light. It carries no meaning on its own, so the component stays usable with the field
switched off entirely.

## The motion

sula motion is defined by four rules. A component that follows them moves like sula; one that
improvises its own physics does not.

Springs share a frequency band. The reveal springs, `barSpring` and `sideSpring`, sit in one
natural-frequency band, `sqrt(stiffness / mass)` around 4.8 to 5.8 rad/s, so neighbouring parts read
as one mass. `switchSpring` runs quicker, because a view switch should resolve faster than the
opening reveal. Retuning stays inside the band. Damping sets the bounce, not a second keyframe: these
run underdamped near a 0.68 ratio, a single soft dip of about 5% overshoot.

Settles cross the line still moving. A part that eases to a stop at its rest line and then bounces on
a separate term visibly hitches for a frame. So every sula settle runs through `c1Settle`, which
reaches the rest line exactly when the spring does and carries the overshoot straight through as one
motion. It takes the raw spring value. Position may overshoot the line; size may not, because a blob
wider than its DOM box paints glass out from under the text.

Liveliness is measured, not promised. A spring reports finished about a second after the field looks
still, so the merge radius and the surface motion scale with `createEnergyTracker()` instead, which
reads speed per frame and parks the field the moment motion stops. The surface motion is a pair of
long travelling waves, not value noise: the edge bends in slow coherent runs so a moving part reads
as flowing glass rather than a grainy coastline, and the waves are measured in CSS pixels so the
wavelength holds the same on standard and retina displays. At rest a sula field is a calm sheet of
glass: fully still, not animated, but carrying a faint standing tension between neighbours where the
rest necks hold.

The field reacts to the pointer. Hovering a part sends a broad wave across the surface that follows
the cursor, with an elliptical falloff around the live pointer position so the pull is strongest
under the cursor and dies out before it reaches a neighbour. The pointer position is eased on the
CPU, so a quick cursor move pushes a responsive wave through the glass instead of teleporting the
deformation. The hover rides its own small set of uniforms (the eased point, its spread, and an
amount that fades in and out) separate from the settle motion, and parks once the pointer leaves.

Bridges melt, they do not snap. A neck's visible width comes from the merge radius, not its own `r`,
so a bridge cannot be thinned away, and dropping a neck would snap a full-width bar off in one frame.
A bridge dissolves instead by fading its `strength` toward 0, which recedes it from the surface
inward.

## The constraints

Every sula component holds to these, because a liquid surface that breaks them is worse than a plain
one.

- Reduced motion turns it off. `prefers-reduced-motion` drops the component to a static, instant
  equivalent. The animation is decoration over a UI that already works without it.
- Interaction never waits on the field. Clicks and keys land immediately; the liquid is
  interruptible and cosmetic.
- One GL context per component, with bounded blobs and necks. Array uniforms are plain `number[]`,
  since ogl uploads nothing for a typed array. The field is anchored to its component and parks
  itself at rest.

## Anatomy

Every sula component has the same shape. Real DOM parts sit on top, measured at their CSS rest
position. A WebGL field paints the glass behind them. Each frame a phase function turns a scalar
timeline into blob geometry, the DOM parts take an inline transform to match, and the field draws.
Springs, curves and energy come from `sula-motion`; the geometry, shader, field and `emergeDroplet`
come from `sula-core`. Nothing invents its own.

In the registry a sula component declares both `sula-motion` and `sula-core` in
`registryDependencies`, so anyone who copies it in pulls the shared modules and inherits the same
springs and field as the rest of the family.
