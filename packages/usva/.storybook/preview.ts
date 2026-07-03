import type { Decorator, Preview } from "@storybook/react-vite";
import * as React from "react";
import "./preview.css";

const withTheme: Decorator = (Story, context) => {
  const theme = context.globals.theme ?? "kajo";
  return React.createElement(
    "div",
    { "data-theme": theme, style: { padding: "2rem" } },
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
