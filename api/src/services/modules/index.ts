import "@/services/modules/five-sec-test/module";
import "@/services/modules/lighthouse/module";
import "@/services/modules/top-performers/module";

export type {
	AnalysisModule,
	ModuleRunContext,
	ModuleRunInput,
	ModuleRunWorkflowParams,
} from "@/services/modules/registry";
export { getModule, listModules, registerModule } from "@/services/modules/registry";
