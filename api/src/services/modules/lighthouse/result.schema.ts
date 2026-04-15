import { z } from "zod";

export const LIGHTHOUSE_MODULE_TYPE = "lighthouse" as const;

const scoresSchema = z.object({
	performance: z.number().min(0).max(100),
	seo: z.number().min(0).max(100),
	accessibility: z.number().min(0).max(100),
});

const coreWebVitalsSchema = z.object({
	lcpMs: z.number().nullable(),
	cls: z.number().nullable(),
	inpMs: z.number().nullable(),
	fcpMs: z.number().nullable(),
	tbtMs: z.number().nullable(),
	speedIndexMs: z.number().nullable(),
});

const opportunitySchema = z.object({
	id: z.string().min(1),
	title: z.string().min(1),
	description: z.string(),
	estimatedSavingsMs: z.number().nullable(),
	displayValue: z.string().nullable(),
});

const auditSchema = z.object({
	scores: scoresSchema,
	coreWebVitals: coreWebVitalsSchema,
	opportunities: z.array(opportunitySchema).max(5),
	finalUrl: z.string().url(),
});

export const lighthouseResultSchema = z.object({
	mobile: auditSchema,
	desktop: auditSchema,
});

export type LighthouseResult = z.infer<typeof lighthouseResultSchema>;
