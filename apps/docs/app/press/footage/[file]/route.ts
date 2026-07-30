import type { NextRequest } from "next/server";

const RELEASE =
  "https://github.com/matt-pasek/usva/releases/download/press-assets";

const FILES = new Set([
  "usva-launch.mp4",
  "usva-launch-vertical.mp4",
  "usva-clip-kuohu.mp4",
]);

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ file: string }> },
): Promise<Response> {
  const { file } = await params;
  if (!FILES.has(file)) return new Response(null, { status: 404 });

  const range = request.headers.get("range");
  const upstream = await fetch(`${RELEASE}/${file}`, {
    headers: range ? { range } : undefined,
    cache: "no-store",
  });

  if (!upstream.ok && upstream.status !== 206) {
    return new Response(null, { status: 502 });
  }

  const headers = new Headers();
  headers.set("content-type", "video/mp4");
  headers.set("cache-control", "public, max-age=3600, s-maxage=86400");
  headers.set("accept-ranges", "bytes");
  headers.set("content-disposition", `inline; filename="${file}"`);
  for (const key of ["content-length", "content-range", "etag"]) {
    const value = upstream.headers.get(key);
    if (value) headers.set(key, value);
  }

  return new Response(upstream.body, { status: upstream.status, headers });
}
