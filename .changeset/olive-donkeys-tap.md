---
"@usva-ui/react": patch
"@usva-ui/tokens": patch
---

Describe both packages properly on npm. Neither carried a `description` or `keywords`, so the
registry fell back to scraping the opening paragraph of the README, and the tokens listing rendered
a link to the bare `usva` name that no longer resolves. Both now declare their own description and
keywords, and every link points at the scoped package.

No runtime change: the exports, the types and the built output are identical to 1.0.0.
