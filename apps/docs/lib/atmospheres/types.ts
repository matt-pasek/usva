import type * as React from "react";
import type { Config, Field } from "@/components/docs/playground";

/**
 * One atmosphere's full studio surface, shared by its docs demo and Lumo. The
 * docs demo spreads it into <Playground>; Lumo iterates the registry and drives
 * the same fields, snippet, and preview.
 */
export interface AtmosphereStudio<C extends Config = Config> {
  /** Slug, eg "hehku". */
  name: string;
  /** Display label in the picker. */
  label: string;
  /** One-line description for the picker. */
  blurb: string;
  /** Preset key shown first. */
  defaultTemplate: string;
  templates: Record<string, C>;
  fields: Field<C>[];
  snippet: (config: C) => string;
  /** The docs-panel preview: framed, with hero content. */
  render: (config: C) => React.ReactNode;
  /** The raw fullscreen preview for Lumo: atmosphere only, no chrome. */
  wallpaper: (config: C, className: string) => React.ReactNode;
  /** Extra classes on the Playground stage wrapper. */
  stageClassName?: string;
}

/** The config-erased shape both consumers see. */
export type ErasedStudio = AtmosphereStudio<Config>;

/**
 * Checks the literal against its precise config type at the definition site,
 * then erases C so a heterogeneous registry stays free of variance conflicts.
 */
export function defineStudio<C extends Config>(
  studio: AtmosphereStudio<C>,
): ErasedStudio {
  return studio as unknown as ErasedStudio;
}
