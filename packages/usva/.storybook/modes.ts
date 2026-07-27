/**
 * Chromatic reuses a mode's *name* as the baseline key, so renaming one throws
 * away its history. Add modes, do not rename them.
 */
export const allModes = {
  kajo: { theme: "kajo" },
  sisu: { theme: "sisu" },
  savi: { theme: "savi" },
  "kajo narrow": { theme: "kajo", viewport: "narrow" },
  "sisu narrow": { theme: "sisu", viewport: "narrow" },
  "savi narrow": { theme: "savi", viewport: "narrow" },
} as const;

/** Every theme at the default width. The default for anything state-carrying. */
export const themeModes = {
  kajo: allModes.kajo,
  sisu: allModes.sisu,
  savi: allModes.savi,
};

/** Adds the narrow width, for components whose layout actually reflows. */
export const themeAndWidthModes = {
  ...themeModes,
  "kajo narrow": allModes["kajo narrow"],
  "sisu narrow": allModes["sisu narrow"],
  "savi narrow": allModes["savi narrow"],
};
