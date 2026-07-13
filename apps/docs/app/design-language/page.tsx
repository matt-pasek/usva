import { Badge, Card, CardBody, CardHeader } from "@matt-pasek/usva";
import type { Metadata } from "next";
import { buildTokenReference } from "@/lib/token-reference";

export const metadata: Metadata = {
  title: "Design language",
  description:
    "usva.'s principles, voice, and an auto-generated reference of every token — beauty that stays usable.",
};

const principles = [
  {
    title: "Beauty that stays usable",
    body: "The thesis. Both consumer apps — the presentational kajo pole and the usable sisu pole — map onto one token vocabulary. Neither wins at the other's expense.",
  },
  {
    title: "Role-based tokens, never raw values",
    body: "Every color, space, radius, and duration is consumed by semantic role — accent, surface, danger — never as a hardcoded hex or pixel. Themes swap; call sites don't change.",
  },
  {
    title: "Two accents, paired",
    body: "usva pairs a design accent and a dev accent everywhere the language shows its own construction — never one alone.",
    accentPair: true,
  },
  {
    title: "A11y-first",
    body: "Contrast, focus rings, and reduced-motion fallbacks are load-bearing, not polish passed at the end.",
  },
  {
    title: "Restrained spring motion",
    body: "Motion earns its keep: soft entrances, snappy feedback, nothing bouncy enough to distract from the task underneath.",
  },
];

/**
 * Every name in usva is a Finnish noun for a thing that happens, never for an
 * object. They fall into three families, and each theme sits in one.
 */
const vocabulary = [
  {
    family: "the system",
    words: [
      {
        word: "usva",
        gloss:
          "mist; fog. the one that hangs low and close, softening every edge without hiding anything behind it. you can still walk through it and still see where you're going. that's the whole thesis of the system in one word: beauty that stays usable; a veil that never becomes a wall.",
      },
      {
        word: "kajo",
        gloss:
          "a faint glimmer, shimmer, or gleam of light. never the source, only the trace of one: the glow left on the sky by something you can't see yet. it is the least light that still carries, and it asks you to look before it gives anything up. that restraint is the presentational pole; kajo is loud the way a held breath is loud.",
      },
      {
        word: "sisu",
        gloss:
          "stoic determination, grit, bravery, and resilience. extraordinary inner strength and willpower that allows individuals to push through extreme adversity and keep going when they feel they have absolutely nothing left.",
      },
      {
        word: "savi",
        gloss:
          "clay. earth that takes a shape from the hand and holds it. wet, workable, unglamorous ground that only becomes form under pressure; and once fired, keeps that form for a thousand years. it's the material counterpart to sisu: both are about what withstands.",
      },
    ],
  },
  {
    family: "light",
    words: [
      {
        word: "kajastus",
        gloss:
          "the glow spreading along the horizon; light reflected onto the sky. it shares its root with kajo, and it is the kajo showpiece.",
      },
      {
        word: "kuulto",
        gloss:
          "translucency or the state of being dimly visible. something that light passes through or reflects softly, like a shimmer, glow, or gleam.",
      },
      {
        word: "hehku",
        gloss:
          "glow, radiance, or incandescence. a warm, vibrant emission of light or heat, such as the embers in a fireplace, a person's complexion, or a general feeling of vitality.",
      },
      {
        word: "loimu",
        gloss:
          "blaze, flame or glow. bright flicker of a campfire, the northern lights, or a radiating heat.",
      },
      {
        word: "väre",
        gloss:
          "ripple, shimmer, or glimmer. slight, sparkling movement or wave on the surface of a liquid, or a soft, vibrating light.",
      },
    ],
  },
  {
    family: "water and earth",
    words: [
      {
        word: "utu",
        gloss:
          "light water vapor suspended in the air, especially in the early morning or lingering over lakes and fields.",
      },
      {
        word: "kynnös",
        gloss:
          "freshly turned earth; land newly broken by the plough. the savi background.",
      },
    ],
  },
];

const voicePoints = [
  "first-person, lowercase-leaning — usva. speaks as itself, not as marketing copy",
  "confident but unshowy: a belief stated plainly, then earned with the work that follows",
  "keywords get an accent tint, not bold — color carries weight the way tokens do",
  "no emoji — the accent system already does the emphasis emoji would fake",
  "→ over arrow words, when an affordance genuinely needs pointing at",
  "numbers are honest: no invented precision, no rounding up",
];

export default function DesignLanguagePage() {
  const tokens = buildTokenReference();

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-12 p-10">
      <header className="flex flex-col gap-3">
        <Badge tone="accent">design language</Badge>
        <h1 className="text-3xl font-semibold text-ink">
          beauty that stays usable
        </h1>
        <p className="max-w-xl text-muted">
          usva. is a design <em>language</em> before it's a component library —
          principles and voice, then tokens, then the primitives that carry
          them. This page is the first written slice of it: the principles
          below, a voice summary, and a token reference generated straight from
          the tokens package, so it can never drift.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-ink">Principles</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {principles.map((p) => (
            <Card key={p.title}>
              <CardHeader>
                {p.accentPair ? (
                  <span>
                    <span className="text-accent">Two</span> accents,{" "}
                    <span className="text-accent-alt">paired</span>
                  </span>
                ) : (
                  p.title
                )}
              </CardHeader>
              <CardBody className="text-sm text-muted">{p.body}</CardBody>
            </Card>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-ink">the vocabulary</h2>
        <p className="max-w-xl text-sm text-muted">
          every name is a finnish word for something that <em>happens</em>, not
          for an object: a gleam, a glow along the horizon, turned earth. a
          background is an environment, so it is never named after a thing you
          could point at.
        </p>
        <div className="flex flex-col gap-4">
          {vocabulary.map((group) => (
            <Card key={group.family}>
              <CardHeader>{group.family}</CardHeader>
              <CardBody>
                <dl className="flex flex-col gap-3">
                  {group.words.map((entry) => (
                    <div key={entry.word} className="flex flex-col gap-1">
                      <dt className="font-mono text-accent text-sm">
                        {entry.word}
                      </dt>
                      <dd className="text-muted text-sm">{entry.gloss}</dd>
                    </div>
                  ))}
                </dl>
              </CardBody>
            </Card>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-ink">Voice summary</h2>
        <Card>
          <CardBody>
            <ul className="flex flex-col gap-2 text-sm text-muted">
              {voicePoints.map((point) => (
                <li key={point} className="flex gap-2">
                  <span className="text-accent">→</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted">
              Full Voice &amp; Tone reference lands in Phase 4.
            </p>
          </CardBody>
        </Card>
      </section>

      <section className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-ink">Token reference</h2>
          <p className="text-sm text-muted">
            Generated by <code>buildTokenReference()</code> from the tokens
            package's own exports — nothing here is hand-transcribed.
          </p>
        </div>

        <Card>
          <CardHeader>Color roles</CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {tokens.color.map(({ name }) => (
                <div key={name} className="flex items-center gap-2">
                  <div
                    className={`h-8 w-8 shrink-0 rounded-md border border-border bg-${name}`}
                  />
                  <span className="font-mono text-xs text-muted">{name}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>Spacing scale</CardHeader>
          <CardBody>
            <div className="flex flex-col gap-1.5">
              {tokens.spacing.map(({ name, value }) => (
                <div key={name} className="flex items-center gap-3">
                  <span className="w-10 shrink-0 font-mono text-xs text-muted">
                    {name}
                  </span>
                  <div
                    className="h-2 rounded-full bg-accent"
                    style={{ width: value }}
                  />
                  <span className="font-mono text-xs text-ink">{value}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>Radius</CardHeader>
            <CardBody>
              <div className="flex flex-col gap-3">
                {tokens.radius.map(({ name, value }) => (
                  <div key={name} className="flex items-center gap-3">
                    <div
                      className="h-8 w-8 shrink-0 border border-border-strong bg-surface-2"
                      style={{ borderRadius: value }}
                    />
                    <span className="font-mono text-xs text-muted">{name}</span>
                    <span className="font-mono text-xs text-ink">{value}</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>Motion durations</CardHeader>
            <CardBody>
              <div className="flex flex-col gap-2">
                {tokens.motion.map(({ name, value }) => (
                  <div
                    key={name}
                    className="flex items-center justify-between font-mono text-xs"
                  >
                    <span className="text-muted">{name}</span>
                    <span className="text-ink">{value}</span>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>

        <Card>
          <CardHeader>Type ramp</CardHeader>
          <CardBody>
            <div className="flex flex-col gap-3">
              {tokens.type.map(({ name, value }) => (
                <div key={name} className="flex items-baseline gap-4">
                  <span className="w-10 shrink-0 font-mono text-xs text-muted">
                    {name}
                  </span>
                  <span className="text-ink" style={{ fontSize: value }}>
                    usva.
                  </span>
                  <span className="font-mono text-xs text-ink">{value}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </section>
    </main>
  );
}
