import { writeFileSync } from "node:fs";
import { toDTCG } from "./dtcg.js";

writeFileSync(
  new URL("../dist/tokens.dtcg.json", import.meta.url),
  JSON.stringify(toDTCG(), null, 2),
);
