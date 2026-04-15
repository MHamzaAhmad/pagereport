import type { prerequisiteRuns } from "@/domain/schema/prerequisite-runs";

export type PrerequisiteRun = typeof prerequisiteRuns.$inferSelect;
export type NewPrerequisiteRun = typeof prerequisiteRuns.$inferInsert;
