import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const reports = sqliteTable("reports", {
	id: text("id").primaryKey(),
	url: text("url").notNull(),
	createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
});
