import config from "../../../usva.config.json" with { type: "json" };

export const SITE_ORIGIN: string = config.siteOrigin;
export const NPM_SCOPE: string = config.npmScope;
export const PACKAGE_NAME: string = config.packageName;

export const registryUrl = (name: string): string =>
  `${SITE_ORIGIN}/r/${name}.json`;
