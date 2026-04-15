import { relations, sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { moduleRunStatusValues } from "@/domain/schema/module-runs";
import { prerequisiteResults } from "@/domain/schema/prerequisite-results";
import { reports } from "@/domain/schema/reports";

export const prerequisiteRunStatusValues = moduleRunStatusValues;
export type PrerequisiteRunStatus = (typeof prerequisiteRunStatusValues)[number];

export const prerequisiteRuns = sqliteTable(
	"prerequisite_runs",
	{
		id: text("id").primaryKey(),
		reportId: text("report_id")
			.notNull()
			.references(() => reports.id, { onDelete: "cascade" }),
		prerequisiteType: text("prerequisite_type").notNull(),
		status: text("status", { enum: prerequisiteRunStatusValues }).notNull().default("pending"),
		prerequisiteResultId: text("prerequisite_result_id").references(() => prerequisiteResults.id, {
			onDelete: "set null",
		}),
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
		uniqueIndex("prerequisite_runs_report_type_unique").on(table.reportId, table.prerequisiteType),
		index("prerequisite_runs_report_idx").on(table.reportId),
	],
);

export const prerequisiteRunsRelations = relations(prerequisiteRuns, ({ one }) => ({
	report: one(reports, {
		fields: [prerequisiteRuns.reportId],
		references: [reports.id],
	}),
	result: one(prerequisiteResults, {
		fields: [prerequisiteRuns.prerequisiteResultId],
		references: [prerequisiteResults.id],
	}),
}));
