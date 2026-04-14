import type { moduleRuns } from "@/domain/schema/module-runs";

export type ModuleRun = typeof moduleRuns.$inferSelect;
export type NewModuleRun = typeof moduleRuns.$inferInsert;
