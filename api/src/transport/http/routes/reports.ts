import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createReportInput } from "@/domain/api";
import type { AppEnv } from "@/transport/http/types";

export const reportsRouter = new Hono<AppEnv>()
	.post("/", zValidator("json", createReportInput), async (c) => {
		const input = c.req.valid("json");
		const report = await c.var.container.services.reports.create(input);
		return c.json(report, 201);
	})
	.get("/:id", async (c) => {
		const id = c.req.param("id");
		const report = await c.var.container.services.reports.get(id);
		if (!report) {
			return c.json({ error: "not found" }, 404);
		}
		return c.json(report);
	});
