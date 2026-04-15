import { z } from 'zod';

export const VIBE_CODED_AUDIT_MODULE_TYPE = 'vibe_coded_audit' as const;

export const VIBE_CODED_VERDICTS = [
	'looks_custom',
	'possibly_vibe_coded',
	'likely_vibe_coded'
] as const;
export type VibeCodedVerdict = (typeof VIBE_CODED_VERDICTS)[number];

export const VIBE_CODED_PATTERNS = [
	'gradient_overuse',
	'icon_overuse',
	'icon_card_grid',
	'generic_template_look',
	'emoji_bullets',
	'hero_sparkle_badge',
	'repetitive_sections'
] as const;
export type VibeCodedPattern = (typeof VIBE_CODED_PATTERNS)[number];

export const VIBE_CODED_SEVERITIES = ['low', 'medium', 'high'] as const;
export type VibeCodedSeverity = (typeof VIBE_CODED_SEVERITIES)[number];

const signalSchema = z.object({
	pattern: z.enum(VIBE_CODED_PATTERNS),
	observation: z.string().min(1).max(240),
	severity: z.enum(VIBE_CODED_SEVERITIES)
});

export const vibeCodedAuditResultSchema = z.object({
	verdict: z.enum(VIBE_CODED_VERDICTS),
	confidenceScore: z.number().int().min(0).max(100),
	summary: z.string().min(1).max(400),
	signals: z.array(signalSchema).max(6)
});

export type VibeCodedAuditResult = z.infer<typeof vibeCodedAuditResultSchema>;
export type VibeCodedSignal = z.infer<typeof signalSchema>;
