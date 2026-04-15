import type { ParsedCta } from "@/services/prerequisites/copy-outline/types";

const CTA_VERB_PATTERN =
	/\b(get|start|try|buy|shop|sign\s*up|subscribe|join|book|request|download|learn|see|watch|claim|order|add|grab|unlock|discover|explore)\b/i;

const MAX_CTA_TEXT_LENGTH = 60;

export interface CtaCandidate {
	text: string;
	href: string | null;
	kind: "button" | "link";
	sectionHeading: string | null;
}

export function buildCta(candidate: CtaCandidate): ParsedCta | null {
	const text = normaliseText(candidate.text);
	if (!text) return null;
	if (text.length > MAX_CTA_TEXT_LENGTH) return null;
	if (!CTA_VERB_PATTERN.test(text)) return null;
	return {
		text,
		href: candidate.href?.trim() || null,
		kind: candidate.kind,
		isPrimary: false,
		sectionHeading: candidate.sectionHeading,
	};
}

function normaliseText(input: string): string {
	return input.replace(/\s+/g, " ").trim();
}
