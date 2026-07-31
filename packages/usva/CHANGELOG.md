# @usva-ui/react

## 1.0.4

### Patch Changes

- e05fd52: Fix `RevealGroup` leaving its children invisible below the fold.

  The group held the variant labels and relied on them propagating to the child
  wrappers. Measured in a browser, the label never arrived: the group reached its
  shown state with every child still hidden, so a group that armed stayed at opacity
  zero permanently and the content under it was blank. Each child now animates itself
  off one shared observer, with the cascade as an index delay.

  Only groups that armed were affected, which needs the element below the fold at
  mount. The unarmed path renders children raw, so anything in view at mount was
  always correct.

## 1.0.3

### Patch Changes

- 907ba95: SulaNav: let the settle bounce ease into its budget instead of stopping dead on it.

  A part close enough to the bar to hold a bridge may only overshoot as far as the
  bridge has slack left, and that cap was applied by clamping. The pill hit the limit
  at full speed and sat motionless on it for the rest of the settle, which reads as a
  wall rather than a spring. The cap is now approached asymptotically, so the turn
  decelerates and the bridge is protected exactly as before. Parts resting beyond the
  bridge's reach, satellites among them, are unchanged.

- 907ba95: SulaNav: reach every view from the collapsed menu.

  Below `collapseBelow` the panel only ever listed the active view's items, so on a
  phone every other view was unreachable. The panel now carries a view switcher and
  resizes fluidly between them, reopening on whichever view you are actually in.

## 1.0.2

### Patch Changes

- 4cec6b5: Pin the `@usva-ui/tokens` dependency to a published range instead of `workspace:*`.

  npm publishes the manifest verbatim, so 1.0.0 and 1.0.1 both reached the registry
  carrying the workspace protocol and every install failed with
  `EUNSUPPORTEDPROTOCOL: Unsupported URL Type "workspace:"`. Installing the package
  now resolves tokens normally.

## 1.0.1

### Patch Changes

- c84eebf: Describe both packages properly on npm. Neither carried a `description` or `keywords`, so the
  registry fell back to scraping the opening paragraph of the README, and the tokens listing rendered
  a link to the bare `usva` name that no longer resolves. Both now declare their own description and
  keywords, and every link points at the scoped package.

  No runtime change: the exports, the types and the built output are identical to 1.0.0.

- Updated dependencies [c84eebf]
  - @usva-ui/tokens@1.0.1

## 1.0.0

### Major Changes

- 69954aa: first public release.

  a React design language in three themes: kajo is atmospheric and dark, sisu is dense and quick, savi
  is the light ground. one vocabulary of semantic roles sits under all three, so a surface moves
  between them without becoming a different system, and a theme carries its own timing rather than
  only its own palette.

  `@usva-ui/react` ships 79 components across five layers, every one of them a subpath export so
  importing a badge does not drag the motion library in behind it. `@usva-ui/tokens` ships the
  roles, the three themes, and the DTCG and Tokens Studio exports that carry the same values into
  Figma.

  every component is available twice: installed from npm, or copied into your own repo through the
  shadcn registry at usva.build. the registry source is generated from the same code that builds the
  package, so the two cannot drift.

### Patch Changes

- Updated dependencies [69954aa]
  - @usva-ui/tokens@1.0.0
