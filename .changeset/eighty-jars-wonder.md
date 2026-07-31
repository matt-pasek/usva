---
"@usva-ui/react": patch
---

Fix `RevealGroup` leaving its children invisible below the fold.

The group held the variant labels and relied on them propagating to the child
wrappers. Measured in a browser, the label never arrived: the group reached its
shown state with every child still hidden, so a group that armed stayed at opacity
zero permanently and the content under it was blank. Each child now animates itself
off one shared observer, with the cascade as an index delay.

Only groups that armed were affected, which needs the element below the fold at
mount. The unarmed path renders children raw, so anything in view at mount was
always correct.
