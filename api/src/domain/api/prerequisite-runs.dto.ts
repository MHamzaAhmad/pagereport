import { z } from "zod";
import { prerequisiteRunStatusValues } from "@/domain/schema/prerequisite-runs";

export const prerequisiteRunStatusSchema = z.enum(prerequisiteRunStatusValues);

export const prerequisiteRunResponse = z.object({
	id: z.string(),
	reportId: z.string(),
	prerequisiteType: z.string(),
	status: prerequisiteRunStatusSchema,
	result: z.unknown().nullable(),
	error: z.string().nullable(),
	startedAt: z.string().nullable(),
	completedAt: z.string().nullable(),
	createdAt: z.string(),
	updatedAt: z.string(),
});
export type PrerequisiteRunResponse = z.infer<typeof prerequisiteRunResponse>;
