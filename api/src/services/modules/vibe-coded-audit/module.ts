import { CACHE_MIN_TTL_MS } from "@/domain/cache-policy";
import { registerModule } from "@/services/modules/registry";
import {
	VIBE_CODED_AUDIT_MODULE_TYPE,
	vibeCodedAuditResultSchema,
} from "@/services/modules/vibe-coded-audit/result.schema";
import { runVibeCodedAudit } from "@/services/modules/vibe-coded-audit/runner";
import { PAGE_INTELLIGENCE_PREREQ_TYPE } from "@/services/prerequisites/page-intelligence/result.schema";
import { PAGE_SCRAPE_PREREQ_TYPE } from "@/services/prerequisites/page-scrape/result.schema";

registerModule({
	type: VIBE_CODED_AUDIT_MODULE_TYPE,
	dependsOn: [PAGE_SCRAPE_PREREQ_TYPE, PAGE_INTELLIGENCE_PREREQ_TYPE],
	cacheTtlMs: CACHE_MIN_TTL_MS,
	resultSchema: vibeCodedAuditResultSchema,
	run: runVibeCodedAudit,
});
