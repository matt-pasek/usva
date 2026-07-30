import dtcg from "@usva-ui/tokens/tokens.dtcg.json";

export const dynamic = "force-static";

export function GET() {
  return new Response(JSON.stringify(dtcg, null, 2), {
    headers: { "content-type": "application/json" },
  });
}
