import { z } from 'zod';

export const COPY_ANALYSIS_MODULE_TYPE = 'copy_analysis' as const;

export const COPY_FRAMINGS = ['problem_solution', 'product_first', 'mixed', 'unclear'] as const;
export type CopyFraming = (typeof COPY_FRAMINGS)[number];

export const COPY_DIMENSION_KEYS = [
	'headline_clarity',
	'value_prop',
	'problem_framing',
	'cta_strength',
	'proof',
	'reader_centricity',
	'specificity',
	'objection_handling'
] as const;
export type CopyDimensionKey = (typeof COPY_DIMENSION_KEYS)[number];

export const COPY_SEVERITIES = ['critical', 'warning', 'info', 'ok'] as const;
export type CopySeverity = (typeof COPY_SEVERITIES)[number];

export const STORY_BRAND_KEYS = [
	'userIsHero',
	'painNamed',
	'stakesClear',
	'guideRole',
	'planClear'
] as const;
export type StoryBrandKey = (typeof STORY_BRAND_KEYS)[number];

const storyBrandCheckSchema = z.object({
	score: z.number().int().min(0).max(2),
	evidence: z.string().max(400)
});

const storyBrandSchema = z.object({
	userIsHero: storyBrandCheckSchema,
	painNamed: storyBrandCheckSchema,
	stakesClear: storyBrandCheckSchema,
	guideRole: storyBrandCheckSchema,
	planClear: storyBrandCheckSchema
});

const extractedSchema = z.object({
	headline: z.string().nullable(),
	subheadline: z.string().nullable(),
	valueProp: z.string().nullable(),
	primaryCtaText: z.string().nullable()
});

const dimensionSchema = z.object({
	key: z.enum(COPY_DIMENSION_KEYS),
	score: z.number().int().min(0).max(5),
	severity: z.enum(COPY_SEVERITIES),
	finding: z.string().min(1).max(500),
	suggestion: z.string().min(1).max(500),
	exampleRewrite: z.string().max(400).nullable()
});

const quickWinSchema = z.object({
	currentText: z.string().min(1).max(400),
	rewrite: z.string().min(1).max(400),
	rationale: z.string().min(1).max(400),
	location: z.string().max(120).nullable()
});

export const copyAnalysisResultSchema = z.object({
	overallScore: z.number().int().min(0).max(100),
	verdict: z.string().min(1).max(200),
	framing: z.enum(COPY_FRAMINGS),
	extracted: extractedSchema,
	storyBrand: storyBrandSchema,
	dimensions: z.array(dimensionSchema).length(COPY_DIMENSION_KEYS.length),
	strengths: z.array(z.string().min(1).max(240)).max(6),
	criticalIssues: z.array(z.string().min(1).max(240)).max(6),
	quickWins: z.array(quickWinSchema).max(6)
});

export type CopyAnalysisResult = z.infer<typeof copyAnalysisResultSchema>;
export type CopyAnalysisDimension = z.infer<typeof dimensionSchema>;
export type CopyAnalysisQuickWin = z.infer<typeof quickWinSchema>;
export type CopyAnalysisStoryBrand = z.infer<typeof storyBrandSchema>;
export type CopyAnalysisStoryBrandCheck = z.infer<typeof storyBrandCheckSchema>;
export type CopyAnalysisExtracted = z.infer<typeof extractedSchema>;
