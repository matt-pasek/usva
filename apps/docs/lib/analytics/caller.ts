import type { RegistryCaller } from "./kinds";

const BOT = /bot|crawler|spider|crawling|preview|slurp|headless/i;

export function classifyCaller(headers: Headers): RegistryCaller {
  const agent = headers.get("user-agent") ?? "";
  if (BOT.test(agent)) return "bot";

  const mode = headers.get("sec-fetch-mode");
  const dest = headers.get("sec-fetch-dest");
  if (mode !== null || dest !== null) return "browser";

  if ((headers.get("accept") ?? "").includes("text/html")) return "browser";

  return "cli";
}
