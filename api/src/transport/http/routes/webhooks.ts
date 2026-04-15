import { Hono } from "hono";
import { PaymentWebhookVerificationError } from "@/external";
import type { AppEnv } from "@/transport/http/types";

export const webhooksRouter = new Hono<AppEnv>().post("/polar", async (c) => {
	const rawBody = await c.req.raw.clone().text();
	const headers: Record<string, string> = {};
	c.req.raw.headers.forEach((value, key) => {
		headers[key.toLowerCase()] = value;
	});

	const { purchases } = c.var.container.services;
	try {
		await purchases.handleWebhook(rawBody, headers);
	} catch (err) {
		if (err instanceof PaymentWebhookVerificationError) {
			return c.json({ error: "invalid signature" }, 401);
		}
		throw err;
	}
	return c.json({ received: true });
});
