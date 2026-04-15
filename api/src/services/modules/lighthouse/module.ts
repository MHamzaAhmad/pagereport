import { CACHE_MIN_TTL_MS } from "@/domain/cache-policy";
import {
	LIGHTHOUSE_MODULE_TYPE,
	lighthouseResultSchema,
} from "@/services/modules/lighthouse/result.schema";
import { runLighthouse } from "@/services/modules/lighthouse/runner";
import { registerModule } from "@/services/modules/registry";

registerModule({
	type: LIGHTHOUSE_MODULE_TYPE,
	cacheTtlMs: CACHE_MIN_TTL_MS,
	resultSchema: lighthouseResultSchema,
	run: runLighthouse,
});
