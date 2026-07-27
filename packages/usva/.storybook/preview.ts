import type { Decorator, Preview } from "@storybook/react-vite";
import * as React from "react";
import "./preview.css";

/**
 * The background has to be painted here rather than on `body`. kajo lives at
 * `:root` and the other two are `[data-theme]` scoped, so anything outside this
 * element resolves kajo's values whatever the toolbar says. Without it, every
 * savi snapshot is a light component photographed on a near-black ground.
 */
const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme ?? "kajo";
  return React.createElement(
    "div",
    {
      "data-theme": theme,
      style: {
        padding: "2rem",
        minHeight: "100vh",
        background: "var(--color-bg)",
        color: "var(--color-ink)",
      },
    },
    React.createElement(Story),
  );
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    viewport: {
      options: {
        narrow: { name: "narrow", styles: { width: "390px", height: "844px" } },
        wide: { name: "wide", styles: { width: "1280px", height: "800px" } },
      },
    },
  },
  globalTypes: {
    theme: {
      description: "usva theme",
      defaultValue: "kajo",
      toolbar: {
        title: "Theme",
        icon: "paintbrush",
        items: [
          { value: "kajo", title: "kajo" },
          { value: "sisu", title: "sisu" },
          { value: "savi", title: "savi" },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: "kajo",
  },
  decorators: [withTheme],
};

export default preview;
