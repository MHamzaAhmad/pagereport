import { relations, sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { reports } from "@/domain/schema/reports";

export const moduleRunStatusValues = [
	"pending",
	"awaiting_prerequisites",
	"running",
	"completed",
	"failed",
] as const;
export type ModuleRunStatus = (typeof moduleRunStatusValues)[number];

export const moduleRuns = sqliteTable(
	"module_runs",
	{
		id: text("id").primaryKey(),
		reportId: text("report_id")
			.notNull()
			.references(() => reports.id, { onDelete: "cascade" }),
		moduleType: text("module_type").notNull(),
		status: text("status", { enum: moduleRunStatusValues }).notNull().default("pending"),
		resultJson: text("result_json"),
		error: text("error"),
		workflowInstanceId: text("workflow_instance_id"),
		startedAt: integer("started_at", { mode: "timestamp_ms" }),
		completedAt: integer("completed_at", { mode: "timestamp_ms" }),
		createdAt: integer("created_at", { mode: "timestamp_ms" })
			.notNull()
			.default(sql`(unixepoch() * 1000)`),
		updatedAt: integer("updated_at", { mode: "timestamp_ms" })
			.notNull()
			.default(sql`(unixepoch() * 1000)`),
	},
	(table) => [
		uniqueIndex("module_runs_report_module_unique").on(table.reportId, table.moduleType),
		index("module_runs_report_idx").on(table.reportId),
	],
);

export const moduleRunsRelations = relations(moduleRuns, ({ one }) => ({
	report: one(reports, {
		fields: [moduleRuns.reportId],
		references: [reports.id],
	}),
}));
