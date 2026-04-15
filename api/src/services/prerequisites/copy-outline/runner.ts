import { buildHero } from "@/services/prerequisites/copy-outline/hero";
import { parseRawHtml } from "@/services/prerequisites/copy-outline/html-parser";
import { parseMarkdownFallback } from "@/services/prerequisites/copy-outline/markdown-fallback";
import { computeReadability } from "@/services/prerequisites/copy-outline/readability";
import {
	type CopyOutlineResult,
	copyOutlineResultSchema,
} from "@/services/prerequisites/copy-outline/result.schema";
import { detectSocialProof } from "@/services/prerequisites/copy-outline/social-proof";
import type { MetaTags } from "@/services/prerequisites/copy-outline/types";
import {
	PAGE_SCRAPE_PREREQ_TYPE,
	pageScrapeResultSchema,
} from "@/services/prerequisites/page-scrape/result.schema";
import type {
	PrerequisiteRunContext,
	PrerequisiteRunInput,
} from "@/services/prerequisites/registry";

export async function runCopyOutline(
	_input: PrerequisiteRunInput,
	{ prerequisites, step }: PrerequisiteRunContext,
): Promise<CopyOutlineResult> {
	const scrape = prerequisites.get(PAGE_SCRAPE_PREREQ_TYPE, pageScrapeResultSchema);

	const { outline, meta } = await step.do("parse-outline", async () => {
		if (scrape.rawHtml) {
			return parseRawHtml(scrape.rawHtml, scrape.title);
		}
		return {
			outline: parseMarkdownFallback(scrape.markdown),
			meta: fallbackMeta(scrape.title),
		};
	});

	const hero = buildHero(outline.headings, outline.sections, outline.ctas);
	const readability = computeReadability(outline.plainText);
	const socialProof = detectSocialProof(outline.sections, outline.plainText);

	return copyOutlineResultSchema.parse({
		sourceUrl: scrape.sourceUrl,
		meta,
		hero,
		headings: outline.headings,
		ctas: outline.ctas,
		sections: outline.sections,
		socialProof,
		readability,
	});
}

function fallbackMeta(title: string | null): MetaTags {
	return {
		title: title?.trim() || null,
		description: null,
		ogTitle: null,
		ogDescription: null,
	};
}
