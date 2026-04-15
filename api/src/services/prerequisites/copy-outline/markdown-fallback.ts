import { buildCta } from "@/services/prerequisites/copy-outline/cta-heuristics";
import type {
	ParsedCta,
	ParsedOutline,
	ParsedSection,
} from "@/services/prerequisites/copy-outline/types";

export function parseMarkdownFallback(markdown: string): ParsedOutline {
	const lines = markdown.split(/\r?\n/);
	const headings: ParsedOutline["headings"] = [];
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
		const cta = buildCta({
			text: stripInlineMarkdown(rawText),
			href: rawHref,
			kind: "link",
			sectionHeading,
		});
		if (cta) ctas.push(cta);
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
