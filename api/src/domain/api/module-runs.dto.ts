import { z } from "zod";
import { moduleRunStatusValues, moduleRunUnlockedViaValues } from "@/domain/schema/module-runs";

export const moduleRunStatusSchema = z.enum(moduleRunStatusValues);
export const moduleRunUnlockedViaSchema = z.enum(moduleRunUnlockedViaValues);

export const moduleRunResponse = z.object({
	id: z.string(),
	reportId: z.string(),
	moduleType: z.string(),
	status: moduleRunStatusSchema,
	unlockedVia: moduleRunUnlockedViaSchema.nullable(),
	result: z.unknown().nullable(),
	error: z.string().nullable(),
	startedAt: z.string().nullable(),
	completedAt: z.string().nullable(),
	createdAt: z.string(),
	updatedAt: z.string(),
});
export type ModuleRunResponse = z.infer<typeof moduleRunResponse>;
