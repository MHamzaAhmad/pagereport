import { z } from "zod";

export const TRUST_SOCIAL_PROOF_AUDIT_MODULE_TYPE = "trust_social_proof_audit" as const;

export const urgencyTypeValues = ["none", "stock", "timer", "limited_offer", "mixed"] as const;
export type UrgencyType = (typeof urgencyTypeValues)[number];

export const trustSocialProofAuditResultSchema = z.object({
	overallScore: z.number().int().min(0).max(100),
	verdict: z.string().min(1).max(240),
	signals: z.object({
		testimonials: z.object({
			present: z.boolean(),
			count: z.number().int().min(0),
			hasNames: z.boolean(),
			hasPhotos: z.boolean(),
			examples: z.array(z.string().min(1).max(280)).max(3),
		}),
		reviewsRatings: z.object({
			present: z.boolean(),
			averageRating: z.number().min(0).max(5).nullable(),
			reviewCount: z.number().int().min(0).nullable(),
			source: z.string().min(1).max(80).nullable(),
		}),
		trustBadges: z.object({
			ssl: z.boolean(),
			paymentLogos: z.boolean(),
			securityCertifications: z.boolean(),
			detectedBadges: z.array(z.string().min(1).max(80)).max(10),
		}),
		guarantees: z.object({
			moneyBack: z.boolean(),
			freeOrFastShipping: z.boolean(),
			warranty: z.boolean(),
			details: z.array(z.string().min(1).max(160)).max(5),
		}),
		socialProof: z.object({
			customerLogos: z.boolean(),
			pressMentions: z.boolean(),
			userCounts: z.boolean(),
			influencerOrExpert: z.boolean(),
			notes: z.array(z.string().min(1).max(160)).max(5),
		}),
		urgencyScarcity: z.object({
			present: z.boolean(),
			type: z.enum(urgencyTypeValues),
			feelsAuthentic: z.boolean(),
		}),
	}),
	gaps: z.array(z.string().min(1).max(200)).max(8),
	redFlags: z.array(z.string().min(1).max(200)).max(5),
	quickWins: z
		.array(
			z.object({
				title: z.string().min(1).max(100),
				detail: z.string().min(1).max(280),
			}),
		)
		.max(5),
});
export type TrustSocialProofAuditResult = z.infer<typeof trustSocialProofAuditResultSchema>;
