"use client";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import * as React from "react";
// biome-ignore lint/style/noRestrictedImports: atmospheres-core ships no subpath
import { type AtmosphereName, hiddenOnGround } from "usva";
import { Button } from "usva/primitives/button";
import type { Config } from "@/components/docs/playground";
import { useTheme } from "@/components/theme-provider";
import { type ErasedStudio, studioByName, studios } from "@/lib/atmospheres";
import { decodeShare, encodeShare } from "@/lib/studio/share";
import { resolveRoleHex } from "@/lib/studio/theme-colors";
import { LumoRail } from "./lumo-rail";
import { LumoStage } from "./lumo-stage";

const FALLBACK_BG = "#08080c";
const FIRST = studios[0] as ErasedStudio;

function presetOf(studio: ErasedStudio): Config {
  return studio.templates[studio.defaultTemplate] ?? {};
}

/**
 * The theme the atmosphere is actually cast under. A light ground (savi) gives
 * the forbid/restrict atmospheres nothing to outshine, so they fall back to a
 * dark kajo ground, exactly as the docs do with DarkStage.
 */
function groundTheme(name: string, siteTheme: string): string {
  const light = siteTheme === "savi";
  if (light && hiddenOnGround(name as AtmosphereName, "absorptive")) {
    return "kajo";
  }
  return siteTheme;
}

export function LumoStudio() {
  const { theme } = useTheme();
  const [name, setName] = React.useState(FIRST.name);
  const [config, setConfig] = React.useState<Config>(() => presetOf(FIRST));
  const [template, setTemplate] = React.useState(FIRST.defaultTemplate);
  const [canvasBg, setCanvasBg] = React.useState(FALLBACK_BG);
  const [railOpen, setRailOpen] = React.useState(true);

  React.useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("s");
    if (!token) return;
    const shared = decodeShare(token);
    const studio = shared && studioByName[shared.atmosphere];
    if (!shared || !studio) return;
    setName(studio.name);
    setConfig({ ...presetOf(studio), ...shared.config });
    setTemplate("custom");
  }, []);

  const synced = React.useRef(false);

  /**
   * Keeps the address bar holding the sky currently on screen, so a refresh
   * does not throw the tuning away. The first pass is skipped deliberately: it
   * shares a commit with the effect above, so writing then would replace an
   * arriving ?s= with the default preset before that token was ever applied.
   * Skipping it also leaves a plain /studio clean until something is tuned.
   */
  React.useEffect(() => {
    if (!synced.current) {
      synced.current = true;
      return;
    }
    const token = encodeShare({ atmosphere: name, config });
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}?s=${token}`,
    );
  }, [name, config]);

  const effectiveTheme = groundTheme(name, theme);

  // The ground colour follows whichever theme the atmosphere is cast under.
  React.useEffect(() => {
    setCanvasBg(resolveRoleHex("bg", FALLBACK_BG, effectiveTheme));
  }, [effectiveTheme]);

  const studio = studioByName[name] ?? FIRST;

  const patch = (partial: Partial<Config>) => {
    setTemplate("custom");
    setConfig((current) => ({ ...current, ...partial }) as Config);
  };

  const changeAtmosphere = (next: string) => {
    const target = studioByName[next];
    if (!target) return;
    setName(target.name);
    setTemplate(target.defaultTemplate);
    setConfig(presetOf(target));
  };

  const applyTemplate = (next: string) => {
    if (next === "custom") return;
    const preset = studio.templates[next];
    if (!preset) return;
    setTemplate(next);
    setConfig(preset);
  };

  const reset = () => {
    setTemplate(studio.defaultTemplate);
    setConfig(presetOf(studio));
    setCanvasBg(resolveRoleHex("bg", FALLBACK_BG, effectiveTheme));
  };

  const share = () => {
    const token = encodeShare({ atmosphere: name, config });
    const url = `${window.location.origin}${window.location.pathname}?s=${token}`;
    window.history.replaceState(null, "", url);
    navigator.clipboard?.writeText(url).catch(() => {});
  };

  const exportCode = () => {
    navigator.clipboard?.writeText(studio.snippet(config)).catch(() => {});
  };

  return (
    <>
      <header className="mx-auto flex w-full max-w-[112rem] shrink-0 items-center gap-3 pb-3">
        <span className="flex min-w-0 items-baseline gap-3">
          <h1 className="truncate text-base font-extrabold tracking-tight text-ink sm:text-xl">
            the atmosphere studio
          </h1>
          <span className="hidden whitespace-nowrap font-mono text-[0.65rem] uppercase tracking-widest text-muted sm:inline">
            lumo · cast a sky
          </span>
        </span>
        {/* Sits in the page chrome rather than on the stage, so collapsing the
            rail never moves the control that collapses it. */}
        <Button
          variant="outline"
          size="sm"
          aria-expanded={railOpen}
          onClick={() => setRailOpen((open) => !open)}
          className="ml-auto shrink-0 font-mono uppercase tracking-[0.14em] text-muted hover:text-ink"
        >
          {railOpen ? (
            <PanelLeftClose
              aria-hidden="true"
              strokeWidth={1.8}
              className="size-3.5"
            />
          ) : (
            <PanelLeftOpen
              aria-hidden="true"
              strokeWidth={1.8}
              className="size-3.5"
            />
          )}
          {railOpen ? "hide" : "controls"}
        </Button>
      </header>

      <div
        className={`mx-auto flex min-h-0 w-full max-w-[112rem] flex-1 flex-col lg:flex-row ${
          railOpen ? "gap-4" : "gap-0"
        }`}
      >
        <div
          aria-hidden={!railOpen}
          className={`grid shrink-0 overflow-hidden transition-all duration-300 ease-soft lg:[grid-template-rows:none] ${
            railOpen
              ? "[grid-template-rows:1fr] opacity-100 lg:w-[22rem]"
              : "pointer-events-none [grid-template-rows:0fr] opacity-0 lg:w-0"
          }`}
        >
          <aside className="min-h-0 w-full overflow-hidden lg:h-full lg:w-[22rem]">
            <LumoRail
              studio={studio}
              studios={studios}
              config={config}
              template={template}
              templateNames={Object.keys(studio.templates)}
              canvasBg={canvasBg}
              onPatch={patch}
              onAtmosphere={changeAtmosphere}
              onTemplate={applyTemplate}
              onCanvasBg={setCanvasBg}
              onReset={reset}
              onShare={share}
              onExport={exportCode}
            />
          </aside>
        </div>
        <LumoStage
          studio={studio}
          config={config}
          canvasBg={canvasBg}
          theme={effectiveTheme}
        />
      </div>
    </>
  );
}
