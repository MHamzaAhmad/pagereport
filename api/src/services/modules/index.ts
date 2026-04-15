import "@/services/modules/copy-analysis/module";
import "@/services/modules/cta-audit/module";
import "@/services/modules/five-sec-test/module";
import "@/services/modules/lighthouse/module";
import "@/services/modules/technical-seo/module";
import "@/services/modules/top-performers/module";
import "@/services/modules/trust-social-proof-audit/module";
import "@/services/modules/vibe-coded-audit/module";

export type {
	AnalysisModule,
	ModuleRunContext,
	ModuleRunInput,
	ModuleRunWorkflowParams,
	ModuleTier,
} from "@/services/modules/registry";
export {
	getModule,
	listFreeModules,
	listModules,
	listPaidModules,
	registerModule,
} from "@/services/modules/registry";
