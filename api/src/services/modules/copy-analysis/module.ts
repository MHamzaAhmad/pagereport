import { CACHE_MIN_TTL_MS } from "@/domain/cache-policy";
import {
	COPY_ANALYSIS_MODULE_TYPE,
	copyAnalysisResultSchema,
} from "@/services/modules/copy-analysis/result.schema";
import { runCopyAnalysis } from "@/services/modules/copy-analysis/runner";
import { registerModule } from "@/services/modules/registry";
import { COPY_OUTLINE_PREREQ_TYPE } from "@/services/prerequisites/copy-outline/result.schema";
import { PAGE_SCRAPE_PREREQ_TYPE } from "@/services/prerequisites/page-scrape/result.schema";

registerModule({
	type: COPY_ANALYSIS_MODULE_TYPE,
	tier: "paid",
	dependsOn: [COPY_OUTLINE_PREREQ_TYPE, PAGE_SCRAPE_PREREQ_TYPE],
	cacheTtlMs: CACHE_MIN_TTL_MS,
	resultSchema: copyAnalysisResultSchema,
	run: runCopyAnalysis,
});
