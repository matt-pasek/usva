import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;
  const base = name.replace(/\.json$/, "");
  if (!/^[a-z-]+$/.test(base))
    return new NextResponse("bad name", { status: 400 });
  try {
    const file = resolve(process.cwd(), "../../registry/r", `${base}.json`);
    const body = await readFile(file, "utf8");
    return new NextResponse(body, {
      headers: { "content-type": "application/json" },
    });
  } catch {
    return new NextResponse("not found", { status: 404 });
  }
}
