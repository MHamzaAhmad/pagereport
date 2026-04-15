import { CACHE_MIN_TTL_MS } from "@/domain/cache-policy";
import { registerModule } from "@/services/modules/registry";
import {
	TECHNICAL_SEO_MODULE_TYPE,
	technicalSeoResultSchema,
} from "@/services/modules/technical-seo/result.schema";
import { runTechnicalSeo } from "@/services/modules/technical-seo/runner";
import { PAGE_SCRAPE_PREREQ_TYPE } from "@/services/prerequisites/page-scrape/result.schema";

registerModule({
	type: TECHNICAL_SEO_MODULE_TYPE,
	dependsOn: [PAGE_SCRAPE_PREREQ_TYPE],
	cacheTtlMs: CACHE_MIN_TTL_MS,
	resultSchema: technicalSeoResultSchema,
	run: runTechnicalSeo,
});
