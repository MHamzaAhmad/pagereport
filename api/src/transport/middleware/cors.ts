import { cors } from "hono/cors";
import { createMiddleware } from "hono/factory";
import type { AppEnv } from "@/transport/http/types";

const DEFAULT_DEV_ORIGIN = "http://localhost:5173";
const WILDCARD = "*";

function parseAllowedOrigins(raw: string | undefined): string[] {
	if (!raw || raw.trim().length === 0) return [DEFAULT_DEV_ORIGIN];
	return raw
		.split(",")
		.map((value) => value.trim())
		.filter((value) => value.length > 0);
}

function resolveOrigin(allowed: string[], requestOrigin: string): string | null {
	if (allowed.includes(WILDCARD)) return requestOrigin || WILDCARD;
	return allowed.includes(requestOrigin) ? requestOrigin : null;
}

export const corsMiddleware = createMiddleware<AppEnv>((c, next) => {
	const allowed = parseAllowedOrigins(c.env.CORS_ALLOWED_ORIGINS);
	const handler = cors({
		origin: (origin) => resolveOrigin(allowed, origin),
		allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
		allowHeaders: ["Content-Type", "Accept", "Authorization"],
		exposeHeaders: ["Content-Length"],
		maxAge: 86400,
	});
	return handler(c, next);
});
