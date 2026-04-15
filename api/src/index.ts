import { Hono } from "hono";
import { reportsRouter } from "@/transport/http/routes/reports";
import { webhooksRouter } from "@/transport/http/routes/webhooks";
import type { AppEnv } from "@/transport/http/types";
import { containerMiddleware } from "@/transport/middleware/container";
import { corsMiddleware } from "@/transport/middleware/cors";

export { ModuleRunWorkflow } from "@/workflows/module-run.workflow";
export { PrerequisiteRunWorkflow } from "@/workflows/prerequisite-run.workflow";

const app = new Hono<AppEnv>();

app.use("*", corsMiddleware);
app.use("*", containerMiddleware);

app.get("/message", (c) => c.text("Hello Hono!"));

app.route("/reports", reportsRouter);
app.route("/webhooks", webhooksRouter);

export default app;
