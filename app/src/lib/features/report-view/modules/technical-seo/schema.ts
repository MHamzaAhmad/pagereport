import { z } from 'zod';

export const TECHNICAL_SEO_MODULE_TYPE = 'technical_seo' as const;

export const TECHNICAL_SEO_STATUSES = ['ok', 'warning', 'critical'] as const;
export type TechnicalSeoStatus = (typeof TECHNICAL_SEO_STATUSES)[number];

export const TECHNICAL_SEO_CORE_CHECK_KEYS = [
	'title',
	'metaDescription',
	'canonical',
	'viewport',
	'robots',
	'lang',
	'favicon',
	'charset'
] as const;
export type TechnicalSeoCoreCheckKey = (typeof TECHNICAL_SEO_CORE_CHECK_KEYS)[number];

export const TECHNICAL_SEO_OG_CHECK_KEYS = [
	'ogTitle',
	'ogDescription',
	'ogImage',
	'ogUrl',
	'ogType'
] as const;
export type TechnicalSeoOgCheckKey = (typeof TECHNICAL_SEO_OG_CHECK_KEYS)[number];

export const TECHNICAL_SEO_TWITTER_CHECK_KEYS = [
	'twitterCard',
	'twitterTitle',
	'twitterDescription',
	'twitterImage'
] as const;
export type TechnicalSeoTwitterCheckKey = (typeof TECHNICAL_SEO_TWITTER_CHECK_KEYS)[number];

export const TECHNICAL_SEO_STRUCTURED_CHECK_KEYS = ['jsonLd'] as const;
export type TechnicalSeoStructuredCheckKey = (typeof TECHNICAL_SEO_STRUCTURED_CHECK_KEYS)[number];

const checkSchema = z.object({
	status: z.enum(TECHNICAL_SEO_STATUSES),
	note: z.string().min(1).max(200)
});

const coreChecksSchema = z.object({
	title: checkSchema,
	metaDescription: checkSchema,
	canonical: checkSchema,
	viewport: checkSchema,
	robots: checkSchema,
	lang: checkSchema,
	favicon: checkSchema,
	charset: checkSchema
});

const openGraphChecksSchema = z.object({
	ogTitle: checkSchema,
	ogDescription: checkSchema,
	ogImage: checkSchema,
	ogUrl: checkSchema,
	ogType: checkSchema
});

const twitterChecksSchema = z.object({
	twitterCard: checkSchema,
	twitterTitle: checkSchema,
	twitterDescription: checkSchema,
	twitterImage: checkSchema
});

const structuredDataChecksSchema = z.object({
	jsonLd: checkSchema
});

const metadataSchema = z.object({
	title: z.string().nullable(),
	titleLength: z.number().int().min(0),
	metaDescription: z.string().nullable(),
	metaDescriptionLength: z.number().int().min(0),
	canonical: z.string().nullable(),
	viewport: z.string().nullable(),
	robots: z.string().nullable(),
	lang: z.string().nullable(),
	favicon: z.string().nullable(),
	charset: z.string().nullable(),
	ogTitle: z.string().nullable(),
	ogDescription: z.string().nullable(),
	ogImage: z.string().nullable(),
	ogUrl: z.string().nullable(),
	ogType: z.string().nullable(),
	twitterCard: z.string().nullable(),
	twitterTitle: z.string().nullable(),
	twitterDescription: z.string().nullable(),
	twitterImage: z.string().nullable(),
	jsonLdBlockCount: z.number().int().min(0),
	jsonLdTypes: z.array(z.string().min(1).max(120)).max(20)
});

export const technicalSeoResultSchema = z.object({
	overallStatus: z.enum(TECHNICAL_SEO_STATUSES),
	overallScore: z.number().int().min(0).max(100),
	verdict: z.string().min(1).max(240),
	metadata: metadataSchema,
	checks: z.object({
		core: coreChecksSchema,
		openGraph: openGraphChecksSchema,
		twitter: twitterChecksSchema,
		structuredData: structuredDataChecksSchema
	}),
	issues: z.array(z.string().min(1).max(200)).max(8),
	quickWins: z.array(z.string().min(1).max(200)).max(8)
});

export type TechnicalSeoCheck = z.infer<typeof checkSchema>;
export type TechnicalSeoMetadata = z.infer<typeof metadataSchema>;
export type TechnicalSeoResult = z.infer<typeof technicalSeoResultSchema>;
