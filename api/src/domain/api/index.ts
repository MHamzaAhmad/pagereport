import { z } from "zod";

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
