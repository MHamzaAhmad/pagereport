import { WorkflowEntrypoint, type WorkflowEvent, type WorkflowStep } from "cloudflare:workers";
import { buildContainer } from "@/container";
import { normalizeUrl } from "@/domain/url";
import { getModule, type ModuleRunWorkflowParams } from "@/services/modules";
import { makePrerequisiteResults } from "@/services/prerequisites";

export class ModuleRunWorkflow extends WorkflowEntrypoint<
	CloudflareBindings,
	ModuleRunWorkflowParams
> {
	override async run(
		event: WorkflowEvent<ModuleRunWorkflowParams>,
		step: WorkflowStep,
	): Promise<void> {
		const { moduleRunId, moduleType, url, prerequisiteResults } = event.payload;
		const container = buildContainer(this.env);
		const moduleRunsRepo = container.repos.moduleRuns;
		const moduleCacheRepo = container.repos.moduleCache;

		const module = getModule(moduleType);
		if (!module) {
			await step.do("mark-failed-unknown-module", () =>
				moduleRunsRepo.markFailed(moduleRunId, `Unknown module type: ${moduleType}`),
			);
			return;
		}

		await step.do("mark-running", () => moduleRunsRepo.markRunning(moduleRunId));

		try {
			const prerequisites = makePrerequisiteResults(prerequisiteResults);
			const result = await module.run(
				{ url },
				{
					browser: container.external.browser,
					ai: container.external.ai,
					lighthouse: container.external.lighthouse,
					prerequisites,
					step,
				},
			);
			const validated = module.resultSchema.parse(result);
			await step.do("kv-cache-put", () =>
				moduleCacheRepo.put(moduleType, normalizeUrl(url), validated, module.cacheTtlMs),
			);
			await step.do("mark-completed", () => moduleRunsRepo.markCompleted(moduleRunId, validated));
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			await step.do("mark-failed", () => moduleRunsRepo.markFailed(moduleRunId, message));
			throw err;
		}
	}
}
