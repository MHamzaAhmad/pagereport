import { z } from "zod";

export const TOP_PERFORMERS_MODULE_TYPE = "top_performers" as const;

export const topPerformerPageSchema = z.object({
	name: z.string().min(1),
	website: z.string().url(),
	icon: z.string().url().nullable(),
	description: z.string().min(1),
	category: z.string().min(1),
	revenueLast30DaysCents: z.number().nonnegative(),
	mrrCents: z.number().nonnegative().nullable(),
	customers: z.number().int().nonnegative().nullable(),
	growth30d: z.number().nullable(),
});
export type TopPerformerPage = z.infer<typeof topPerformerPageSchema>;

export const topPerformersResultSchema = z.object({
	matchedCategories: z.array(z.string().min(1)).min(1).max(2),
	rationale: z.string().min(1),
	pages: z.array(topPerformerPageSchema).max(4),
});
export type TopPerformersResult = z.infer<typeof topPerformersResultSchema>;
