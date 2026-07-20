/**
 * The names, and what they mean. Every name in usva is a nature or temperament
 * word (Finnish, if you want the source, but that never surfaces in product
 * copy) chosen so the word already behaves like the thing it labels. This is
 * the single source of truth for the glosses; pages read from it.
 *
 * Rule for anything rendered to a user: give the sense and then our reading,
 * as "X is Y, ...". Never "X is Finnish for Y" and never name the language.
 */

export type LexemeGroup = "system" | "theme" | "atmosphere" | "material";

export interface Lexeme {
  word: string;
  /** IPA pronunciation. Finnish stresses the first syllable, always. */
  ipa: string;
  /** what it names in the system, e.g. "the system", "the loud register". */
  labels: string;
  group: LexemeGroup;
  /** the plain sense of the word. */
  sense: string;
  /** our reading: why this word, for this thing. */
  reading: string;
}

export const LEXICON: Lexeme[] = [
  {
    word: "usva",
    ipa: "/ˈusʋɑ/",
    labels: "the system",
    group: "system",
    sense: "mist; fog",
    reading:
      "the one that hangs low and close, softening every edge without hiding what's behind it. you can walk through it and still see where you're going. the whole thesis in one word: beauty that stays usable, a veil that never becomes a wall.",
  },
  {
    word: "kajo",
    ipa: "/ˈkɑjo/",
    labels: "the loud register",
    group: "theme",
    sense: "a faint glow",
    reading:
      "the light you see before the thing making it: a glow on the horizon at four in the morning, no source in sight.",
  },
  {
    word: "sisu",
    ipa: "/ˈsisu/",
    labels: "the working register",
    group: "theme",
    sense: "grit, stubborn resolve",
    reading:
      "not courage in a moment but the thing that keeps going after it runs out: stoic determination, the strength to push through when there is nothing left.",
  },
  {
    word: "savi",
    ipa: "/ˈsɑʋi/",
    labels: "the quiet register",
    group: "theme",
    sense: "clay",
    reading:
      "the material before it is a thing: earth that takes the shape you press into it and holds it, worked warm and matte by hand, and once fired keeps that form for a thousand years. the counterpart to sisu, both about what withstands.",
  },
  {
    word: "kajastus",
    ipa: "/ˈkɑjɑstus/",
    labels: "horizon glow",
    group: "atmosphere",
    sense:
      "the glow spreading along the horizon, light thrown back onto the sky",
    reading: "not the light itself but its echo; the sky going bright before the source clears the hill, or lit green from something happening out past the treeline.",
  },
  {
    word: "kynnös",
    ipa: "/ˈkynːøs/",
    labels: "turned earth",
    group: "atmosphere",
    sense: "freshly turned earth, land newly broken by the plough",
    reading: "the pattern one steady tool leaves crossing a soft surface, over and over. ridge after parallel ridge, a ploughed field from above, or any material worked the same patient way.",
  },
  {
    word: "kuulto",
    ipa: "/ˈkuːlto/",
    labels: "soft translucence",
    group: "atmosphere",
    sense: "translucency, the state of being dimly visible",
    reading:
      "something light passes through or reflects softly: a shimmer, a glow, a gleam.",
  },
  {
    word: "utu",
    ipa: "/ˈutu/",
    labels: "morning haze",
    group: "atmosphere",
    sense: "mist, haze",
    reading:
      "light water vapour suspended in the air, in the early morning or lingering over lakes and fields",
  },
  {
    word: "hehku",
    ipa: "/ˈhehku/",
    labels: "warm embers",
    group: "atmosphere",
    sense: "glow, radiance, incandescence",
    reading:
      "a warm, vibrant emission of light or heat: embers in a fireplace, a complexion, a feeling of vitality.",
  },
  {
    word: "loimu",
    ipa: "/ˈloimu/",
    labels: "open flame",
    group: "atmosphere",
    sense: "blaze, flame, or glow",
    reading:
      "the bright flicker of a campfire, the northern lights, radiating heat.",
  },
  {
    word: "väre",
    ipa: "/ˈʋære/",
    labels: "surface ripple",
    group: "atmosphere",
    sense: "ripple, shimmer, or glimmer",
    reading:
      "a slight, sparkling movement on the surface of a liquid, or a soft, vibrating light.",
  },
  {
    word: "sula",
    ipa: "/ˈsulɑ/",
    labels: "the fluid material",
    group: "material",
    sense: "molten, to melt",
    reading: "the state a solid gives up: heat past the point where a shape can hold itself, glass gone loose in the furnace, metal pouring instead of standing.\"",
  },
];

const BY_WORD = new Map(LEXICON.map((lexeme) => [lexeme.word, lexeme]));

export function lexeme(word: string): Lexeme | null {
  return BY_WORD.get(word) ?? null;
}
