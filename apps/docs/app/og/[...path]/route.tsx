import { ogCard } from "@/lib/og-card";
import { ogPaths, resolveCard } from "@/lib/og-content";

/** Enumerated at build time, so an unlisted path 404s instead of rendering. */
export const dynamicParams = false;

export function generateStaticParams(): { path: string[] }[] {
  return ogPaths().map((path) => ({ path }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
): Promise<Response> {
  const { path } = await params;
  return ogCard(resolveCard(path));
}
