const CN_SPECIFIER = /from "(?:\.\.\/)+cn\.js"/g;
const RELATIVE_MODULE = /from "\.\.?\/(?:[^"]*\/)?([^/"]+)\.js"/g;

export function rewriteImports(source: string): string {
  return source
    .replace(CN_SPECIFIER, 'from "@/lib/utils"')
    .replace(RELATIVE_MODULE, 'from "./$1"');
}
