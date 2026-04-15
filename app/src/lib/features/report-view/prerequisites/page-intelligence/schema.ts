import { z } from 'zod';

export const PAGE_INTELLIGENCE_PREREQ_TYPE = 'page_intelligence' as const;

export const pageIntelligenceResultSchema = z.object({
	niche: z.string().min(1),
	summary: z.string().min(1),
	keywords: z.array(z.string().min(1)).min(1).max(20),
	products: z
		.array(
			z.object({
				name: z.string().min(1),
				description: z.string().nullable()
			})
		)
		.max(20)
});

export type PageIntelligenceResult = z.infer<typeof pageIntelligenceResultSchema>;
