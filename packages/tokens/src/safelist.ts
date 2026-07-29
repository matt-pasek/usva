import { ROLE_NAMES } from "./roles.js";

export function toSafelistCSS(): string {
  return `@source inline("bg-{${ROLE_NAMES.join(",")}}");\n`;
}
