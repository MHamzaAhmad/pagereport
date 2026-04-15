import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const prerequisiteResults = sqliteTable(
	"prerequisite_results",
	{
		id: text("id").primaryKey(),
		prerequisiteType: text("prerequisite_type").notNull(),
		normalizedUrl: text("normalized_url").notNull(),
		resultJson: text("result_json").notNull(),
		computedAt: integer("computed_at", { mode: "timestamp_ms" })
			.notNull()
			.default(sql`(unixepoch() * 1000)`),
		createdAt: integer("created_at", { mode: "timestamp_ms" })
			.notNull()
			.default(sql`(unixepoch() * 1000)`),
		updatedAt: integer("updated_at", { mode: "timestamp_ms" })
			.notNull()
			.default(sql`(unixepoch() * 1000)`),
	},
	(table) => [
		uniqueIndex("prerequisite_results_type_url_unique").on(
			table.prerequisiteType,
			table.normalizedUrl,
		),
		index("prerequisite_results_type_computed_idx").on(table.prerequisiteType, table.computedAt),
	],
);
