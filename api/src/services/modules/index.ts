import "@/services/modules/copy-analysis/module";
import "@/services/modules/cta-audit/module";
import "@/services/modules/five-sec-test/module";
import "@/services/modules/lighthouse/module";
import "@/services/modules/top-performers/module";
import "@/services/modules/trust-social-proof-audit/module";

export type {
	AnalysisModule,
	ModuleRunContext,
	ModuleRunInput,
	ModuleRunWorkflowParams,
} from "@/services/modules/registry";
export { getModule, listModules, registerModule } from "@/services/modules/registry";
