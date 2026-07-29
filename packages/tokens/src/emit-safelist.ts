import { writeFileSync } from "node:fs";
import { toSafelistCSS } from "./safelist.js";

writeFileSync(
  new URL("../dist/roles-safelist.css", import.meta.url),
  toSafelistCSS(),
);
