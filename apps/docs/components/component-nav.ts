export type NavItem = { slug: string; label: string };
export type NavGroup = { label: string; items: NavItem[] };

export const componentNav: NavGroup[] = [
  {
    label: "Primitives",
    items: [
      { slug: "avatar", label: "Avatar" },
      { slug: "badge", label: "Badge" },
      { slug: "button", label: "Button" },
      { slug: "card", label: "Card" },
      { slug: "checkbox", label: "Checkbox" },
      { slug: "chip", label: "Chip" },
      { slug: "dialog", label: "Dialog" },
      { slug: "dropdown-menu", label: "Dropdown Menu" },
      { slug: "input", label: "Input" },
      { slug: "label", label: "Label" },
      { slug: "popover", label: "Popover" },
      { slug: "progress", label: "Progress" },
      { slug: "radio", label: "Radio" },
      { slug: "select", label: "Select" },
      { slug: "skeleton", label: "Skeleton" },
      { slug: "spinner", label: "Spinner" },
      { slug: "switch", label: "Switch" },
      { slug: "tabs", label: "Tabs" },
      { slug: "toast", label: "Toast" },
      { slug: "tooltip", label: "Tooltip" },
    ],
  },
  {
    label: "Patterns",
    items: [
      { slug: "bento-grid", label: "Bento Grid" },
      { slug: "section-label", label: "Section Label" },
      { slug: "stat-card", label: "Stat Card" },
      { slug: "empty-state", label: "Empty State" },
      { slug: "field-group", label: "Field Group" },
      { slug: "entity-card", label: "Entity Card" },
      { slug: "toolbar", label: "Toolbar" },
      { slug: "segmented-control", label: "Segmented Control" },
    ],
  },
];
