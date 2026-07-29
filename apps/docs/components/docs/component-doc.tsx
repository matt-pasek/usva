import type { ReactNode } from "react";
import { cn } from "usva/cn";
import { JsonLd } from "@/components/json-ld";
import {
  bySlug,
  INTENSITY_BY_LAYER,
  type Intensity,
  type Layer,
  type Provenance,
} from "@/lib/catalog";
import { linkComponentNames } from "@/lib/link-components";
import { breadcrumbList, techArticle } from "@/lib/schema";

export interface Composition {
  ok: string[];
  no: string[];
}

export interface ComponentDocProps {
  /** Catalog slug. Fills name, layer, intensity and provenance when present. */
  slug?: string;
  name?: string;
  /** The full lede under the title. Longer than the catalog summary. */
  description: ReactNode;
  layer?: Layer;
  intensity?: Intensity;
  provenance?: Provenance[];
  /** Marks the rsc pill. Defaults to a server component. */
  client?: boolean;
  since?: string;
  callSites?: number;
  /** What the component pulls in, e.g. packages and internal siblings. */
  dependencies?: ReactNode;
  composition?: Composition;
  a11y?: ReactNode;
  children?: ReactNode;
}

const CRUMB: Record<Layer, string> = {
  primitive: "core",
  motion: "core",
  pattern: "patterns",
  sula: "sula",
  atmosphere: "atmospheres",
};

const LAYER_PATH: Record<Layer, string> = {
  primitive: "core / primitives",
  motion: "core / motion",
  pattern: "core / patterns",
  sula: "sula",
  atmosphere: "atmospheres",
};

const INTENSITY_NOTE: Record<Intensity, string> = {
  recedes: "safe anywhere, including dense surfaces",
  structures: "organizes a region, stays out of the content",
  guides: "leads the eye through a sequence, then clears",
  asserts: "one per region. it is the focal point",
  room: "the whole environment. nothing competes with it",
};

const INTENSITY_FILL: Record<Intensity, number> = {
  recedes: 1,
  structures: 2,
  guides: 3,
  asserts: 4,
  room: 5,
};

/**
 * Each spec row carries a visually-hidden h2 so the page has a real heading
 * outline for crawlers and screen readers, while the visible mono eyebrow stays
 * decorative. The register holds: mono uppercase is never a visible heading.
 */
function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid items-baseline gap-1 border-b border-border px-4 py-3 last:border-b-0 sm:grid-cols-[130px_minmax(0,1fr)] sm:gap-4">
      <h2 className="sr-only">{label}</h2>
      <span
        aria-hidden="true"
        className="font-mono text-[0.63rem] uppercase tracking-[0.16em] text-muted"
      >
        {label}
      </span>
      <span className="text-sm leading-relaxed text-ink">{children}</span>
    </div>
  );
}

function IntensityMeter({ intensity }: { intensity: Intensity }) {
  const fill = INTENSITY_FILL[intensity];
  return (
    <span className="inline-flex flex-wrap items-center gap-x-2.5 gap-y-1">
      <span aria-hidden="true" className="inline-flex gap-[2px]">
        {(["one", "two", "three", "four", "five"] as const).map((slot, i) => (
          <span
            key={slot}
            className={cn(
              "h-2 w-3.5 rounded-[1px]",
              i < fill ? "bg-accent" : "bg-border-strong",
            )}
          />
        ))}
      </span>
      <span>
        {intensity}{" "}
        <span className="text-muted">· {INTENSITY_NOTE[intensity]}</span>
      </span>
    </span>
  );
}

function CompositionRules({
  composition,
  selfSlug,
}: {
  composition: Composition;
  selfSlug?: string;
}) {
  return (
    <span className="flex flex-col gap-1.5">
      {composition.ok.map((rule) => (
        <span key={rule} className="flex gap-2.5">
          <span aria-hidden="true" className="font-mono text-accent-alt">
            ✓
          </span>
          {linkComponentNames(rule, selfSlug)}
        </span>
      ))}
      {composition.no.map((rule) => (
        <span key={rule} className="flex gap-2.5 text-muted">
          <span aria-hidden="true" className="font-mono text-danger">
            ✕
          </span>
          {linkComponentNames(rule, selfSlug)}
        </span>
      ))}
    </span>
  );
}

function AxeChip() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-alt/35 bg-accent-alt/10 px-2 py-0.5 align-[2px] font-mono text-[0.63rem] uppercase tracking-[0.1em] text-accent-alt">
      <span
        aria-hidden="true"
        className="size-1.5 rounded-full bg-accent-alt"
      />
      jest-axe
    </span>
  );
}

function Pill({
  accent = false,
  children,
}: {
  accent?: boolean;
  children: ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1",
        "font-mono text-[0.6875rem] uppercase tracking-[0.1em]",
        accent ? "border-accent/40 text-ink" : "border-border text-muted",
      )}
    >
      {accent && (
        <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
      )}
      {children}
    </span>
  );
}

export function ComponentDoc({
  slug,
  name,
  description,
  layer,
  intensity,
  provenance,
  client = false,
  since,
  callSites,
  dependencies,
  composition,
  a11y,
  children,
}: ComponentDocProps) {
  const entry = slug ? bySlug(slug) : undefined;
  const resolvedLayer = layer ?? entry?.layer ?? "primitive";
  const resolvedIntensity =
    intensity ?? entry?.intensity ?? INTENSITY_BY_LAYER[resolvedLayer];
  const resolvedName = name ?? entry?.name ?? slug ?? "";
  const shipping = provenance ?? entry?.provenance ?? [];
  const componentPath = slug ? `/docs/components/${slug}` : undefined;

  return (
    <main className="flex flex-col py-10">
      {componentPath && (
        <>
          <JsonLd
            data={breadcrumbList([
              { name: "usva.", path: "/" },
              { name: resolvedName, path: componentPath },
            ])}
          />
          <JsonLd
            data={techArticle({
              path: componentPath,
              headline: resolvedName,
              description: entry?.summary,
            })}
          />
        </>
      )}
      <p className="mb-4 font-mono text-[0.68rem] tracking-[0.06em] text-muted">
        <span className="text-muted">docs</span>
        {" / "}
        <span className="text-muted">{CRUMB[resolvedLayer]}</span>
        {" / "}
        {slug ?? resolvedName.toLowerCase()}
      </p>

      <h1 className="text-[clamp(2rem,4vw,2.9rem)] font-extrabold leading-[1.05] tracking-[-0.035em] text-ink">
        {resolvedName}
      </h1>
      <p className="mt-3 max-w-[56ch] leading-relaxed text-muted">
        {description}
      </p>

      <div className="mt-4 flex flex-wrap gap-1.5">
        <Pill accent>intensity · {resolvedIntensity}</Pill>
        <Pill>rsc · {client ? "client" : "server"}</Pill>
        {since && <Pill>since {since}</Pill>}
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-border bg-sunken/70">
        <Row label="provenance">
          {shipping.length > 0 ? (
            <>
              <span className="text-accent-alt">shaped from</span>{" "}
              {shipping.join(" · ")}
              {callSites != null && (
                <span className="text-muted"> · {callSites} call sites</span>
              )}
            </>
          ) : (
            <>
              <span className="text-accent-alt">authored in</span> usva
            </>
          )}
        </Row>
        <Row label="layer">{LAYER_PATH[resolvedLayer]}</Row>
        <Row label="intensity">
          <IntensityMeter intensity={resolvedIntensity} />
        </Row>
        {composition && (
          <Row label="composition">
            <CompositionRules composition={composition} selfSlug={slug} />
          </Row>
        )}
        {a11y && (
          <Row label="a11y">
            <span className="inline-flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
              <span>{a11y}</span>
              <AxeChip />
            </span>
          </Row>
        )}
        {dependencies && <Row label="dependencies">{dependencies}</Row>}
      </div>

      {children}
    </main>
  );
}
