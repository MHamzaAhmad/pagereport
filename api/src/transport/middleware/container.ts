import { createMiddleware } from "hono/factory";
import { buildContainer, type Container } from "@/container";
import type { AppEnv } from "@/transport/http/types";

export const containerMiddleware = createMiddleware<AppEnv>(async (c, next) => {
	const container: Container = buildContainer(c.env);
	c.set("container", container);
	await next();
});
