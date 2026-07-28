import type { HLJSApi, Language, Mode } from "highlight.js";
import typescript from "highlight.js/lib/languages/typescript";

export function tsx(hljs: HLJSApi): Language {
  const base = typescript(hljs);
  const contains = base.contains as Mode[];

  for (const node of findXmlHandoffs(contains)) {
    if (Object.isFrozen(node)) {
      throw new Error(
        "highlight.js froze the JSX hand-off before tsx() could rewrite it.",
      );
    }
    for (const key of Object.keys(node)) delete node[key as keyof Mode];
    node.variants = jsxModes(base.keywords, contains);
  }

  return {
    ...base,
    name: "TSX",
    aliases: ["tsx", "jsx"],
    contains: [...jsxModes(base.keywords, contains), ...contains],
  };
}

function jsxModes(keywords: unknown, contains: Mode[]): Mode[] {
  const expression: Mode = {
    begin: /\{/,
    end: /\}/,
    keywords: keywords as Mode["keywords"],
    contains: [],
  };

  const OPEN = /(?:(?<![\w$)\]])<|<\/)/;
  const AFTER = /(?=\s*\/?>|\s+[A-Za-z_$])/;

  const tag = (name: RegExp, scope: string): Mode => ({
    begin: [OPEN, name, AFTER],
    beginScope: { 2: scope },
    end: /\/?>/,
    contains: [
      { scope: "attr", begin: /[A-Za-z_$][\w$]*(?:-[\w$]+)*(?=\s*=)/ },
      { scope: "string", begin: /"/, end: /"/ },
      { scope: "string", begin: /'/, end: /'/ },
      expression,
    ],
  });

  const jsx: Mode[] = [
    { begin: /(?:(?<![\w$)\]])<|<\/)>/ },
    tag(/[A-Z][\w.$]*/, "title.class"),
    tag(/[a-z][\w.]*(?:-[\w.]+)*/, "name"),
  ];

  expression.contains = [...jsx, "self", ...contains];
  return jsx;
}

function findXmlHandoffs(modes: Mode[]): Mode[] {
  const seen = new Set<Mode>();
  const found: Mode[] = [];

  const walk = (mode: Mode) => {
    if (seen.has(mode)) return;
    seen.add(mode);
    if (mode.subLanguage === "xml" && mode.end === undefined) found.push(mode);
    for (const child of mode.contains ?? []) {
      if (typeof child !== "string") walk(child as Mode);
    }
    for (const child of mode.variants ?? []) walk(child);
    if (mode.starts) walk(mode.starts);
  };

  for (const mode of modes) walk(mode);
  return found;
}
