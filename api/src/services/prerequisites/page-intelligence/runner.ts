import {
	type PageIntelligenceResult,
	pageIntelligenceResultSchema,
} from "@/services/prerequisites/page-intelligence/result.schema";
import {
	PAGE_SCRAPE_PREREQ_TYPE,
	pageScrapeResultSchema,
} from "@/services/prerequisites/page-scrape/result.schema";
import type {
	PrerequisiteRunContext,
	PrerequisiteRunInput,
} from "@/services/prerequisites/registry";

const EXTRACT_PROMPT = `You are analyzing a web page for a dropshipper's landing-page audit tool.
From the supplied page markdown, extract a compact structured profile of the page.

Return ONLY a JSON object matching this exact shape:
{
  "niche": "short phrase (2-6 words) naming the market niche this page targets",
  "summary": "1-2 sentences describing what this page is and who it's for",
  "keywords": ["3-15 short lowercase keywords or keyphrases that describe the page"],
  "products": [
    { "name": "product name", "description": "one-line description or null" }
  ]
}

- If the page sells nothing specific, return an empty products array.
- Keywords should be distinct, lowercase, no punctuation.`;

export async function runPageIntelligence(
	_input: PrerequisiteRunInput,
	{ ai, prerequisites, step }: PrerequisiteRunContext,
): Promise<PageIntelligenceResult> {
	const scrape = prerequisites.get(PAGE_SCRAPE_PREREQ_TYPE, pageScrapeResultSchema);
	const extracted = await step.do("ai-extract-intel", () =>
		ai.extractStructured(EXTRACT_PROMPT, scrape.markdown, pageIntelligenceResultSchema),
	);
	return pageIntelligenceResultSchema.parse(extracted);
}
