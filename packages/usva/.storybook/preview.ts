import type { Decorator, Preview } from "@storybook/react-vite";
import * as React from "react";
import "./preview.css";

/**
 * The theme goes on <html>, not on the wrapper, because Base UI portals every
 * overlay to document.body. A wrapper leaves those outside the themed subtree,
 * so a Select popup renders kajo's dark surface over a light savi page. This
 * also matches how a consuming app themes: on the root.
 *
 * The wrapper still paints the ground, since body would otherwise stay
 * unpainted and savi components would sit on nothing.
 */
const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme ?? "kajo";

  React.useLayoutEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return React.createElement(
    "div",
    {
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
