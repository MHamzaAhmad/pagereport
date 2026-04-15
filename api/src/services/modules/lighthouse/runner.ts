import type { LighthouseAuditReport, LighthouseCategory } from "@/external";
import {
	type LighthouseResult,
	lighthouseResultSchema,
} from "@/services/modules/lighthouse/result.schema";
import type { ModuleRunContext, ModuleRunInput } from "@/services/modules/registry";

const AUDIT_CATEGORIES: readonly LighthouseCategory[] = ["performance", "seo", "accessibility"];

export async function runLighthouse(
	{ url }: ModuleRunInput,
	{ lighthouse, step }: ModuleRunContext,
): Promise<LighthouseResult> {
	const [mobile, desktop] = await Promise.all([
		step.do("lighthouse-mobile", () =>
			lighthouse.runAudit({ url, formFactor: "mobile", categories: AUDIT_CATEGORIES }),
		),
		step.do("lighthouse-desktop", () =>
			lighthouse.runAudit({ url, formFactor: "desktop", categories: AUDIT_CATEGORIES }),
		),
	]);

	return lighthouseResultSchema.parse({
		mobile: toAudit(mobile),
		desktop: toAudit(desktop),
	});
}

function toAudit(report: LighthouseAuditReport) {
	return {
		scores: report.scores,
		coreWebVitals: report.coreWebVitals,
		opportunities: report.opportunities,
		finalUrl: report.finalUrl,
	};
}
