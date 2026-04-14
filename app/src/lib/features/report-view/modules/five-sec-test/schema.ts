import { z } from 'zod';

export const FIVE_SEC_TEST_MODULE_TYPE = 'five_sec_test' as const;

export const fiveSecTestResultSchema = z.object({
	summary: z.string().min(1),
	whatItsAbout: z.string().min(1),
	primaryAction: z.string().min(1),
	impressions: z.array(z.string().min(1)).min(1).max(5)
});

export type FiveSecTestResult = z.infer<typeof fiveSecTestResultSchema>;
