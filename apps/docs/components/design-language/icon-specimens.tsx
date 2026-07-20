import {
  Bell,
  Check,
  Home,
  Layers,
  LayoutGrid,
  type LucideIcon,
  Search,
} from "lucide-react";

const GLYPHS: { name: string; Icon: LucideIcon }[] = [
  { name: "home", Icon: Home },
  { name: "search", Icon: Search },
  { name: "layers", Icon: Layers },
  { name: "bell", Icon: Bell },
  { name: "check", Icon: Check },
  { name: "grid", Icon: LayoutGrid },
];

const ARROWS: { glyph: string; use: string }[] = [
  { glyph: "→", use: "forward: a link, a next step, a result" },
  { glyph: "↗", use: "away: it leaves the site or opens elsewhere" },
  { glyph: "↳", use: "under: a nested route, a child, a reply" },
  { glyph: "·", use: "between: a separator for things that are equal" },
];

export function IconSpecimens() {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {GLYPHS.map(({ name, Icon }) => (
          <div
            key={name}
            className="flex flex-col items-center gap-2 rounded-lg border border-border bg-surface p-4 text-ink"
          >
            <Icon size={24} strokeWidth={1.8} aria-hidden />
            <code className="font-mono text-[0.6rem] text-muted">{name}</code>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-5">
        <p className="text-muted text-sm">
          one glyph, inheriting. it takes the size of the text it sits in and the
          colour of the role around it, because it is drawn in{" "}
          <code className="font-mono text-ink text-xs">currentColor</code> and
          sized to match.
        </p>
        <div className="flex flex-wrap items-center gap-6">
          <span className="flex items-center gap-2 text-muted text-sm">
            <Search size={16} strokeWidth={1.8} aria-hidden /> muted, small
          </span>
          <span className="flex items-center gap-2 text-ink">
            <Search size={22} strokeWidth={1.8} aria-hidden /> ink, base
          </span>
          <span className="flex items-center gap-2 text-accent text-lg">
            <Search size={28} strokeWidth={1.8} aria-hidden /> accent, large
          </span>
        </div>
      </div>
    </div>
  );
}

export function ArrowPunctuation() {
  return (
    <dl className="flex flex-col divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface">
      {ARROWS.map(({ glyph, use }) => (
        <div
          key={glyph}
          className="grid items-center gap-3 p-4 sm:grid-cols-[3rem_1fr] sm:gap-6"
        >
          <dt className="text-2xl text-accent">{glyph}</dt>
          <dd className="text-muted text-sm">{use}</dd>
        </div>
      ))}
    </dl>
  );
}
