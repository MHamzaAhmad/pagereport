import { drizzle } from "drizzle-orm/d1";
import type {
	AIClient,
	BrowserClient,
	FirecrawlClient,
	LighthouseClient,
	TrustMrrClient,
} from "@/external";
import {
	CloudflareAIClient,
	CloudflareBrowserClient,
	FirecrawlHttpClient,
	PsiLighthouseClient,
	TrustMrrHttpClient,
} from "@/external";
import {
	CacheRepo,
	ModuleCacheRepo,
	ModuleRunsRepo,
	PrerequisiteCacheRepo,
	PrerequisiteResultsRepo,
	PrerequisiteRunsRepo,
	ReportsRepo,
} from "@/repos";
import {
	ModulesService,
	PrerequisitesService,
	ReportOrchestratorService,
	ReportsService,
} from "@/services";
// Side-effect imports: registers all AnalysisModule / Prerequisite entries.
import "@/services/modules";
import "@/services/prerequisites";
import type { ModuleRunWorkflowParams } from "@/services/modules/registry";
import type { PrerequisiteRunWorkflowParams } from "@/services/prerequisites/registry";

export interface Container {
	repos: {
		reports: ReportsRepo;
		moduleRuns: ModuleRunsRepo;
		prerequisiteRuns: PrerequisiteRunsRepo;
		prerequisiteResults: PrerequisiteResultsRepo;
		cache: CacheRepo;
		moduleCache: ModuleCacheRepo;
		prerequisiteCache: PrerequisiteCacheRepo;
	};
	external: {
		browser: BrowserClient;
		ai: AIClient;
		lighthouse: LighthouseClient;
		firecrawl: FirecrawlClient;
		trustMrr: TrustMrrClient;
	};
	services: {
		reports: ReportsService;
		modules: ModulesService;
		prerequisites: PrerequisitesService;
		orchestrator: ReportOrchestratorService;
	};
}

export function buildContainer(env: CloudflareBindings): Container {
	const db = drizzle(env.DB);

	const cache = new CacheRepo(env.CACHE);
	const repos = {
		reports: new ReportsRepo(db),
		moduleRuns: new ModuleRunsRepo(db),
		prerequisiteRuns: new PrerequisiteRunsRepo(db),
		prerequisiteResults: new PrerequisiteResultsRepo(db),
		cache,
		moduleCache: new ModuleCacheRepo(cache),
		prerequisiteCache: new PrerequisiteCacheRepo(cache),
	};

	const external = {
		browser: new CloudflareBrowserClient(env.BROWSER),
		ai: new CloudflareAIClient(env.AI),
		lighthouse: new PsiLighthouseClient(
			env.PAGESPEED_API_KEY ? { apiKey: env.PAGESPEED_API_KEY } : {},
		),
		firecrawl: new FirecrawlHttpClient({ apiKey: env.FIRECRAWL_API_KEY }),
		trustMrr: new TrustMrrHttpClient({ apiKey: env.TRUSTMRR_API_KEY }),
	};

	const moduleRunWorkflow = env.MODULE_RUN_WF as unknown as Workflow<ModuleRunWorkflowParams>;
	const prerequisiteRunWorkflow =
		env.PREREQUISITE_RUN_WF as unknown as Workflow<PrerequisiteRunWorkflowParams>;

	const modules = new ModulesService(repos.moduleRuns);
	const prerequisites = new PrerequisitesService(repos.prerequisiteRuns);
	const orchestrator = new ReportOrchestratorService(
		repos.reports,
		repos.prerequisiteResults,
		repos.prerequisiteRuns,
		repos.moduleRuns,
		repos.prerequisiteCache,
		repos.moduleCache,
		prerequisiteRunWorkflow,
		moduleRunWorkflow,
	);
	const reports = new ReportsService(repos.reports, modules, prerequisites, orchestrator);

	return {
		repos,
		external,
		services: { reports, modules, prerequisites, orchestrator },
	};
}
