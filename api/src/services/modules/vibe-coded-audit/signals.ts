export interface DomSignals {
	readonly gradientCount: number;
	readonly svgCount: number;
	readonly iconClassCount: number;
	readonly emojiCount: number;
	readonly cardGridHits: number;
	readonly sparkleBadgeHits: number;
	readonly totalNodes: number;
}

const GRADIENT_RE = /bg-gradient-|from-\w+-\d+|linear-gradient\(|radial-gradient\(/gi;
const SVG_RE = /<svg\b/gi;
const ICON_CLASS_RE = /\b(lucide-|phosphor-|heroicon|fa-[a-z]|\bph-[a-z]|i-mdi-|i-lucide-)/gi;
const EMOJI_RE = /\p{Extended_Pictographic}/gu;
const CARD_GRID_RE = /grid-cols-[234][^"']{0,400}?<svg\b/gi;
const SPARKLE_BADGE_RE = /(✨|sparkle|badge[^<]{0,40}new)/gi;
const NODE_RE = /<[a-z]/gi;

const HERO_CHAR_WINDOW = 2000;

function countMatches(source: string, regex: RegExp): number {
	const matches = source.match(regex);
	return matches ? matches.length : 0;
}

export function extractDomSignals(html: string | null): DomSignals {
	if (html === null || html.length === 0) {
		return {
			gradientCount: 0,
			svgCount: 0,
			iconClassCount: 0,
			emojiCount: 0,
			cardGridHits: 0,
			sparkleBadgeHits: 0,
			totalNodes: 0,
		};
	}

	const heroSlice = html.slice(0, HERO_CHAR_WINDOW);

	return {
		gradientCount: countMatches(html, GRADIENT_RE),
		svgCount: countMatches(html, SVG_RE),
		iconClassCount: countMatches(html, ICON_CLASS_RE),
		emojiCount: countMatches(html, EMOJI_RE),
		cardGridHits: countMatches(html, CARD_GRID_RE),
		sparkleBadgeHits: countMatches(heroSlice, SPARKLE_BADGE_RE),
		totalNodes: countMatches(html, NODE_RE),
	};
}
