import { WorkflowEntrypoint, type WorkflowEvent, type WorkflowStep } from "cloudflare:workers";
import { buildContainer } from "@/container";
import { normalizeUrl } from "@/domain/url";
import { getPrerequisite, makePrerequisiteResults } from "@/services/prerequisites";
import type { PrerequisiteRunWorkflowParams } from "@/services/prerequisites/registry";

export class PrerequisiteRunWorkflow extends WorkflowEntrypoint<
	CloudflareBindings,
	PrerequisiteRunWorkflowParams
> {
	override async run(
		event: WorkflowEvent<PrerequisiteRunWorkflowParams>,
		step: WorkflowStep,
	): Promise<void> {
		const { reportId, prerequisiteRunId, prerequisiteType, url, prerequisiteResults } =
			event.payload;
		const container = buildContainer(this.env);
		const runsRepo = container.repos.prerequisiteRuns;
		const resultsRepo = container.repos.prerequisiteResults;
		const cacheRepo = container.repos.prerequisiteCache;
		const orchestrator = container.services.orchestrator;

		const prerequisite = getPrerequisite(prerequisiteType);
		if (!prerequisite) {
			const message = `Unknown prerequisite type: ${prerequisiteType}`;
			await step.do("mark-failed-unknown-prereq", () =>
				runsRepo.markFailed(prerequisiteRunId, message),
			);
			await step.do("notify-orchestrator-unknown-prereq", () =>
				orchestrator.onPrerequisiteFailed(reportId, prerequisiteType, message),
			);
			return;
		}

		await step.do("mark-running", () => runsRepo.markRunning(prerequisiteRunId));

		try {
			const prerequisites = makePrerequisiteResults(prerequisiteResults);
			const result = await prerequisite.run(
				{ url },
				{
					firecrawl: container.external.firecrawl,
					ai: container.external.ai,
					prerequisites,
					step,
				},
			);
			const validated = prerequisite.resultSchema.parse(result);
			const normalized = normalizeUrl(url);
			const cached = await step.do("cache-upsert", () =>
				resultsRepo.upsert(prerequisiteType, normalized, validated),
			);
			await step.do("kv-cache-put", () =>
				cacheRepo.put(prerequisiteType, normalized, validated, prerequisite.cacheTtlMs),
			);
			await step.do("mark-completed", () =>
				runsRepo.markCompletedWithResultId(prerequisiteRunId, cached.id),
			);
			await step.do("notify-orchestrator", () =>
				orchestrator.onPrerequisiteCompleted(reportId, prerequisiteType),
			);
		} catch (err) {
			const message = err instanceof Error ? err.message : String(err);
			await step.do("mark-failed", () => runsRepo.markFailed(prerequisiteRunId, message));
			await step.do("notify-orchestrator-failed", () =>
				orchestrator.onPrerequisiteFailed(reportId, prerequisiteType, message),
			);
			throw err;
		}
	}
}
