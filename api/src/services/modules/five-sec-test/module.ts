import { CACHE_MIN_TTL_MS } from "@/domain/cache-policy";
import {
	FIVE_SEC_TEST_MODULE_TYPE,
	fiveSecTestResultSchema,
} from "@/services/modules/five-sec-test/result.schema";
import { runFiveSecTest } from "@/services/modules/five-sec-test/runner";
import { registerModule } from "@/services/modules/registry";
import { PAGE_INTELLIGENCE_PREREQ_TYPE } from "@/services/prerequisites/page-intelligence/result.schema";

registerModule({
	type: FIVE_SEC_TEST_MODULE_TYPE,
	dependsOn: [PAGE_INTELLIGENCE_PREREQ_TYPE],
	cacheTtlMs: CACHE_MIN_TTL_MS,
	resultSchema: fiveSecTestResultSchema,
	run: runFiveSecTest,
});
