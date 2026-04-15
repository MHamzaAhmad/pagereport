import { relations, sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { reports } from "@/domain/schema/reports";

export const reportPurchaseStatusValues = ["pending", "completed", "failed", "expired"] as const;
export type ReportPurchaseStatus = (typeof reportPurchaseStatusValues)[number];

export const reportPurchases = sqliteTable(
	"report_purchases",
	{
		id: text("id").primaryKey(),
		reportId: text("report_id")
			.notNull()
			.references(() => reports.id, { onDelete: "cascade" }),
		provider: text("provider").notNull(),
		providerCheckoutId: text("provider_checkout_id").notNull(),
		providerEventId: text("provider_event_id"),
		status: text("status", { enum: reportPurchaseStatusValues }).notNull().default("pending"),
		amountCents: integer("amount_cents").notNull(),
		currency: text("currency").notNull(),
		createdAt: integer("created_at", { mode: "timestamp_ms" })
			.notNull()
			.default(sql`(unixepoch() * 1000)`),
		completedAt: integer("completed_at", { mode: "timestamp_ms" }),
	},
	(table) => [
		uniqueIndex("report_purchases_checkout_unique").on(table.providerCheckoutId),
		uniqueIndex("report_purchases_event_unique").on(table.providerEventId),
		index("report_purchases_report_idx").on(table.reportId),
	],
);

export const reportPurchasesRelations = relations(reportPurchases, ({ one }) => ({
	report: one(reports, {
		fields: [reportPurchases.reportId],
		references: [reports.id],
	}),
}));
