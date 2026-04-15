import { CACHE_MIN_TTL_MS } from "@/domain/cache-policy";
import {
	CTA_AUDIT_MODULE_TYPE,
	ctaAuditResultSchema,
} from "@/services/modules/cta-audit/result.schema";
import { runCtaAudit } from "@/services/modules/cta-audit/runner";
import { registerModule } from "@/services/modules/registry";
import { COPY_OUTLINE_PREREQ_TYPE } from "@/services/prerequisites/copy-outline/result.schema";
import { PAGE_SCRAPE_PREREQ_TYPE } from "@/services/prerequisites/page-scrape/result.schema";

registerModule({
	type: CTA_AUDIT_MODULE_TYPE,
	tier: "paid",
	dependsOn: [COPY_OUTLINE_PREREQ_TYPE, PAGE_SCRAPE_PREREQ_TYPE],
	cacheTtlMs: CACHE_MIN_TTL_MS,
	resultSchema: ctaAuditResultSchema,
	run: runCtaAudit,
});
