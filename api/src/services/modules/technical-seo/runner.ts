import type { ModuleRunContext, ModuleRunInput } from "@/services/modules/registry";
import { evaluateTechnicalSeo } from "@/services/modules/technical-seo/evaluator";
import { extractTechnicalSeo } from "@/services/modules/technical-seo/extractor";
import type { TechnicalSeoResult } from "@/services/modules/technical-seo/result.schema";
import {
	PAGE_SCRAPE_PREREQ_TYPE,
	pageScrapeResultSchema,
} from "@/services/prerequisites/page-scrape/result.schema";

export async function runTechnicalSeo(
	_input: ModuleRunInput,
	{ prerequisites, step }: ModuleRunContext,
): Promise<TechnicalSeoResult> {
	const scrape = prerequisites.get(PAGE_SCRAPE_PREREQ_TYPE, pageScrapeResultSchema);

	if (!scrape.rawHtml) {
		throw new Error(
			"Technical SEO module requires full-document HTML (scrape.rawHtml), but page_scrape returned none.",
		);
	}

	const html = scrape.rawHtml;
	const sourceUrl = scrape.sourceUrl;

	return await step.do("evaluate-technical-seo", async () => {
		const raw = await extractTechnicalSeo(html);
		return evaluateTechnicalSeo(raw, sourceUrl);
	});
}
