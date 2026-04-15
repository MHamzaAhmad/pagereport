import {
	type CopyOutlineResult,
	copyOutlineResultSchema,
} from "@/services/prerequisites/copy-outline/result.schema";
import {
	PAGE_SCRAPE_PREREQ_TYPE,
	pageScrapeResultSchema,
} from "@/services/prerequisites/page-scrape/result.schema";
import type {
	PrerequisiteRunContext,
	PrerequisiteRunInput,
} from "@/services/prerequisites/registry";

interface MetaTags {
	title: string | null;
	description: string | null;
	ogTitle: string | null;
	ogDescription: string | null;
}

interface ParsedHeading {
	level: number;
	text: string;
	order: number;
}

interface ParsedCta {
	text: string;
	href: string | null;
	kind: "button" | "link";
	isPrimary: boolean;
	sectionHeading: string | null;
}

interface ParsedSection {
	heading: string | null;
	headingLevel: number | null;
	bodyText: string;
	bullets: string[];
}

export async function runCopyOutline(
	_input: PrerequisiteRunInput,
	{ prerequisites, step }: PrerequisiteRunContext,
): Promise<CopyOutlineResult> {
	const scrape = prerequisites.get(PAGE_SCRAPE_PREREQ_TYPE, pageScrapeResultSchema);

	const meta = await step.do("parse-meta", async () =>
		extractMetaTags(scrape.rawHtml, scrape.title),
	);
	const parsed = await step.do("parse-markdown", async () => parseMarkdown(scrape.markdown));

	const hero = buildHero(parsed.headings, parsed.sections, parsed.ctas);
	const readability = computeReadability(parsed.plainText);
	const socialProof = detectSocialProof(parsed.sections, parsed.plainText);

	return copyOutlineResultSchema.parse({
		sourceUrl: scrape.sourceUrl,
		meta,
		hero,
		headings: parsed.headings,
		ctas: parsed.ctas,
		sections: parsed.sections,
		socialProof,
		readability,
	});
}

async function extractMetaTags(
	html: string | null,
	fallbackTitle: string | null,
): Promise<MetaTags> {
	const result: MetaTags = {
		title: fallbackTitle?.trim() || null,
		description: null,
		ogTitle: null,
		ogDescription: null,
	};

	if (!html) return result;

	let titleBuffer = "";

	const rewriter = new HTMLRewriter()
		.on("title", {
			text(chunk) {
				titleBuffer += chunk.text;
			},
		})
		.on('meta[name="description"]', {
			element(el) {
				const content = el.getAttribute("content");
				if (content) result.description = content.trim() || null;
			},
		})
		.on('meta[property="og:title"]', {
			element(el) {
				const content = el.getAttribute("content");
				if (content) result.ogTitle = content.trim() || null;
			},
		})
		.on('meta[property="og:description"]', {
			element(el) {
				const content = el.getAttribute("content");
				if (content) result.ogDescription = content.trim() || null;
			},
		});

	await rewriter.transform(new Response(html)).arrayBuffer();

	const parsedTitle = titleBuffer.replace(/\s+/g, " ").trim();
	if (parsedTitle) result.title = parsedTitle;

	return result;
}

interface ParsedMarkdown {
	headings: ParsedHeading[];
	sections: ParsedSection[];
	ctas: ParsedCta[];
	plainText: string;
}

const CTA_VERB_PATTERN =
	/\b(get|start|try|buy|shop|sign\s*up|subscribe|join|book|request|download|learn|see|watch|claim|order|add|grab|unlock|discover|explore)\b/i;

function parseMarkdown(markdown: string): ParsedMarkdown {
	const lines = markdown.split(/\r?\n/);
	const headings: ParsedHeading[] = [];
	const sections: ParsedSection[] = [];
	const ctas: ParsedCta[] = [];

	let currentSection: ParsedSection = {
		heading: null,
		headingLevel: null,
		bodyText: "",
		bullets: [],
	};
	let currentSectionHeading: string | null = null;
	const bodyParagraphs: string[] = [];

	const pushSection = () => {
		const body = bodyParagraphs.join("\n\n").trim();
		currentSection.bodyText = body;
		if (currentSection.heading || body || currentSection.bullets.length > 0) {
			sections.push(currentSection);
		}
	};

	for (const rawLine of lines) {
		const line = rawLine.trimEnd();
		const headingMatch = /^(#{1,6})\s+(.+?)\s*$/.exec(line);
		if (headingMatch?.[1] && headingMatch[2]) {
			pushSection();
			const level = headingMatch[1].length;
			const text = stripInlineMarkdown(headingMatch[2]);
			headings.push({ level, text, order: headings.length });
			currentSectionHeading = text;
			currentSection = {
				heading: text,
				headingLevel: level,
				bodyText: "",
				bullets: [],
			};
			bodyParagraphs.length = 0;
			continue;
		}

		const bulletMatch = /^\s*(?:[-*+]|\d+\.)\s+(.+)$/.exec(line);
		if (bulletMatch?.[1]) {
			const bullet = stripInlineMarkdown(bulletMatch[1]);
			if (bullet) currentSection.bullets.push(bullet);
			collectCtasFromLine(line, ctas, currentSectionHeading);
			continue;
		}

		if (line.trim() === "") {
			if (bodyParagraphs.length > 0 && bodyParagraphs[bodyParagraphs.length - 1] !== "") {
				bodyParagraphs.push("");
			}
			continue;
		}

		const textLine = stripInlineMarkdown(line);
		if (textLine) {
			const last = bodyParagraphs[bodyParagraphs.length - 1];
			if (last === "" || last === undefined) {
				bodyParagraphs.push(textLine);
			} else {
				bodyParagraphs[bodyParagraphs.length - 1] = `${last} ${textLine}`;
			}
		}
		collectCtasFromLine(line, ctas, currentSectionHeading);
	}

	pushSection();

	const firstCta = ctas[0];
	if (firstCta) firstCta.isPrimary = true;

	const plainText = sections
		.map((s) => [s.heading, s.bodyText, ...s.bullets].filter(Boolean).join("\n"))
		.join("\n\n")
		.trim();

	return { headings, sections, ctas, plainText };
}

function collectCtasFromLine(line: string, ctas: ParsedCta[], sectionHeading: string | null): void {
	const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
	for (const match of line.matchAll(linkPattern)) {
		const rawText = match[1];
		const rawHref = match[2];
		if (!rawText || !rawHref) continue;
		const text = stripInlineMarkdown(rawText).trim();
		const href = rawHref.trim() || null;
		if (!text) continue;
		if (text.length > 60) continue;
		if (!CTA_VERB_PATTERN.test(text)) continue;
		ctas.push({
			text,
			href,
			kind: "link",
			isPrimary: false,
			sectionHeading,
		});
	}
}

function stripInlineMarkdown(input: string): string {
	return input
		.replace(/`([^`]+)`/g, "$1")
		.replace(/!\[[^\]]*\]\([^)]*\)/g, "")
		.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
		.replace(/(\*\*|__)(.+?)\1/g, "$2")
		.replace(/(\*|_)(.+?)\1/g, "$2")
		.replace(/~~(.+?)~~/g, "$1")
		.replace(/\s+/g, " ")
		.trim();
}

function buildHero(
	headings: readonly ParsedHeading[],
	sections: readonly ParsedSection[],
	ctas: readonly ParsedCta[],
) {
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

function computeReadability(plainText: string) {
	const words = plainText.match(/\b[\w'-]+\b/g) ?? [];
	const wordCount = words.length;
	const sentences = plainText.split(/[.!?]+\s/).filter((s) => s.trim().length > 0);
	const avgSentenceLength = sentences.length > 0 ? wordCount / sentences.length : 0;
	const lower = plainText.toLowerCase();
	const youPronounCount =
		countWord(lower, "you") + countWord(lower, "your") + countWord(lower, "yours");
	const wePronounCount =
		countWord(lower, "we") +
		countWord(lower, "our") +
		countWord(lower, "ours") +
		countWord(lower, "us");
	const iPronounCount =
		countWord(lower, "i") +
		countWord(lower, "my") +
		countWord(lower, "mine") +
		countWord(lower, "me");
	const founderPronouns = wePronounCount + iPronounCount;
	const readerCentricityRatio =
		founderPronouns === 0
			? youPronounCount > 0
				? youPronounCount
				: 0
			: youPronounCount / founderPronouns;
	return {
		wordCount,
		avgSentenceLength: Math.round(avgSentenceLength * 10) / 10,
		youPronounCount,
		wePronounCount,
		iPronounCount,
		readerCentricityRatio: Math.round(readerCentricityRatio * 100) / 100,
	};
}

function countWord(text: string, word: string): number {
	const pattern = new RegExp(`\\b${word}\\b`, "g");
	return (text.match(pattern) ?? []).length;
}

function detectSocialProof(sections: readonly ParsedSection[], plainText: string) {
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
