import type { reportPurchases } from "@/domain/schema/report-purchases";

export type ReportPurchase = typeof reportPurchases.$inferSelect;
export type NewReportPurchase = typeof reportPurchases.$inferInsert;
