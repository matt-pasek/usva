export type Layer = "primitive" | "pattern" | "motion" | "sula" | "atmosphere";
export type Intensity =
  | "recedes"
  | "structures"
  | "guides"
  | "asserts"
  | "room";
export type Provenance = "personal-website" | "sisu-plus";

export interface CatalogEntry {
  slug: string;
  name: string;
  layer: Layer;
  intensity: Intensity;
  summary: string;
  provenance: Provenance[];
  rules?: string[];
  isNew?: boolean;
}

export const INTENSITY_BY_LAYER: Record<Layer, Intensity> = {
  primitive: "recedes",
  pattern: "structures",
  motion: "guides",
  sula: "asserts",
  atmosphere: "room",
};

export const LAYER_LABEL: Record<Layer, string> = {
  primitive: "core · primitives",
  pattern: "core · patterns",
  motion: "core · motion",
  sula: "sula",
  atmosphere: "atmospheres",
};

const SULA_RULES = [
  "one sula element per region. a region is a bounded area competing for a single attention focus, so two liquid fields in the same one fight and read as noise.",
  "different regions are fine. a frame at the viewport edge is ambient and at the boundary; a nav at the top is a focal control surface. they do not compete, and they ship together.",
  "keep it out of dense, task-bound UI. not a table, not a form, not a dashboard someone is working in.",
  "prefers-reduced-motion drops it to a static equivalent. the field is decoration over a UI that already works.",
];

type Seed = Omit<CatalogEntry, "intensity" | "layer">;

const seed = (layer: Layer, entries: Seed[]): CatalogEntry[] =>
  entries.map((entry) => ({
    ...entry,
    layer,
    intensity: INTENSITY_BY_LAYER[layer],
  }));

const primitives = seed("primitive", [
  {
    slug: "announcement",
    name: "Announcement",
    summary:
      "a one-line notice above the fold, for a release or a warning you cannot bury.",
    provenance: ["sisu-plus"],
  },
  {
    slug: "avatar",
    name: "Avatar",
    summary:
      "a person, as an image or their initials. groups into a cluster with a +N chip.",
    provenance: ["sisu-plus"],
  },
  {
    slug: "badge",
    name: "Badge",
    summary: "the status of the thing it sits on. it labels, it never clicks.",
    provenance: ["sisu-plus"],
  },
  {
    slug: "button",
    name: "Button",
    summary:
      "the one thing you want pressed, with a loading, success and error state built in.",
    provenance: ["personal-website", "sisu-plus"],
  },
  {
    slug: "card",
    name: "Card",
    summary:
      "a surface that groups things. four skins, from elevated to a bare outline.",
    provenance: ["personal-website", "sisu-plus"],
  },
  {
    slug: "checkbox",
    name: "Checkbox",
    summary:
      "an independent yes or no. use it when the options do not exclude each other.",
    provenance: [],
  },
  {
    slug: "chip",
    name: "Chip",
    summary:
      "a tag. a keyword, a filter, a stack entry. removable when it is a filter.",
    provenance: ["personal-website"],
  },
  {
    slug: "code-snippet",
    name: "CodeSnippet",
    summary: "a highlighted code block with the copy button already there.",
    provenance: [],
  },
  {
    slug: "color-field",
    name: "ColorField",
    summary:
      "picks a colour and shows you the value. the swatch is the control, not a decoration.",
    provenance: [],
  },
  {
    slug: "dialog",
    name: "Dialog",
    summary:
      "interrupts, on purpose. focus trapped, scroll locked, escape closes.",
    provenance: [],
  },
  {
    slug: "drawer",
    name: "Drawer",
    summary:
      "a dialog that slides in from an edge. use bottom on mobile, side for a detail panel.",
    provenance: ["personal-website", "sisu-plus"],
  },
  {
    slug: "dropdown-menu",
    name: "DropdownMenu",
    summary:
      "a list of actions, anchored to what triggered them. actions, not navigation.",
    provenance: [],
  },
  {
    slug: "hint-popover",
    name: "HintPopover",
    summary:
      "the explanation a tooltip cannot hold, because this one has a button in it.",
    provenance: ["sisu-plus"],
  },
  {
    slug: "input",
    name: "Input",
    summary:
      "one line of text. it owns its own focus ring and its error state.",
    provenance: [],
  },
  {
    slug: "label",
    name: "Label",
    summary:
      "names a control and clicks through to it. never decorate a heading with it.",
    provenance: [],
  },
  {
    slug: "list",
    name: "List",
    summary:
      "an ordered or unordered list that a screen reader counts. dividers and markers optional.",
    provenance: [],
  },
  {
    slug: "loading-overlay",
    name: "LoadingOverlay",
    summary:
      "covers the region that is busy, and only that region. scroll lock is refcounted.",
    provenance: ["sisu-plus"],
  },
  {
    slug: "log-line",
    name: "LogLine",
    summary:
      "one machine event: a severity rail, a level, a source, and the detail if you want it.",
    provenance: ["sisu-plus"],
  },
  {
    slug: "notification-badge",
    name: "NotificationBadge",
    summary:
      "an unread count pinned to whatever it overlays. it wraps, it does not replace.",
    provenance: ["sisu-plus"],
  },
  {
    slug: "popover",
    name: "Popover",
    summary:
      "rich content anchored to a trigger, and it can be interacted with.",
    provenance: [],
  },
  {
    slug: "progress",
    name: "Progress",
    summary:
      "how far along a determinate task is. if you cannot say, use a spinner instead.",
    provenance: [],
  },
  {
    slug: "radio",
    name: "Radio",
    summary:
      "exactly one of a few. more than about five and you want a select.",
    provenance: [],
  },
  {
    slug: "select",
    name: "Select",
    summary:
      "one value out of many, when the list is too long to lay out flat.",
    provenance: [],
  },
  {
    slug: "skeleton",
    name: "Skeleton",
    summary:
      "the shape of the content before it arrives. SkeletonMirror infers it from any children.",
    provenance: [],
  },
  {
    slug: "slider",
    name: "Slider",
    summary:
      "a value on a continuum, where the trend matters more than the exact number.",
    provenance: [],
  },
  {
    slug: "spinner",
    name: "Spinner",
    summary:
      "an indeterminate wait, inline and small. the plain one, for buttons and dense UI.",
    provenance: [],
  },
  {
    slug: "stat-chip",
    name: "StatChip",
    summary:
      "one number in a pill: a credit balance, a quota, a count you keep glancing at.",
    provenance: ["sisu-plus"],
  },
  {
    slug: "switch",
    name: "Switch",
    summary:
      "a setting that takes effect immediately. no save button follows it.",
    provenance: [],
  },
  {
    slug: "tabs",
    name: "Tabs",
    summary:
      "peer views in one region. not steps, and never a way to hide required fields.",
    provenance: [],
  },
  {
    slug: "terminal",
    name: "Terminal",
    summary: "a shell command in a row, prompt and copy button included.",
    provenance: [],
  },
  {
    slug: "toast",
    name: "Toast",
    summary:
      "the result of something you just did. fired imperatively, from anywhere.",
    provenance: ["sisu-plus"],
  },
  {
    slug: "toggle-chip",
    name: "ToggleChip",
    summary:
      "a chip that stays pressed. a filter you turn on, not a tag you read.",
    provenance: [],
  },
  {
    slug: "tooltip",
    name: "Tooltip",
    summary:
      "names an unlabelled control. it holds no action and it is never the only copy of the truth.",
    provenance: [],
  },
]);

const patterns = seed("pattern", [
  {
    slug: "bento-grid",
    name: "BentoGrid",
    summary:
      "cells of different weights in one grid, for a page that has to say several things at once.",
    provenance: ["personal-website"],
  },
  {
    slug: "case-study-hero",
    name: "CaseStudyHero",
    summary:
      "opens a piece of work: the title, the accent, the metadata, the link out.",
    provenance: ["personal-website"],
  },
  {
    slug: "checklist-card",
    name: "ChecklistCard",
    summary:
      "a card whose body is a real list, so the reader gets the count and the order.",
    provenance: ["sisu-plus"],
  },
  {
    slug: "cta-banner",
    name: "CtaBanner",
    summary:
      "the ask, at the end of a page. everything below the title is optional.",
    provenance: ["sisu-plus"],
  },
  {
    slug: "dashboard-grid",
    name: "DashboardGrid",
    summary:
      "widgets the user drags and resizes into their own layout, keyboard included.",
    provenance: ["sisu-plus"],
  },
  {
    slug: "disclosure-row",
    name: "DisclosureRow",
    summary:
      "a row that opens. the chevron and the expanded state, without the progress bar.",
    provenance: ["sisu-plus"],
  },
  {
    slug: "empty-state",
    name: "EmptyState",
    summary: "nothing here yet, and here is the one thing to do about it.",
    provenance: [],
  },
  {
    slug: "entity-card",
    name: "EntityCard",
    summary:
      "a thing with a name, a picture, some metadata and actions. stack, row or showcase.",
    provenance: ["sisu-plus"],
  },
  {
    slug: "feature-carousel",
    name: "FeatureCarousel",
    summary:
      "features one at a time, advancing on their own, pausing when you look closer.",
    provenance: ["sisu-plus"],
  },
  {
    slug: "field-group",
    name: "FieldGroup",
    summary:
      "the label, control, description and error of one field, wired together correctly.",
    provenance: [],
  },
  {
    slug: "footer",
    name: "Footer",
    summary:
      "the bottom of the site: columns when there is a lot, one row when there is not.",
    provenance: ["personal-website", "sisu-plus"],
  },
  {
    slug: "hero-split",
    name: "HeroSplit",
    summary:
      "copy on one side, the proof on the other. both sized off the container, not the window.",
    provenance: ["sisu-plus"],
  },
  {
    slug: "mockup-showcase",
    name: "MockupShowcase",
    summary:
      "a browser or device frame around your media. the media is a slot, so bring your own.",
    provenance: ["personal-website"],
  },
  {
    slug: "page-header",
    name: "PageHeader",
    summary:
      "the top of a screen: title, description, actions, and the stats worth reading first.",
    provenance: ["sisu-plus"],
  },
  {
    slug: "panel",
    name: "Panel",
    summary:
      "a titled region with its own actions and its own loading state. the dashboard workhorse.",
    provenance: ["sisu-plus"],
  },
  {
    slug: "progress-row",
    name: "ProgressRow",
    summary: "a label, a count and a bar, as one row in a list of many.",
    provenance: ["sisu-plus"],
  },
  {
    slug: "pullquote",
    name: "Pullquote",
    summary:
      "one sentence, pulled out and made large, with an ornament slot beside it.",
    provenance: ["personal-website"],
  },
  {
    slug: "roadmap-timeline",
    name: "RoadmapTimeline",
    summary:
      "what shipped, what is in flight, what is planned, on one connected track.",
    provenance: ["sisu-plus"],
  },
  {
    slug: "section-heading",
    name: "SectionHeading",
    summary:
      "a mono eyebrow over a display title. the loud way to start a section.",
    provenance: ["personal-website"],
  },
  {
    slug: "section-label",
    name: "SectionLabel",
    summary:
      "a numbered index, a title and a lede. the quiet way to start a section.",
    provenance: ["personal-website"],
  },
  {
    slug: "segmented-control",
    name: "SegmentedControl",
    summary:
      "a few exclusive options, all visible at once. the plain one, for dense UI.",
    provenance: [],
  },
  {
    slug: "stat-bento",
    name: "StatBento",
    summary:
      "the numbers you lead with, at display scale, counting up as they arrive.",
    provenance: ["personal-website"],
  },
  {
    slug: "stat-card",
    name: "StatCard",
    summary: "one metric, its trend and a note on why it moved.",
    provenance: ["personal-website"],
  },
  {
    slug: "step-chips",
    name: "StepChips",
    summary:
      "three or four steps in a row, with the arrows inside the list where they belong.",
    provenance: ["sisu-plus"],
  },
  {
    slug: "step-list",
    name: "StepList",
    summary:
      "an ordered procedure, one step per row, each with room for an icon.",
    provenance: ["personal-website"],
  },
  {
    slug: "stripe-card",
    name: "StripeCard",
    summary:
      "a card keyed by colour, so a long list of them sorts by eye. the stripe is data.",
    provenance: ["sisu-plus"],
  },
  {
    slug: "toolbar",
    name: "Toolbar",
    summary:
      "the controls above a view: filters, counts, a legend, the actions on the right.",
    provenance: ["sisu-plus"],
  },
]);

const motion = seed("motion", [
  {
    slug: "reveal",
    name: "Reveal",
    summary:
      "scroll reveals that resolve out of mist as they come into view, with a stagger group for cascading children.",
    provenance: ["personal-website"],
  },
  {
    slug: "page-transition",
    name: "PageTransition",
    summary: "a route-level fade and lift, keyed on any routeKey.",
    provenance: ["personal-website"],
  },
]);

const sula = seed("sula", [
  {
    slug: "sula-nav",
    name: "SulaNav",
    summary:
      "a navigation bar whose parts merge and pinch apart as you move between views.",
    provenance: [],
    rules: SULA_RULES,
  },
  {
    slug: "sula-segmented",
    name: "SulaSegmented",
    summary:
      "a segmented control that pinches a droplet off the old segment and merges it into the new one.",
    provenance: [],
    rules: [
      ...SULA_RULES,
      "this is the brand-surface segmented control. for dense UI, reach for the plain SegmentedControl.",
    ],
  },
  {
    slug: "sula-fab",
    name: "SulaFab",
    summary:
      "a floating action button whose actions emerge as liquid beads and pinch back on close.",
    provenance: [],
    rules: SULA_RULES,
  },
  {
    slug: "sula-loader",
    name: "SulaLoader",
    summary:
      "a metaball spinner for a wait you want felt. it loops only while it is mounted.",
    provenance: [],
    rules: [
      ...SULA_RULES,
      "this is the brand loading beat. for buttons and dense UI, reach for the plain Spinner.",
    ],
  },
  {
    slug: "sula-field",
    name: "SulaField",
    summary:
      "an ambient field of blobs that drift and merge slowly behind content.",
    provenance: [],
    rules: [
      ...SULA_RULES,
      "it pauses offscreen and in a background tab. never run it under a second sula surface.",
    ],
  },
  {
    slug: "sula-frame",
    name: "SulaFrame",
    summary:
      "a liquid border that hugs a card, or the whole viewport, and leans toward your cursor.",
    provenance: ["personal-website"],
    rules: [
      ...SULA_RULES,
      "fixed mode frames the viewport, so there can only ever be one of those on a page.",
    ],
  },
]);

const atmospheres = seed("atmosphere", [
  {
    slug: "utu",
    name: "Utu",
    summary:
      "fog. a slow drifting haze that sits behind everything and asks for nothing.",
    provenance: [],
  },
  {
    slug: "kajastus",
    name: "Kajastus",
    summary:
      "the glow on a horizon. light banked low, as if something is rising just out of frame.",
    provenance: [],
  },
  {
    slug: "kynnos",
    name: "Kynnös",
    summary:
      "tilled ground. a lit height field of long furrows, raked by a grazing lamp.",
    provenance: [],
  },
  {
    slug: "hehku",
    name: "Hehku",
    summary:
      "an ember. a knotted filament that blooms where it folds back over itself.",
    provenance: [],
  },
  {
    slug: "loimu",
    name: "Loimu",
    summary: "a flare. streamers of light drawn up through the dark and gone.",
    provenance: [],
  },
  {
    slug: "routa",
    name: "Routa",
    summary:
      "ground frost. low cells heave from underneath and split at their frozen seams.",
    provenance: [],
  },
  {
    slug: "vare",
    name: "Väre",
    summary:
      "a ripple. cosine ridges spreading across a surface you cannot quite see.",
    provenance: [],
  },
  {
    slug: "kuulto",
    name: "Kuulto",
    summary:
      "a shimmer through something. light arriving after it has passed through a body.",
    provenance: [],
  },
]);

export const CATALOG: CatalogEntry[] = [
  ...primitives,
  ...patterns,
  ...motion,
  ...sula,
  ...atmospheres,
];

export const SUB_EXPORTS: { slug: string; name: string; parent: string }[] = [
  { slug: "avatar-group", name: "AvatarGroup", parent: "avatar" },
  { slug: "glow-card", name: "GlowCard", parent: "card" },
  { slug: "reveal-group", name: "RevealGroup", parent: "reveal" },
  { slug: "skeleton-mirror", name: "SkeletonMirror", parent: "skeleton" },
];

export const subExportsOf = (
  slug: string,
): { slug: string; name: string; parent: string }[] =>
  SUB_EXPORTS.filter((entry) => entry.parent === slug);

export const byLayer = (layer: Layer): CatalogEntry[] =>
  CATALOG.filter((entry) => entry.layer === layer);

export const bySlug = (slug: string): CatalogEntry | undefined =>
  CATALOG.find((entry) => entry.slug === slug);

export const THEMES = ["kajo", "sisu", "savi"] as const;

/**
 * The theme the site opens in, and the one usva was extracted from.
 *
 * It lives here rather than in the theme provider because server components
 * compare against it. A value imported from a "use client" module arrives on
 * the server as a client reference rather than the string, so the comparison
 * silently returns false while the same code is correct once it hydrates.
 */
export const DEFAULT_THEME: (typeof THEMES)[number] = "kajo";

export const DARK_ONLY = ["kuulto", "hehku", "loimu", "kajastus"] as const;

export const counts = {
  primitives: byLayer("primitive").length,
  patterns: byLayer("pattern").length,
  motion: byLayer("motion").length,
  sula: byLayer("sula").length,
  atmospheres: byLayer("atmosphere").length,
  themes: THEMES.length,
  total: CATALOG.length,
};
