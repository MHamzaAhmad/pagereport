import { createMiddleware } from "hono/factory";
import type { AppEnv } from "@/transport/http/types";
import { getClientIp } from "@/transport/middleware/client-ip";

export const burstLimitMiddleware = createMiddleware<AppEnv>(async (c, next) => {
	const ip = getClientIp(c);
	const outcome = await c.env.BURST_LIMITER.limit({ key: ip });
	if (!outcome.success) {
		c.header("Retry-After", "60");
		return c.json(
			{
				error: "rate_limited",
				retryAfterSeconds: 60,
			},
			429,
		);
	}
	await next();
});
