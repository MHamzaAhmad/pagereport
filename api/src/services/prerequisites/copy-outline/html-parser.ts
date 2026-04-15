import { buildCta } from "@/services/prerequisites/copy-outline/cta-heuristics";
import type {
	MetaTags,
	ParsedCta,
	ParsedHeading,
	ParsedOutline,
	ParsedSection,
} from "@/services/prerequisites/copy-outline/types";

interface HeadingFrame {
	kind: "heading";
	level: number;
	buffer: string;
}

interface ListItemFrame {
	kind: "li";
	buffer: string;
}

interface AnchorFrame {
	kind: "anchor";
	href: string | null;
	tag: "a" | "button";
	sectionHeading: string | null;
	buffer: string;
}

type Frame = HeadingFrame | ListItemFrame | AnchorFrame;

interface ParserState {
	mutedDepth: number;
	frames: Frame[];
	currentSection: ParsedSection;
	sections: ParsedSection[];
	headings: ParsedHeading[];
	ctas: ParsedCta[];
	plainText: string;
	bodyBuffer: string;
	meta: MetaTags;
	titleBuffer: string;
}

export interface ParseRawHtmlResult {
	outline: ParsedOutline;
	meta: MetaTags;
}

export async function parseRawHtml(
	rawHtml: string,
	fallbackTitle: string | null,
): Promise<ParseRawHtmlResult> {
	const state = createState(fallbackTitle);

	const rewriter = new HTMLRewriter()
		.on("script,style,noscript,svg,template,iframe,select,textarea", {
			element(el) {
				state.mutedDepth += 1;
				el.onEndTag(() => {
					state.mutedDepth = Math.max(0, state.mutedDepth - 1);
				});
			},
		})
		.on("h1,h2,h3,h4,h5,h6", {
			element(el) {
				const level = Number(el.tagName.charAt(1));
				if (!Number.isFinite(level) || level < 1 || level > 6) return;
				flushSection(state);
				state.currentSection = emptySection(null, level);
				const frame: HeadingFrame = { kind: "heading", level, buffer: "" };
				state.frames.push(frame);
				el.onEndTag(() => {
					popFrame(state, frame);
					const headingText = collapseWhitespace(frame.buffer).trim();
					if (!headingText) return;
					state.currentSection.heading = headingText;
					state.headings.push({
						level,
						text: headingText,
						order: state.headings.length,
					});
				});
			},
		})
		.on("li", {
			element(el) {
				const frame: ListItemFrame = { kind: "li", buffer: "" };
				state.frames.push(frame);
				el.onEndTag(() => {
					popFrame(state, frame);
					const bullet = collapseWhitespace(frame.buffer).trim();
					if (bullet) state.currentSection.bullets.push(bullet);
				});
			},
		})
		.on("p", {
			element(el) {
				el.onEndTag(() => {
					state.bodyBuffer += "\n\n";
				});
			},
		})
		.on("a[href]", {
			element(el) {
				const href = el.getAttribute("href");
				const frame: AnchorFrame = {
					kind: "anchor",
					href,
					tag: "a",
					sectionHeading: state.currentSection.heading,
					buffer: "",
				};
				state.frames.push(frame);
				el.onEndTag(() => {
					popFrame(state, frame);
					const cta = buildCta({
						text: frame.buffer,
						href: frame.href,
						kind: "link",
						sectionHeading: frame.sectionHeading,
					});
					if (cta) state.ctas.push(cta);
				});
			},
		})
		.on("button", {
			element(el) {
				const frame: AnchorFrame = {
					kind: "anchor",
					href: null,
					tag: "button",
					sectionHeading: state.currentSection.heading,
					buffer: "",
				};
				state.frames.push(frame);
				el.onEndTag(() => {
					popFrame(state, frame);
					const cta = buildCta({
						text: frame.buffer,
						href: null,
						kind: "button",
						sectionHeading: frame.sectionHeading,
					});
					if (cta) state.ctas.push(cta);
				});
			},
		})
		.on("title", {
			text(chunk) {
				state.titleBuffer += chunk.text;
			},
		})
		.on('meta[name="description"]', {
			element(el) {
				const content = el.getAttribute("content");
				if (content) state.meta.description = content.trim() || null;
			},
		})
		.on('meta[property="og:title"]', {
			element(el) {
				const content = el.getAttribute("content");
				if (content) state.meta.ogTitle = content.trim() || null;
			},
		})
		.on('meta[property="og:description"]', {
			element(el) {
				const content = el.getAttribute("content");
				if (content) state.meta.ogDescription = content.trim() || null;
			},
		})
		.on("body", {
			text(chunk) {
				if (state.mutedDepth > 0) return;
				appendText(state, chunk.text);
			},
		});

	await rewriter.transform(new Response(rawHtml)).arrayBuffer();

	flushSection(state);
	finaliseTitle(state);
	const firstCta = state.ctas[0];
	if (firstCta) firstCta.isPrimary = true;

	return {
		outline: {
			headings: state.headings,
			sections: state.sections,
			ctas: state.ctas,
			plainText: collapseWhitespace(state.plainText).trim(),
		},
		meta: state.meta,
	};
}

function createState(fallbackTitle: string | null): ParserState {
	return {
		mutedDepth: 0,
		frames: [],
		currentSection: emptySection(null, null),
		sections: [],
		headings: [],
		ctas: [],
		plainText: "",
		bodyBuffer: "",
		meta: {
			title: fallbackTitle?.trim() || null,
			description: null,
			ogTitle: null,
			ogDescription: null,
		},
		titleBuffer: "",
	};
}

function emptySection(heading: string | null, level: number | null): ParsedSection {
	return { heading, headingLevel: level, bodyText: "", bullets: [] };
}

function flushSection(state: ParserState): void {
	const bodyText = collapseBodyText(state.bodyBuffer);
	state.currentSection.bodyText = bodyText;
	if (state.currentSection.heading || bodyText || state.currentSection.bullets.length > 0) {
		state.sections.push(state.currentSection);
	}
	state.bodyBuffer = "";
}

function collapseBodyText(raw: string): string {
	return raw
		.split(/\n{2,}/)
		.map((paragraph) => collapseWhitespace(paragraph).trim())
		.filter((paragraph) => paragraph.length > 0)
		.join("\n\n");
}

function collapseWhitespace(input: string): string {
	return input.replace(/\s+/g, " ");
}

function appendText(state: ParserState, text: string): void {
	if (!text) return;
	state.plainText += text;
	for (let i = state.frames.length - 1; i >= 0; i -= 1) {
		const frame = state.frames[i];
		if (!frame) continue;
		frame.buffer += text;
		if (frame.kind === "anchor") {
			state.bodyBuffer += text;
		}
		return;
	}
	state.bodyBuffer += text;
}

function popFrame(state: ParserState, expected: Frame): void {
	const top = state.frames[state.frames.length - 1];
	if (top === expected) {
		state.frames.pop();
		return;
	}
	const index = state.frames.lastIndexOf(expected);
	if (index >= 0) state.frames.splice(index, 1);
}

function finaliseTitle(state: ParserState): void {
	const parsed = state.titleBuffer.replace(/\s+/g, " ").trim();
	if (parsed) state.meta.title = parsed;
}
