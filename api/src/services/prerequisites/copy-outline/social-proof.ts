import type { ParsedSection } from "@/services/prerequisites/copy-outline/types";

export interface SocialProof {
	testimonialCount: number;
	numberCalloutCount: number;
	logoWallDetected: boolean;
	sampleTestimonials: string[];
}

export function detectSocialProof(
	sections: readonly ParsedSection[],
	plainText: string,
): SocialProof {
	const quotePattern = /[“"']([^“"']{20,})[”"']/g;
	const quotes: string[] = [];
	for (const match of plainText.matchAll(quotePattern)) {
		const captured = match[1];
		if (!captured) continue;
		quotes.push(captured.trim());
		if (quotes.length >= 3) break;
	}
	const numberCallouts = plainText.match(/\b(\d{1,3}(?:,\d{3})+|\d+(?:\.\d+)?[%kKmM+])\b/g) ?? [];
	const logoWallDetected = sections.some((s) => {
		const heading = s.heading?.toLowerCase() ?? "";
		return /trusted by|as seen on|featured in|customers/.test(heading);
	});
	return {
		testimonialCount: quotes.length,
		numberCalloutCount: numberCallouts.length,
		logoWallDetected,
		sampleTestimonials: quotes.slice(0, 3),
	};
}
