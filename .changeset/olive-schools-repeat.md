---
"@usva-ui/react": patch
---

SulaNav: reach every view from the collapsed menu.

Below `collapseBelow` the panel only ever listed the active view's items, so on a
phone every other view was unreachable. The panel now carries a view switcher and
resizes fluidly between them, reopening on whichever view you are actually in.
