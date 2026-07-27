---
"@matt-pasek/usva": major
"@matt-pasek/usva-tokens": major
---

first public release.

a React design language in three themes: kajo is atmospheric and dark, sisu is dense and quick, savi
is the light ground. one vocabulary of semantic roles sits under all three, so a surface moves
between them without becoming a different system, and a theme carries its own timing rather than
only its own palette.

`@matt-pasek/usva` ships 79 components across five layers, every one of them a subpath export so
importing a badge does not drag the motion library in behind it. `@matt-pasek/usva-tokens` ships the
roles, the three themes, and the DTCG and Tokens Studio exports that carry the same values into
Figma.

every component is available twice: installed from npm, or copied into your own repo through the
shadcn registry at usva.build. the registry source is generated from the same code that builds the
package, so the two cannot drift.
