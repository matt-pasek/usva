/**
 * The names, and what they mean. Every name in usva is a nature or temperament
 * word (Finnish, if you want the source, but that never surfaces in product
 * copy) chosen so the word already behaves like the thing it labels. Pages read
 * their glosses from here.
 *
 * Rule for anything rendered to a user: give the sense and then my reading,
 * as "X is Y, ...". Never "X is Finnish for Y" and never name the language.
 * The voice is first person singular throughout: I, never we.
 *
 * A reading has two beats. `reading` is the phenomenon as I see it, written
 * from what the thing actually does on screen rather than from the dictionary.
 * `psychology` is the leap: why that feeling belongs to this part of the system.
 */

export type LexemeGroup =
  | "system"
  | "theme"
  | "atmosphere"
  | "material"
  | "motion";

export interface Lexeme {
  word: string;
  /** IPA pronunciation. Finnish stresses the first syllable, always. */
  ipa: string;
  /** what it names in the system, e.g. "the system", "the loud register". */
  labels: string;
  group: LexemeGroup;
  /** the plain sense of the word. */
  sense: string;
  /** the phenomenon as I read it. */
  reading: string;
  /** the psychology, not the physics: why this word, for this thing. */
  psychology: string;
}

export const LEXICON: Lexeme[] = [
  {
    word: "usva",
    ipa: "/ˈusʋɑ/",
    labels: "the system",
    group: "system",
    sense: "mist; fog",
    reading:
      "the one that hangs low and close, softening every edge without hiding what is behind it. you can walk through it and still see where you are going.",
    psychology:
      "softening a thing and obscuring it are different acts, and the first one is a kindness. beauty that stays usable: a veil that never becomes a wall.",
  },
  {
    word: "kajo",
    ipa: "/ˈkɑjo/",
    labels: "the loud register",
    group: "theme",
    sense: "a faint glow",
    reading:
      "the light you see before the thing making it. a glow on the horizon at four in the morning, no source in sight.",
    psychology:
      "you turn toward it before you can name it, which is the whole job of a first screen. the glow is never the source, so the loudest register still sits behind what you came for.",
  },
  {
    word: "sisu",
    ipa: "/ˈsisu/",
    labels: "the working register",
    group: "theme",
    sense: "grit, stubborn resolve",
    reading:
      "not courage in the moment but what keeps going after the courage runs out. the part that shows up when there is nothing left to draw on.",
    psychology:
      "endurance is not a mood, it is what remains once the mood has gone. the register that has to survive an eight hour session cannot afford to be admired.",
  },
  {
    word: "savi",
    ipa: "/ˈsɑʋi/",
    labels: "the quiet register",
    group: "theme",
    sense: "clay",
    reading:
      "the material before it is a thing. earth that takes the shape you press into it and holds it, worked warm and matte by hand, and once fired keeps that form for a thousand years.",
    psychology:
      "a surface that takes the impression rather than making one. it holds what you put into it and adds nothing of its own, which is the whole ambition of a page you intend to be read.",
  },
  {
    word: "kajastus",
    ipa: "/ˈkɑjɑstus/",
    labels: "horizon glow",
    group: "atmosphere",
    sense:
      "the glow spreading along the horizon, light thrown back onto the sky",
    reading:
      "the glow that was on the horizon, arrived. a curved roof of folded light closing overhead, seen from underneath rather than across.",
    psychology:
      "the name points at the far edge of the sky and the thing itself is already above you. an atmosphere is not scenery you look at, it is the room you are standing in.",
  },
  {
    word: "kynnös",
    ipa: "/ˈkynːøs/",
    labels: "turned earth",
    group: "atmosphere",
    sense: "freshly turned earth, land newly broken by the plough",
    reading:
      "the pattern one steady tool leaves crossing a soft surface, over and over. ridge after parallel ridge, a ploughed field from above, or any material worked the same patient way.",
    psychology:
      "repetition reads as care when you can see the hand that made it. this is texture earned by passing over the same ground again, not a pattern laid on top.",
  },
  {
    word: "kuulto",
    ipa: "/ˈkuːlto/",
    labels: "soft translucence",
    group: "atmosphere",
    sense: "translucency, the state of being dimly visible",
    reading:
      "a vast sheet of silk, creased a few times and lit from three sides. a fold turning toward one lamp takes that lamp's hue and catches the next as it rolls away.",
    psychology:
      "nothing here is coloured, it is only lit. the dark is not paint, it is the part no lamp reached, which is the difference between a shadow and a shape.",
  },
  {
    word: "utu",
    ipa: "/ˈutu/",
    labels: "morning haze",
    group: "atmosphere",
    sense: "mist, haze",
    reading:
      "fog gathered into a single body. stacked glowing shells you can see straight through, with thin tails shearing off as it turns.",
    psychology:
      "the same weather as usva, given edges. once mist becomes an object you can put it somewhere, and a thing with a boundary asks a different question than a thing without one.",
  },
  {
    word: "hehku",
    ipa: "/ˈhehku/",
    labels: "incandescent coil",
    group: "atmosphere",
    sense: "radiance, incandescence",
    reading:
      "a single filament coiling through the dark, run hot. it stays cold violet along the long thin passes and blooms green-white exactly where it folds back across itself.",
    psychology:
      "brightness here is not intensity, it is proximity to itself. density becomes light only where a thing overlaps its own path.",
  },
  {
    word: "loimu",
    ipa: "/ˈloimu/",
    labels: "distant blaze",
    group: "atmosphere",
    sense: "blaze, flame",
    reading:
      "light from something enormous sitting just off the frame, dragged into long streamers that fade before they reach the edge.",
    psychology:
      "you never see the source, only what it is doing to everything nearby. scale is easier to feel from its effects than from the thing itself.",
  },
  {
    word: "väre",
    ipa: "/ˈʋære/",
    labels: "surface ripple",
    group: "atmosphere",
    sense: "ripple, shimmer",
    reading:
      "broad fronts crossing the frame from somewhere off to one side, each one slightly out of step with the last. what you see is the crest lines, not the water.",
    psychology:
      "the field keeps propagating whether you are there or not. your presence bends it as you pass and it closes again behind you, which is how a layer can acknowledge you without becoming about you.",
  },
  {
    word: "routa",
    ipa: "/ˈroutɑ/",
    labels: "frost heave",
    group: "atmosphere",
    sense: "ground frost; earth frozen from below",
    reading:
      "the ground lifting itself from underneath. low cells push up until the seams between them split, and one cold light rakes long across everything they broke.",
    psychology:
      "cold here is structural, not a mood. the ground is not the stable part of the picture, it is a material with its own movement.",
  },
  {
    word: "sula",
    ipa: "/ˈsulɑ/",
    labels: "the fluid material",
    group: "material",
    sense: "molten, to melt",
    reading:
      "the state a solid gives up. heat past the point where a shape can hold itself, glass gone loose in the furnace, metal pouring instead of standing.",
    psychology:
      "a rigid thing can only ever move next to another rigid thing. once a shape stops holding itself it can join, and the joining is the whole reason to give up the edge.",
  },
  {
    word: "kuohu",
    ipa: "/ˈkuohu/",
    labels: "the boil",
    group: "material",
    sense: "surge, froth, the roll of a boiling liquid",
    reading:
      "liquid worked from underneath until it climbs. bodies swell off the floor, rise, cool at the top and sink back, and the loop never runs the same way twice.",
    psychology:
      "a boil never repeats and never arrives, so there is nothing to wait for and nothing to miss. you watch it because it asks nothing of you.",
  },
  {
    word: "lumo",
    ipa: "/ˈlumo/",
    labels: "the atmosphere studio",
    group: "system",
    sense: "charm; the pull a thing has on you",
    reading:
      "not persuasion and not argument, just the difficulty of looking away from something before you have decided anything about it.",
    psychology:
      "taking a spell apart is supposed to end it. here the knobs are the point: you can see exactly what the fascination is made of and it still works.",
  },
  {
    word: "tiivistymä",
    ipa: "/ˈtiːʋistymæ/",
    labels: "the scroll motion",
    group: "motion",
    sense: "condensate; what forms when vapour meets a cold surface",
    reading:
      "vapour touching something cold and becoming visible. not an event but a reading of the conditions, and when they reverse it goes back.",
    psychology:
      "nothing here fires and nothing is spent, so scrubbing back takes the page apart exactly the way it was assembled. an animation you can run backwards was never a performance.",
  },
];

const BY_WORD = new Map(LEXICON.map((lexeme) => [lexeme.word, lexeme]));

export function lexeme(word: string): Lexeme | null {
  return BY_WORD.get(word) ?? null;
}
