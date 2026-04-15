import type { prerequisiteResults } from "@/domain/schema/prerequisite-results";

export type PrerequisiteResultRow = typeof prerequisiteResults.$inferSelect;
export type NewPrerequisiteResultRow = typeof prerequisiteResults.$inferInsert;
