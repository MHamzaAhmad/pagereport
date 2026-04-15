import type {
	ParsedCta,
	ParsedHeading,
	ParsedSection,
} from "@/services/prerequisites/copy-outline/types";

export interface Hero {
	h1: string | null;
	subhead: string | null;
	heroParagraph: string | null;
	primaryCtaText: string | null;
}

export function buildHero(
	headings: readonly ParsedHeading[],
	sections: readonly ParsedSection[],
	ctas: readonly ParsedCta[],
): Hero {
	const firstH1 = headings.find((h) => h.level === 1) ?? null;
	const heroSection = firstH1
		? (sections.find((s) => s.heading === firstH1.text && s.headingLevel === 1) ?? null)
		: null;
	const heroParagraph = heroSection?.bodyText ? firstParagraph(heroSection.bodyText) : null;
	const subhead = heroSection?.bullets[0] ?? (heroParagraph ? firstSentence(heroParagraph) : null);
	const primaryCta = ctas.find((c) => c.isPrimary) ?? null;
	return {
		h1: firstH1?.text ?? null,
		subhead,
		heroParagraph,
		primaryCtaText: primaryCta?.text ?? null,
	};
}

function firstParagraph(body: string): string | null {
	const first = body.split(/\n\n+/)[0]?.trim();
	return first ? first : null;
}

function firstSentence(text: string): string | null {
	const match = /^(.+?[.!?])(\s|$)/.exec(text);
	if (match?.[1]) return match[1];
	return text.length < 160 ? text : null;
}
