import { ogCard } from "@/lib/og-card";
import { ROOT_CARD } from "@/lib/og-content";

export const dynamic = "force-static";

export function GET() {
  return ogCard(ROOT_CARD);
}
