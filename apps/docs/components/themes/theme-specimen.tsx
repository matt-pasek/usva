import {
  Badge,
  Button,
  MockupShowcase,
  Pullquote,
  StatCard,
} from "@matt-pasek/usva";
import type { SpecimenScene, ThemeDoc } from "@/lib/themes";

function Showcase({
  scene,
}: {
  scene: Extract<SpecimenScene, { kind: "showcase" }>;
}) {
  return (
    <div className="relative overflow-hidden bg-bg px-6 py-10 sm:px-12 sm:py-14">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(70% 80% at 12% 0%, color-mix(in oklab, var(--usva-accent) 22%, transparent), transparent 66%), radial-gradient(55% 65% at 95% 100%, color-mix(in oklab, var(--usva-accent-alt) 14%, transparent), transparent 70%)",
        }}
      />
      <div className="relative flex flex-col gap-10">
        <div className="flex items-center justify-between gap-4">
          <span className="font-semibold text-ink">
            {scene.brand}
            <span className="text-accent-alt">.</span>
          </span>
          <Button variant="glass" shape="pill" size="sm">
            {scene.nav}
          </Button>
        </div>

        <div className="flex max-w-xl flex-col items-start gap-4">
          <Badge tone="accent-alt" mono>
            {scene.eyebrow}
          </Badge>
          <h3 className="font-extrabold text-3xl text-ink tracking-[-0.03em] sm:text-5xl">
            {scene.headline}
            <span className="text-accent">.</span>
          </h3>
          <p className="text-muted">{scene.lede}</p>
          <div className="mt-2 flex flex-wrap gap-3">
            <Button size="lg">{scene.primary}</Button>
            <Button variant="ghost" size="lg">
              {scene.secondary}
            </Button>
          </div>
        </div>

        <div className="grid max-w-2xl grid-cols-3 gap-3">
          {scene.stats.map((stat, i) => (
            <StatCard
              key={stat.label}
              size="sm"
              surface="glass"
              tone={i === 0 ? "accent" : "neutral"}
              label={stat.label}
              value={stat.value}
              unit={stat.unit}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

const ROW_DOT: Record<string, string> = {
  success: "bg-success",
  neutral: "bg-muted",
  warning: "bg-warning",
  danger: "bg-danger",
};

function Console({
  scene,
}: {
  scene: Extract<SpecimenScene, { kind: "console" }>;
}) {
  return (
    <div className="bg-bg px-5 py-6 sm:px-8 sm:py-8">
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
          <span className="flex items-center gap-3">
            <span className="font-mono text-sm text-ink">{scene.title}</span>
            <Badge live mono>
              live
            </Badge>
          </span>
          <Button variant="soft" size="sm">
            {scene.action}
          </Button>
        </div>
        <ul className="flex flex-col divide-y divide-border font-mono text-sm">
          {scene.rows.map((row) => (
            <li key={row.time} className="flex items-center gap-3 py-2.5">
              <span
                aria-hidden="true"
                className={`size-1.5 shrink-0 rounded-full ${ROW_DOT[row.tone]}`}
              />
              <span className="tabular-nums text-muted">{row.time}</span>
              <span className="min-w-0 truncate text-ink">{row.text}</span>
            </li>
          ))}
        </ul>
        <div className="grid grid-cols-3 gap-3">
          {scene.stats.map((stat) => (
            <StatCard
              key={stat.label}
              size="sm"
              surface="flat"
              label={stat.label}
              value={stat.value}
              unit={stat.unit}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Reading({
  scene,
}: {
  scene: Extract<SpecimenScene, { kind: "reading" }>;
}) {
  return (
    <div className="bg-bg px-6 py-10 sm:px-12 sm:py-14">
      <div className="mx-auto flex max-w-prose flex-col gap-5">
        <h3 className="font-extrabold text-2xl text-ink tracking-tight sm:text-3xl">
          {scene.title}
        </h3>
        {scene.paragraphs.map((paragraph) => (
          <p
            key={paragraph.slice(0, 24)}
            className="text-ink/85 leading-relaxed"
          >
            {paragraph}
          </p>
        ))}
        <Pullquote attribution={scene.attribution} className="py-6">
          {scene.quote}
        </Pullquote>
      </div>
    </div>
  );
}

export function ThemeSpecimen({ doc }: { doc: ThemeDoc }) {
  const scene = doc.specimen;
  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-mono text-sm uppercase tracking-widest text-muted">
        the surface
      </h2>
      <p className="max-w-2xl text-muted">{doc.specimenCaption}</p>
      <MockupShowcase frame="browser" aspect="auto" url={scene.url}>
        {scene.kind === "showcase" ? <Showcase scene={scene} /> : null}
        {scene.kind === "console" ? <Console scene={scene} /> : null}
        {scene.kind === "reading" ? <Reading scene={scene} /> : null}
      </MockupShowcase>
    </section>
  );
}
