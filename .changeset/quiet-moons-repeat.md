---
"@usva-ui/react": patch
---

Pin the `@usva-ui/tokens` dependency to a published range instead of `workspace:*`.

npm publishes the manifest verbatim, so 1.0.0 and 1.0.1 both reached the registry
carrying the workspace protocol and every install failed with
`EUNSUPPORTEDPROTOCOL: Unsupported URL Type "workspace:"`. Installing the package
now resolves tokens normally.
