import { createMiddleware } from "hono/factory";
import type { AppEnv } from "@/transport/http/types";
import { getClientIp } from "@/transport/middleware/client-ip";

export const reportQuotaMiddleware = createMiddleware<AppEnv>(async (c, next) => {
	const ip = getClientIp(c);
	const nowSec = Math.floor(Date.now() / 1000);
	const { reportRateLimit } = c.var.container.services;

	const check = await reportRateLimit.checkQuota(ip, nowSec);
	if (!check.allowed) {
		c.header("Retry-After", String(check.retryAfterSeconds));
		return c.json(
			{
				error: "rate_limited",
				retryAfterSeconds: check.retryAfterSeconds,
			},
			429,
		);
	}

	await reportRateLimit.recordAttempt(ip, nowSec);
	await next();
});
