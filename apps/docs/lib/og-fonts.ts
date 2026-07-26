/** Satori reads ttf, otf and woff, never woff2. fontsource ships both. */
export const OG_FONT_DIR = "assets/fonts";

export interface OgFont {
  /** The fontsource specifier this face is synced from. */
  source: string;
  file: string;
  family: "Fira Sans" | "Fira Code";
  weight: 400 | 500 | 800;
}

export const OG_FONTS: OgFont[] = [
  {
    source: "@fontsource/fira-sans/files/fira-sans-latin-400-normal.woff",
    file: "fira-sans-400.woff",
    family: "Fira Sans",
    weight: 400,
  },
  {
    source: "@fontsource/fira-sans/files/fira-sans-latin-800-normal.woff",
    file: "fira-sans-800.woff",
    family: "Fira Sans",
    weight: 800,
  },
  {
    source: "@fontsource/fira-code/files/fira-code-latin-500-normal.woff",
    file: "fira-code-500.woff",
    family: "Fira Code",
    weight: 500,
  },
];
