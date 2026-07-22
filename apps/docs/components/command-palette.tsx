"use client";
import { Dialog, Input } from "@matt-pasek/usva";
import { ROLE_NAMES } from "@matt-pasek/usva-tokens";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { CATALOG, type CatalogEntry, LAYER_LABEL, THEMES } from "@/lib/catalog";

type Group = "components" | "atmospheres" | "themes" | "tokens" | "get started";

const GROUP_ORDER: Group[] = [
  "components",
  "atmospheres",
  "themes",
  "tokens",
  "get started",
];

interface Result {
  id: string;
  group: Group;
  href: string;
  label: string;
  detail: string;
  /** Only components carry the grammar: layer and intensity. */
  grammar?: string;
  haystack: string[];
}

const GET_STARTED: { label: string; href: string; detail: string }[] = [
  {
    label: "introduction",
    href: "/docs/get-started",
    detail: "what usva is, and what it refuses to be.",
  },
  {
    label: "installation",
    href: "/docs/get-started/installation",
    detail: "install the package, or copy the source in. pick per component.",
  },
  {
    label: "theming",
    href: "/docs/get-started/theming",
    detail: "retheme through role tokens, without forking a component.",
  },
  {
    label: "for agents",
    href: "/docs/get-started/for-agents",
    detail: "llms.txt and the skill. no MCP server, and I will not pretend.",
  },
];

const THEME_DETAIL: Record<(typeof THEMES)[number], string> = {
  kajo: "faint glow. the aurora register: dark, presentational, unhurried.",
  sisu: "grit, stubborn resolve. the dashboard register: dense and quick.",
  savi: "clay. the light register: calm, matte, low contrast.",
};

const grammarOf = (entry: CatalogEntry) =>
  `${LAYER_LABEL[entry.layer]} · ${entry.intensity}`.toUpperCase();

const componentResult = (entry: CatalogEntry): Result => ({
  id: `component:${entry.slug}`,
  group: entry.layer === "atmosphere" ? "atmospheres" : "components",
  href: `/docs/components/${entry.slug}`,
  label: entry.slug,
  detail: entry.summary,
  grammar: grammarOf(entry),
  haystack: [entry.slug, entry.name, entry.summary],
});

const RESULTS: Result[] = [
  ...CATALOG.map(componentResult),
  ...THEMES.map((theme) => ({
    id: `theme:${theme}`,
    group: "themes" as const,
    href: `/themes/${theme}`,
    label: theme,
    detail: THEME_DETAIL[theme],
    haystack: [theme, THEME_DETAIL[theme]],
  })),
  ...ROLE_NAMES.map((role) => ({
    id: `token:${role}`,
    group: "tokens" as const,
    href: `/design-language/color#${role}`,
    label: role,
    detail: "role token",
    haystack: [role, "token", "color", "role"],
  })),
  ...GET_STARTED.map((page) => ({
    id: `page:${page.href}`,
    group: "get started" as const,
    href: page.href,
    label: page.label,
    detail: page.detail,
    haystack: [page.label, page.detail],
  })),
];

/** Fold to bare letters so "iconbutton", "icon-button" and "IconButton" all
 * collapse onto the same key. */
const fold = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

const score = (result: Result, query: string): number => {
  const folded = fold(query);
  const keys = result.haystack.slice(0, 2).map(fold);
  if (keys.some((key) => key === folded)) return 0;
  if (keys.some((key) => key.startsWith(folded))) return 1;
  if (keys.some((key) => key.includes(folded))) return 2;
  const prose = result.haystack.join(" ").toLowerCase();
  if (prose.includes(query.toLowerCase().trim())) return 3;
  return Number.POSITIVE_INFINITY;
};

const search = (query: string): Result[] => {
  if (!query.trim()) return [];
  const ranked = RESULTS.map((result) => ({
    result,
    rank: score(result, query),
  })).filter((hit) => Number.isFinite(hit.rank));

  return GROUP_ORDER.flatMap((group) =>
    ranked
      .filter((hit) => hit.result.group === group)
      .sort(
        (a, b) =>
          a.rank - b.rank || a.result.label.length - b.result.label.length,
      )
      .slice(0, 6)
      .map((hit) => hit.result),
  );
};

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const results = useMemo(() => search(query), [query]);
  const activeResult = results[active];

  useEffect(() => {
    if (!open) {
      setQuery("");
      setActive(0);
    }
  }, [open]);

  useEffect(() => {
    if (!activeResult) return;
    listRef.current
      ?.querySelector(`[data-result="${activeResult.id}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeResult]);

  const go = useCallback(
    (result: Result) => {
      onOpenChange(false);
      router.push(result.href);
    },
    [onOpenChange, router],
  );

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (results.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((index) => (index + 1) % results.length);
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((index) => (index - 1 + results.length) % results.length);
      return;
    }
    if (event.key === "Enter" && activeResult) {
      event.preventDefault();
      go(activeResult);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Content
        aria-label="Search usva"
        initialFocus={inputRef}
        className="max-w-xl p-0"
      >
        <div className="border-border border-b p-3">
          <Input
            ref={inputRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActive(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="search components, themes, tokens"
            aria-label="Search usva"
            role="combobox"
            aria-expanded
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={activeResult?.id}
            className="h-11 border-transparent bg-transparent text-base hover:border-transparent focus-visible:ring-0"
          />
        </div>

        <div
          ref={listRef}
          id={listId}
          role="listbox"
          aria-label="Results"
          className="max-h-[min(24rem,60vh)] overflow-y-auto p-2"
        >
          {results.length === 0 ? (
            <p className="text-pretty p-4 text-sm text-muted">
              {query.trim()
                ? `nothing matches "${query.trim()}". the vocabulary runs to nature words: try sula, utu, kajo, or just type what the thing does.`
                : "type to cut across the taxonomy. components, atmospheres, themes, role tokens. every component arrives with its layer and its intensity attached, because you do not get to take one without its grammar."}
            </p>
          ) : (
            GROUP_ORDER.filter((group) =>
              results.some((result) => result.group === group),
            ).map((group) => (
              <div key={group} className="mb-1 last:mb-0">
                <p className="px-3 py-2 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-muted">
                  {group}
                </p>
                {results
                  .filter((result) => result.group === group)
                  .map((result) => {
                    const index = results.indexOf(result);
                    const isActive = index === active;
                    return (
                      // biome-ignore lint/a11y/useKeyWithClickEvents: the keyboard path is the input's own arrow and Enter handling
                      <div
                        key={result.id}
                        id={result.id}
                        data-result={result.id}
                        role="option"
                        tabIndex={-1}
                        aria-selected={isActive}
                        onClick={() => go(result)}
                        onMouseMove={() => setActive(index)}
                        className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-tint duration-fast ease-soft ${
                          isActive ? "bg-surface-2" : ""
                        }`}
                      >
                        <span className="shrink-0 text-sm text-ink">
                          {result.label}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-xs text-muted">
                          {result.detail}
                        </span>
                        {result.grammar ? (
                          <span className="shrink-0 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted">
                            {result.grammar}
                          </span>
                        ) : null}
                      </div>
                    );
                  })}
              </div>
            ))
          )}
        </div>

        <div className="flex items-center justify-between border-border border-t px-4 py-2 font-mono text-[0.6875rem] text-muted">
          <span>↑ ↓ move · ⏎ open · esc close</span>
          <span>{results.length > 0 ? `${results.length} hits` : null}</span>
        </div>
      </Dialog.Content>
    </Dialog>
  );
}
