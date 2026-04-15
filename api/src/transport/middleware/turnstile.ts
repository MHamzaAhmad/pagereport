import { createMiddleware } from "hono/factory";
import type { AppEnv } from "@/transport/http/types";
import { getClientIp } from "@/transport/middleware/client-ip";

const TOKEN_HEADER = "cf-turnstile-token";

export const turnstileMiddleware = createMiddleware<AppEnv>(async (c, next) => {
	const { turnstile } = c.var.container.services;
	if (!turnstile.isEnabled) {
		await next();
		return;
	}

	const token = c.req.header(TOKEN_HEADER)?.trim() ?? "";
	const ip = getClientIp(c);
	const result = await turnstile.verify(token, ip);

	if (!result.success) {
		return c.json(
			{
				error: "turnstile_failed",
				errorCodes: result.errorCodes,
			},
			403,
		);
	}

	await next();
});
