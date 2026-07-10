"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
require("./preview.css");
var withTheme = function (Story, context) {
    var _a;
    var theme = (_a = context.globals.theme) !== null && _a !== void 0 ? _a : "kajo";
    return React.createElement("div", { "data-theme": theme, style: { padding: "2rem" } }, React.createElement(Story));
};
var preview = {
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
exports.default = preview;
