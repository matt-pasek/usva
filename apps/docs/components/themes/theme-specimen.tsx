import {
  Avatar,
  Badge,
  Button,
  Chip,
  MockupShowcase,
  ProgressRow,
  Pullquote,
  StatCard,
} from "@matt-pasek/usva";
import { ChapterHeading } from "@/components/chapter-heading";
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

const METER_TONE: Record<string, "neutral" | "success" | "warning"> = {
  neutral: "neutral",
  success: "success",
  warning: "warning",
};

function Console({
  scene,
}: {
  scene: Extract<SpecimenScene, { kind: "console" }>;
}) {
  return (
    <div className="bg-bg">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4 sm:px-8">
        <span className="flex items-center gap-3">
          <span className="font-mono text-sm text-ink">{scene.title}</span>
          <Badge live mono>
            live
          </Badge>
        </span>
        <span className="flex items-center gap-2">
          {scene.environments.map((env) => (
            <Chip
              key={env.name}
              size="sm"
              tone={env.current ? "accent" : "default"}
              selected={env.current}
            >
              {env.name}
            </Chip>
          ))}
          <Button variant="soft" size="sm" className="ml-1">
            {scene.action}
          </Button>
        </span>
      </div>

      <div className="grid divide-border border-b border-border sm:grid-cols-[minmax(0,1fr)_18rem] sm:divide-x">
        <ul className="flex flex-col divide-y divide-border font-mono text-sm">
          {scene.rows.map((row) => (
            <li
              key={row.time}
              className="grid grid-cols-[auto_auto_4.5rem_minmax(0,1fr)] items-center gap-3 px-5 py-2.5 sm:px-8"
            >
              <span
                aria-hidden="true"
                className={`size-1.5 shrink-0 rounded-full ${ROW_DOT[row.tone]}`}
              />
              <span className="tabular-nums text-muted">{row.time}</span>
              <span className="truncate text-muted uppercase tracking-wide text-[0.6875rem]">
                {row.service}
              </span>
              <span className="min-w-0 truncate text-ink">{row.text}</span>
            </li>
          ))}
        </ul>
        <div className="flex flex-col justify-center divide-y divide-border px-5 py-2 sm:px-6">
          {scene.meters.map((meter) => (
            <ProgressRow
              key={meter.label}
              label={meter.label}
              value={meter.value}
              max={meter.max}
              unit={meter.unit}
              status={
                <Badge mono tone={METER_TONE[meter.tone]}>
                  {meter.status}
                </Badge>
              }
            />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 divide-x divide-border">
        {scene.stats.map((stat) => (
          <StatCard
            key={stat.label}
            size="sm"
            surface="flat"
            label={stat.label}
            value={stat.value}
            unit={stat.unit}
            className="rounded-none border-0"
          />
        ))}
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
      <article className="mx-auto flex max-w-prose flex-col gap-5">
        <header className="flex flex-col gap-4 border-b border-border pb-6">
          <Badge tone="accent" mono className="self-start">
            {scene.eyebrow}
          </Badge>
          <h3 className="font-extrabold text-2xl text-ink tracking-tight sm:text-3xl">
            {scene.title}
          </h3>
          <div className="flex items-center gap-3">
            <Avatar
              size="sm"
              tone="neutral"
              alt=""
              fallback={scene.byline.initials}
            />
            <span className="flex flex-col text-sm leading-tight">
              <span className="font-medium text-ink">{scene.byline.name}</span>
              <span className="text-muted text-xs">{scene.byline.meta}</span>
            </span>
          </div>
        </header>

        <p className="text-ink text-lg leading-relaxed">{scene.lead}</p>

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

        <footer className="flex flex-wrap gap-2 border-t border-border pt-6">
          {scene.tags.map((tag) => (
            <Chip key={tag} size="sm">
              {tag}
            </Chip>
          ))}
        </footer>
      </article>
    </div>
  );
}

export function ThemeSpecimen({ doc }: { doc: ThemeDoc }) {
  const scene = doc.specimen;
  return (
    <section className="flex flex-col gap-6">
      <ChapterHeading>the surface</ChapterHeading>
      <p className="max-w-2xl text-muted">{doc.specimenCaption}</p>
      <MockupShowcase frame="browser" aspect="auto" url={scene.url}>
        {scene.kind === "showcase" ? <Showcase scene={scene} /> : null}
        {scene.kind === "console" ? <Console scene={scene} /> : null}
        {scene.kind === "reading" ? <Reading scene={scene} /> : null}
      </MockupShowcase>
    </section>
  );
}
