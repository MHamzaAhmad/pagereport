import { z } from "zod";

export const COPY_OUTLINE_PREREQ_TYPE = "copy_outline" as const;

const metaSchema = z.object({
	title: z.string().nullable(),
	description: z.string().nullable(),
	ogTitle: z.string().nullable(),
	ogDescription: z.string().nullable(),
});

const headingSchema = z.object({
	level: z.number().int().min(1).max(6),
	text: z.string().min(1),
	order: z.number().int().min(0),
});

const ctaSchema = z.object({
	text: z.string().min(1),
	href: z.string().nullable(),
	kind: z.enum(["button", "link"]),
	isPrimary: z.boolean(),
	sectionHeading: z.string().nullable(),
});

const sectionSchema = z.object({
	heading: z.string().nullable(),
	headingLevel: z.number().int().min(1).max(6).nullable(),
	bodyText: z.string(),
	bullets: z.array(z.string().min(1)),
});

const heroSchema = z.object({
	h1: z.string().nullable(),
	subhead: z.string().nullable(),
	heroParagraph: z.string().nullable(),
	primaryCtaText: z.string().nullable(),
});

const socialProofSchema = z.object({
	testimonialCount: z.number().int().min(0),
	numberCalloutCount: z.number().int().min(0),
	logoWallDetected: z.boolean(),
	sampleTestimonials: z.array(z.string().min(1)).max(3),
});

const readabilitySchema = z.object({
	wordCount: z.number().int().min(0),
	avgSentenceLength: z.number().min(0),
	youPronounCount: z.number().int().min(0),
	wePronounCount: z.number().int().min(0),
	iPronounCount: z.number().int().min(0),
	readerCentricityRatio: z.number().min(0),
});

export const copyOutlineResultSchema = z.object({
	sourceUrl: z.string().url(),
	meta: metaSchema,
	hero: heroSchema,
	headings: z.array(headingSchema),
	ctas: z.array(ctaSchema),
	sections: z.array(sectionSchema),
	socialProof: socialProofSchema,
	readability: readabilitySchema,
});

export type CopyOutlineResult = z.infer<typeof copyOutlineResultSchema>;
