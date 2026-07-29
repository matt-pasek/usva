import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";
import { describe, expect, it } from "vitest";
import { tsx } from "./tsx-grammar.js";

const hl = hljs.newInstance();
hl.registerLanguage("typescript", typescript);
hl.registerLanguage("javascript", javascript);
hl.registerLanguage("xml", xml);
hl.registerLanguage("tsx", tsx);

const render = (code: string, language = "tsx") =>
  hl.highlight(code, { language }).value;

const scopesOf = (html: string) =>
  [...html.matchAll(/<span class="hljs-([a-z_ .-]+)">/g)].map((m) => m[1]);

function balance(html: string) {
  let depth = 0;
  let min = 0;
  for (const m of html.matchAll(/<span class="[^"]+">|<\/span>/g)) {
    depth += m[0].startsWith("</") ? -1 : 1;
    min = Math.min(min, depth);
  }
  return { depth, min };
}

const JSX_WITH_ELEMENT_ATTR = `<header className="fixed top-0">
  <SulaNav
    linkComponent={Link}
    brand={<span>acme</span>}
    brandLabel="acme home"
    activeView={view}
  />
</header>`;

describe("tsx grammar", () => {
  it("keeps highlighting attributes after an element-valued one", () => {
    const html = render(JSX_WITH_ELEMENT_ATTR);
    for (const attr of ["linkComponent", "brand", "brandLabel", "activeView"]) {
      expect(html).toContain(`<span class="hljs-attr">${attr}</span>`);
    }
  });

  it("scopes both halves of an inline element in an attribute", () => {
    const html = render(JSX_WITH_ELEMENT_ATTR);
    expect(html.match(/<span class="hljs-name">span<\/span>/g)).toHaveLength(2);
  });

  it("names components apart from host elements", () => {
    const html = render(JSX_WITH_ELEMENT_ATTR);
    expect(html).toContain('<span class="hljs-title class_">SulaNav</span>');
    expect(html).toContain('<span class="hljs-name">header</span>');
  });

  it.each([
    "const [v, setV] = useState<string>('a');",
    "const r = React.forwardRef<HTMLDivElement, Props>(fn);",
    "type M = Map<string, Array<number>>;",
    "if (a < b && c) return;",
    "for (let i = 0; i < n; i++) {}",
    "const ok = x < y ? p : q;",
    "export function f(blob: Blob, progress: number): Blob {",
    "/* the spring's overshoot */\nconst fall = c1Settle(t, 0.1);",
  ])("matches stock typescript on %j", (code) => {
    expect(render(code)).toBe(render(code, "typescript"));
  });

  it("does not let a comment apostrophe open a string", () => {
    const html = render(
      "const a = 1;\n/* the spring's overshoot */\nconst b = 2;",
    );
    expect(scopesOf(html)).toEqual([
      "keyword",
      "number",
      "comment",
      "keyword",
      "number",
    ]);
  });

  it("closes every span it opens", () => {
    for (const code of [JSX_WITH_ELEMENT_ATTR, "const a = 1;", "<>{x}</>"]) {
      expect(balance(render(code))).toEqual({ depth: 0, min: 0 });
    }
  });

  it.each([
    ["bare", JSX_WITH_ELEMENT_ATTR],
    [
      "after an import",
      `import Link from "next/link";\n\n${JSX_WITH_ELEMENT_ATTR}`,
    ],
    ["after a statement", `const a = 1;\n\n${JSX_WITH_ELEMENT_ATTR}`],
    [
      "inside a return",
      `function C() {\n  return (\n${JSX_WITH_ELEMENT_ATTR}\n  );\n}`,
    ],
    ["in an arrow body", `const C = () => ${JSX_WITH_ELEMENT_ATTR};`],
  ])("scopes attributes when the JSX is %s", (_, code) => {
    const html = render(code);
    expect(html).toContain('<span class="hljs-attr">brandLabel</span>');
    expect(html).toContain('<span class="hljs-attr">activeView</span>');
  });

  it("never raises an internal highlight.js error", () => {
    for (const code of [
      JSX_WITH_ELEMENT_ATTR,
      `const a = 1;\n\n${JSX_WITH_ELEMENT_ATTR}`,
      'const C = () => <a><b><c d={<e/>} f="g" /></b></a>;',
      "const a = 1;",
    ]) {
      const result = hl.highlight(code, { language: "tsx" }) as {
        illegal: boolean;
        errorRaised?: Error;
      };
      expect(result.errorRaised).toBeUndefined();
      expect(result.illegal).toBe(false);
    }
  });

  it("leaves the xml grammar alone for html snippets", () => {
    const html = render('<!-- hi -->\n<div class="a">x</div>', "xml");
    expect(html).toContain(
      '<span class="hljs-comment">&lt;!-- hi --&gt;</span>',
    );
    expect(html).toContain('<span class="hljs-name">div</span>');
  });

  it("claims the tsx and jsx aliases", () => {
    expect(hl.getLanguage("tsx")?.name).toBe("TSX");
    expect(hl.getLanguage("jsx")?.name).toBe("TSX");
  });
});
