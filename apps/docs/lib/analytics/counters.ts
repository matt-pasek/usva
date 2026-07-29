import { Redis } from "@upstash/redis";
import type { CopyKind, RegistryCaller } from "./kinds";

const url = process.env.UPSTASH_REDIS_REST_URL ?? process.env.KV_REST_API_URL;
const token =
  process.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.KV_REST_API_TOKEN;

const redis = url && token ? new Redis({ url, token }) : null;
const DAY_TTL = 400 * 24 * 60 * 60;

const today = () => new Date().toISOString().slice(0, 10);

export async function countRegistryFetch(
  component: string,
  caller: RegistryCaller,
): Promise<void> {
  if (!redis) return;
  try {
    const pipe = redis.pipeline();
    pipe.hincrby("usva:registry:caller", caller, 1);
    if (caller === "cli") {
      pipe.hincrby("usva:registry:total", component, 1);
      const day = `usva:registry:day:${today()}`;
      pipe.hincrby(day, component, 1);
      pipe.expire(day, DAY_TTL);
    }
    await pipe.exec();
  } catch {
    /* A dropped count is not worth a failed request. */
  }
}

export async function countCopy(kind: CopyKind, name: string): Promise<void> {
  if (!redis) return;
  try {
    await redis.hincrby(`usva:copy:${kind}`, name, 1);
  } catch {
    /* Same. */
  }
}
