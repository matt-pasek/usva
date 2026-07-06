import { readdirSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { NextResponse } from "next/server";

export const dynamic = "force-static";
export const dynamicParams = false;

const REGISTRY = resolve(process.cwd(), "../../registry/r");

export function generateStaticParams(): { name: string }[] {
  return readdirSync(REGISTRY)
    .filter((f) => f.endsWith(".json"))
    .map((f) => ({ name: f }));
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;
  const base = name.replace(/\.json$/, "");
  if (!/^[a-z-]+$/.test(base))
    return new NextResponse("bad name", { status: 400 });
  try {
    const body = await readFile(resolve(REGISTRY, `${base}.json`), "utf8");
    return new NextResponse(body, {
      headers: { "content-type": "application/json" },
    });
  } catch {
    return new NextResponse("not found", { status: 404 });
  }
}
