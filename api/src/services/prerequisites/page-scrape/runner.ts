import {
	type PageScrapeResult,
	pageScrapeResultSchema,
} from "@/services/prerequisites/page-scrape/result.schema";
import type {
	PrerequisiteRunContext,
	PrerequisiteRunInput,
} from "@/services/prerequisites/registry";

export async function runPageScrape(
	{ url }: PrerequisiteRunInput,
	{ firecrawl, step }: PrerequisiteRunContext,
): Promise<PageScrapeResult> {
	const scraped = await step.do("firecrawl-scrape", () => firecrawl.scrape(url));
	return pageScrapeResultSchema.parse({
		markdown: scraped.markdown,
		title: scraped.title,
		html: scraped.html,
		rawHtml: scraped.rawHtml,
		sourceUrl: scraped.sourceUrl,
	});
}
