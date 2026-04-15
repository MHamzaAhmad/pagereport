import { CACHE_MIN_TTL_MS } from "@/domain/cache-policy";
import { registerModule } from "@/services/modules/registry";
import {
	TOP_PERFORMERS_MODULE_TYPE,
	topPerformersResultSchema,
} from "@/services/modules/top-performers/result.schema";
import { runTopPerformers } from "@/services/modules/top-performers/runner";
import { PAGE_INTELLIGENCE_PREREQ_TYPE } from "@/services/prerequisites/page-intelligence/result.schema";

registerModule({
	type: TOP_PERFORMERS_MODULE_TYPE,
	tier: "paid",
	dependsOn: [PAGE_INTELLIGENCE_PREREQ_TYPE],
	cacheTtlMs: CACHE_MIN_TTL_MS,
	resultSchema: topPerformersResultSchema,
	run: runTopPerformers,
});
