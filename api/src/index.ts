import { Hono } from "hono";
import { reportsRouter } from "@/transport/http/routes/reports";
import type { AppEnv } from "@/transport/http/types";
import { containerMiddleware } from "@/transport/middleware/container";

const app = new Hono<AppEnv>();

app.use("*", containerMiddleware);

app.get("/message", (c) => c.text("Hello Hono!"));

app.route("/reports", reportsRouter);

export default app;
