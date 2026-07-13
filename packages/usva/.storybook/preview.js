import * as React from "react";
import "./preview.css";

const THEMES = ["kajo", "sisu", "savi"];

const withTheme = (Story, context) =>
  React.createElement(
    "div",
    {
      "data-theme": context.globals.theme ?? "kajo",
      style: { padding: "2rem" },
    },
    React.createElement(Story),
  );

const preview = {
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
        items: THEMES.map((value) => ({ value, title: value })),
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
