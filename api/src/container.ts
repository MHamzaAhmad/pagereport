import { drizzle } from "drizzle-orm/d1";
import type {
	AIClient,
	BrowserClient,
	FirecrawlClient,
	LighthouseClient,
	PaymentClient,
	TrustMrrClient,
	TurnstileClient,
} from "@/external";
import {
	CloudflareAIClient,
	CloudflareBrowserClient,
	CloudflareTurnstileClient,
	FirecrawlHttpClient,
	PolarClient,
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
	ReportPurchasesRepo,
	ReportRateLimitRepo,
	ReportsRepo,
} from "@/repos";
import {
	ModulesService,
	PrerequisitesService,
	PurchasesService,
	ReportOrchestratorService,
	ReportRateLimitService,
	ReportsService,
	TurnstileService,
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
		reportPurchases: ReportPurchasesRepo;
		reportRateLimit: ReportRateLimitRepo;
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
		payment: PaymentClient;
		turnstile: TurnstileClient | null;
	};
	services: {
		reports: ReportsService;
		modules: ModulesService;
		prerequisites: PrerequisitesService;
		orchestrator: ReportOrchestratorService;
		purchases: PurchasesService;
		reportRateLimit: ReportRateLimitService;
		turnstile: TurnstileService;
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
		reportPurchases: new ReportPurchasesRepo(db),
		reportRateLimit: new ReportRateLimitRepo(db),
		cache,
		moduleCache: new ModuleCacheRepo(cache),
		prerequisiteCache: new PrerequisiteCacheRepo(cache),
	};

	const polarServer: "production" | "sandbox" =
		(env.POLAR_SERVER as string) === "production" ? "production" : "sandbox";
	const turnstileSecret = env.TURNSTILE_SECRET_KEY ?? "";
	const turnstileClient: TurnstileClient | null =
		turnstileSecret.length > 0
			? new CloudflareTurnstileClient({ secretKey: turnstileSecret })
			: null;
	const external = {
		browser: new CloudflareBrowserClient(env.BROWSER),
		ai: new CloudflareAIClient(env.AI),
		lighthouse: new PsiLighthouseClient(
			env.PAGESPEED_API_KEY ? { apiKey: env.PAGESPEED_API_KEY } : {},
		),
		firecrawl: new FirecrawlHttpClient({ apiKey: env.FIRECRAWL_API_KEY }),
		trustMrr: new TrustMrrHttpClient({ apiKey: env.TRUSTMRR_API_KEY }),
		payment: new PolarClient({
			accessToken: env.POLAR_ACCESS_TOKEN,
			webhookSecret: env.POLAR_WEBHOOK_SECRET,
			productId: env.POLAR_PRODUCT_ID,
			server: polarServer,
		}),
		turnstile: turnstileClient,
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
	const purchases = new PurchasesService(
		repos.reports,
		repos.moduleRuns,
		repos.moduleCache,
		repos.reportPurchases,
		orchestrator,
		external.payment,
		{
			provider: "polar",
			checkoutSuccessUrl: env.CHECKOUT_SUCCESS_URL,
		},
	);

	const reportRateLimit = new ReportRateLimitService(repos.reportRateLimit);
	const turnstile = new TurnstileService(turnstileClient, turnstileClient !== null);

	return {
		repos,
		external,
		services: {
			reports,
			modules,
			prerequisites,
			orchestrator,
			purchases,
			reportRateLimit,
			turnstile,
		},
	};
}
