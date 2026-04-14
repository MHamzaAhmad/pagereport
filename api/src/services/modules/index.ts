import "@/services/modules/five-sec-test/module";

export type {
	AnalysisModule,
	ModuleRunContext,
	ModuleRunInput,
	ModuleRunWorkflowParams,
} from "@/services/modules/registry";
export { getModule, listModules, registerModule } from "@/services/modules/registry";
