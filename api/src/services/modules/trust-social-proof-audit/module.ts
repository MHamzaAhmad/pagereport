import { CACHE_MIN_TTL_MS } from "@/domain/cache-policy";
import { registerModule } from "@/services/modules/registry";
import {
	TRUST_SOCIAL_PROOF_AUDIT_MODULE_TYPE,
	trustSocialProofAuditResultSchema,
} from "@/services/modules/trust-social-proof-audit/result.schema";
import { runTrustSocialProofAudit } from "@/services/modules/trust-social-proof-audit/runner";
import { PAGE_INTELLIGENCE_PREREQ_TYPE } from "@/services/prerequisites/page-intelligence/result.schema";
import { PAGE_SCRAPE_PREREQ_TYPE } from "@/services/prerequisites/page-scrape/result.schema";

registerModule({
	type: TRUST_SOCIAL_PROOF_AUDIT_MODULE_TYPE,
	dependsOn: [PAGE_SCRAPE_PREREQ_TYPE, PAGE_INTELLIGENCE_PREREQ_TYPE],
	cacheTtlMs: CACHE_MIN_TTL_MS,
	resultSchema: trustSocialProofAuditResultSchema,
	run: runTrustSocialProofAudit,
});
