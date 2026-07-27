import type { NextRequest } from "next/server";
import { countCopy } from "@/lib/analytics/counters";
import type { CopyKind } from "@/lib/analytics/kinds";

export const dynamic = "force-dynamic";

const KINDS: CopyKind[] = ["install", "registry", "snippet"];
const NAME = /^[a-z0-9-]{1,48}$/;

const isSameOrigin = (request: NextRequest) => {
  const site = request.headers.get("sec-fetch-site");
  if (site !== null) return site === "same-origin";
  const origin = request.headers.get("origin");
  return origin === null || origin === request.nextUrl.origin;
};

export async function POST(request: NextRequest): Promise<Response> {
  if (!isSameOrigin(request)) return new Response(null, { status: 204 });

  try {
    const body = (await request.json()) as { kind?: string; name?: string };
    const kind = KINDS.find((k) => k === body.kind);
    if (kind && typeof body.name === "string" && NAME.test(body.name)) {
      await countCopy(kind, body.name);
    }
  } catch {
    /* Malformed body, and there is nothing to say about it. */
  }

  return new Response(null, { status: 204 });
}
