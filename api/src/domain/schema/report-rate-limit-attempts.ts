import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const reportRateLimitAttempts = sqliteTable(
	"report_rate_limit_attempts",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		ip: text("ip").notNull(),
		createdAt: integer("created_at").notNull(),
	},
	(table) => [index("report_rate_limit_attempts_ip_time_idx").on(table.ip, table.createdAt)],
);
