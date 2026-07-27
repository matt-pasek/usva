import {
  type NextFetchEvent,
  type NextRequest,
  NextResponse,
} from "next/server";
import { classifyCaller } from "@/lib/analytics/caller";
import { countRegistryFetch } from "@/lib/analytics/counters";

export function proxy(request: NextRequest, event: NextFetchEvent) {
  const component = /^\/r\/([a-z-]+)\.json$/.exec(
    request.nextUrl.pathname,
  )?.[1];
  if (component && request.method === "GET") {
    event.waitUntil(
      countRegistryFetch(component, classifyCaller(request.headers)),
    );
  }
  return NextResponse.next();
}

export const config = { matcher: "/r/:path*" };
