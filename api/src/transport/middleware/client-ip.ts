import type { Context } from "hono";
import type { AppEnv } from "@/transport/http/types";

export const UNKNOWN_IP = "unknown-ip";

export function getClientIp(c: Context<AppEnv>): string {
	return c.req.header("cf-connecting-ip")?.trim() || UNKNOWN_IP;
}
