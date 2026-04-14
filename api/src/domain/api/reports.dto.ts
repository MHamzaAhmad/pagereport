import { z } from "zod";
import { moduleRunResponse } from "@/domain/api/module-runs.dto";

export const createReportInput = z.object({
	url: z.string().url(),
});
export type CreateReportInput = z.infer<typeof createReportInput>;

export const reportResponse = z.object({
	id: z.string(),
	url: z.string(),
	createdAt: z.string(),
});
export type ReportResponse = z.infer<typeof reportResponse>;

export const reportWithModulesResponse = reportResponse.extend({
	moduleRuns: z.array(moduleRunResponse),
});
export type ReportWithModulesResponse = z.infer<typeof reportWithModulesResponse>;
