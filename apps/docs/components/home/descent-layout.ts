import { byLayer } from "@/lib/catalog";
import { LEXICON } from "@/lib/lexicon";

const LAYOUT: Record<string, { x: number; y: number; drift: number }> = {
  kajastus: { x: 50, y: 8, drift: 0 },
  utu: { x: 16, y: 24, drift: 1.6 },
  kynnos: { x: 81, y: 26, drift: 0.8 },
  kuulto: { x: 24, y: 50, drift: 2.9 },
  hehku: { x: 55, y: 44, drift: 2.1 },
  loimu: { x: 79, y: 66, drift: 3.7 },
  vare: { x: 38, y: 86, drift: 1.2 },
  routa: { x: 66, y: 90, drift: 2.4 },
};

export const ATMOSPHERE_LINKS = byLayer("atmosphere").map((entry) => {
  const word = entry.name.toLowerCase();
  const lexeme = LEXICON.find((item) => item.word === word);
  const place = LAYOUT[entry.slug];

  if (!lexeme) throw new Error(`atmosphere "${entry.slug}" has no lexeme`);
  if (!place) {
    throw new Error(`atmosphere "${entry.slug}" has no constellation position`);
  }

  return { slug: entry.slug, word, descriptor: lexeme.labels, ...place };
});
