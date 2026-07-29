import { agentSkill } from "@/lib/agent-skill";

export const dynamic = "force-static";

export function GET(): Response {
  return new Response(agentSkill(), {
    headers: { "content-type": "text/markdown; charset=utf-8" },
  });
}
