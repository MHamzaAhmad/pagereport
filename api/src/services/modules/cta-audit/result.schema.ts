import { z } from "zod";

export const CTA_AUDIT_MODULE_TYPE = "cta_audit" as const;

export const CTA_AUDIT_STATUSES = ["ok", "warning", "critical"] as const;
export type CtaAuditStatus = (typeof CTA_AUDIT_STATUSES)[number];

export const CTA_HREF_STATUSES = [
	"valid",
	"anchor_only",
	"javascript_void",
	"empty_or_missing",
	"mailto_tel",
] as const;
export type CtaHrefStatus = (typeof CTA_HREF_STATUSES)[number];

export const CTA_AUDIT_CHECK_KEYS = [
	"hasPrimaryCta",
	"aboveTheFold",
	"hrefWorks",
	"visuallyProminent",
] as const;
export type CtaAuditCheckKey = (typeof CTA_AUDIT_CHECK_KEYS)[number];

const checkSchema = z.object({
	status: z.enum(CTA_AUDIT_STATUSES),
	note: z.string().min(1).max(200),
});

const primaryCtaSchema = z.object({
	detected: z.boolean(),
	text: z.string().min(1).max(200).nullable(),
	href: z.string().max(500).nullable(),
	visibleAboveFold: z.boolean(),
	hrefStatus: z.enum(CTA_HREF_STATUSES),
});

export const ctaAuditResultSchema = z.object({
	overallStatus: z.enum(CTA_AUDIT_STATUSES),
	verdict: z.string().min(1).max(200),
	primaryCta: primaryCtaSchema,
	secondaryCtaCount: z.number().int().min(0),
	checks: z.object({
		hasPrimaryCta: checkSchema,
		aboveTheFold: checkSchema,
		hrefWorks: checkSchema,
		visuallyProminent: checkSchema,
	}),
	issues: z.array(z.string().min(1).max(200)).max(5),
	quickFixes: z.array(z.string().min(1).max(200)).max(5),
});

export type CtaAuditResult = z.infer<typeof ctaAuditResultSchema>;
export type CtaAuditCheck = z.infer<typeof checkSchema>;
export type CtaAuditPrimaryCta = z.infer<typeof primaryCtaSchema>;
