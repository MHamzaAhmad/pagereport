import { z } from 'zod';

export const TRUST_SOCIAL_PROOF_AUDIT_MODULE_TYPE = 'trust_social_proof_audit' as const;

export const URGENCY_TYPES = ['none', 'stock', 'timer', 'limited_offer', 'mixed'] as const;
export type UrgencyType = (typeof URGENCY_TYPES)[number];

const testimonialsSchema = z.object({
	present: z.boolean(),
	count: z.number().int().min(0),
	hasNames: z.boolean(),
	hasPhotos: z.boolean(),
	examples: z.array(z.string().min(1).max(280)).max(3)
});

const reviewsRatingsSchema = z.object({
	present: z.boolean(),
	averageRating: z.number().min(0).max(5).nullable(),
	reviewCount: z.number().int().min(0).nullable(),
	source: z.string().min(1).max(80).nullable()
});

const trustBadgesSchema = z.object({
	ssl: z.boolean(),
	paymentLogos: z.boolean(),
	securityCertifications: z.boolean(),
	detectedBadges: z.array(z.string().min(1).max(80)).max(10)
});

const guaranteesSchema = z.object({
	moneyBack: z.boolean(),
	freeOrFastShipping: z.boolean(),
	warranty: z.boolean(),
	details: z.array(z.string().min(1).max(160)).max(5)
});

const socialProofSchema = z.object({
	customerLogos: z.boolean(),
	pressMentions: z.boolean(),
	userCounts: z.boolean(),
	influencerOrExpert: z.boolean(),
	notes: z.array(z.string().min(1).max(160)).max(5)
});

const urgencyScarcitySchema = z.object({
	present: z.boolean(),
	type: z.enum(URGENCY_TYPES),
	feelsAuthentic: z.boolean()
});

const quickWinSchema = z.object({
	title: z.string().min(1).max(100),
	detail: z.string().min(1).max(280)
});

export const trustSocialProofAuditResultSchema = z.object({
	overallScore: z.number().int().min(0).max(100),
	verdict: z.string().min(1).max(240),
	signals: z.object({
		testimonials: testimonialsSchema,
		reviewsRatings: reviewsRatingsSchema,
		trustBadges: trustBadgesSchema,
		guarantees: guaranteesSchema,
		socialProof: socialProofSchema,
		urgencyScarcity: urgencyScarcitySchema
	}),
	gaps: z.array(z.string().min(1).max(200)).max(8),
	redFlags: z.array(z.string().min(1).max(200)).max(5),
	quickWins: z.array(quickWinSchema).max(5)
});

export type TrustSocialProofAuditResult = z.infer<typeof trustSocialProofAuditResultSchema>;
export type TrustTestimonials = z.infer<typeof testimonialsSchema>;
export type TrustReviewsRatings = z.infer<typeof reviewsRatingsSchema>;
export type TrustBadges = z.infer<typeof trustBadgesSchema>;
export type TrustGuarantees = z.infer<typeof guaranteesSchema>;
export type TrustSocialProof = z.infer<typeof socialProofSchema>;
export type TrustUrgencyScarcity = z.infer<typeof urgencyScarcitySchema>;
export type TrustQuickWin = z.infer<typeof quickWinSchema>;
