import type { reports } from "@/domain/schema";

export type Report = typeof reports.$inferSelect;
export type NewReport = typeof reports.$inferInsert;
