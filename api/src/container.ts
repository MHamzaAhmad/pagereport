import { drizzle } from "drizzle-orm/d1";
import type { AIClient, BrowserClient } from "@/external";
import { CloudflareAIClient, CloudflareBrowserClient } from "@/external";
import { ModuleRunsRepo, ReportsRepo } from "@/repos";
import { ModulesService, ReportsService } from "@/services";
// Side-effect import: registers all AnalysisModule entries into the registry.
import "@/services/modules";
import type { ModuleRunWorkflowParams } from "@/services/modules/registry";

export interface Container {
	repos: {
		reports: ReportsRepo;
		moduleRuns: ModuleRunsRepo;
	};
	external: {
		browser: BrowserClient;
		ai: AIClient;
	};
	services: {
		reports: ReportsService;
		modules: ModulesService;
	};
}

export function buildContainer(env: CloudflareBindings): Container {
	const db = drizzle(env.DB);

	const repos = {
		reports: new ReportsRepo(db),
		moduleRuns: new ModuleRunsRepo(db),
	};

	const external = {
		browser: new CloudflareBrowserClient(env.BROWSER),
		ai: new CloudflareAIClient(env.AI),
	};

	const moduleRunWorkflow = env.MODULE_RUN_WF as unknown as Workflow<ModuleRunWorkflowParams>;
	const modules = new ModulesService(repos.moduleRuns, moduleRunWorkflow);
	const reports = new ReportsService(repos.reports, modules);

	return {
		repos,
		external,
		services: { reports, modules },
	};
}
