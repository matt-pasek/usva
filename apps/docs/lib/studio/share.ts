import type { Config } from "@/components/docs/playground";

export interface ShareState {
  atmosphere: string;
  config: Config;
}

function toBase64Url(json: string): string {
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function fromBase64Url(token: string): string {
  const padded = token.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/** Compact { a: atmosphere, c: config } → base64url, safe in a query param. */
export function encodeShare(state: ShareState): string {
  return toBase64Url(JSON.stringify({ a: state.atmosphere, c: state.config }));
}

/** Reverse of encodeShare. Returns null on any malformed input. */
export function decodeShare(token: string): ShareState | null {
  try {
    const parsed = JSON.parse(fromBase64Url(token));
    if (
      !parsed ||
      typeof parsed.a !== "string" ||
      typeof parsed.c !== "object" ||
      parsed.c === null
    ) {
      return null;
    }
    return { atmosphere: parsed.a, config: parsed.c as Config };
  } catch {
    return null;
  }
}
