import { normalizeUrl } from "@/domain/url";
import type {
	ModuleCacheRepo,
	ModuleRunsRepo,
	PrerequisiteCacheRepo,
	PrerequisiteResultsRepo,
	PrerequisiteRunsRepo,
	ReportsRepo,
} from "@/repos";
import { getModule, listModules } from "@/services/modules";
import type { ModuleRunWorkflowParams } from "@/services/modules/registry";
import { getPrerequisite, listPrerequisites } from "@/services/prerequisites";
import type { PrerequisiteRunWorkflowParams } from "@/services/prerequisites/registry";

const READY_STATUSES = new Set<string>(["pending", "awaiting_prerequisites"]);

export class ReportOrchestratorService {
	constructor(
		private readonly reports: ReportsRepo,
		private readonly prerequisiteResults: PrerequisiteResultsRepo,
		private readonly prerequisiteRuns: PrerequisiteRunsRepo,
		private readonly moduleRuns: ModuleRunsRepo,
		private readonly prerequisiteCache: PrerequisiteCacheRepo,
		private readonly moduleCache: ModuleCacheRepo,
		private readonly prerequisiteRunWorkflow: Workflow<PrerequisiteRunWorkflowParams>,
		private readonly moduleRunWorkflow: Workflow<ModuleRunWorkflowParams>,
	) {}

	async kickoffReport(reportId: string, url: string): Promise<void> {
		const normalizedUrl = normalizeUrl(url);

		for (const prereq of listPrerequisites()) {
			const kvHit =
				prereq.cacheTtlMs > 0
					? await this.prerequisiteCache.findFresh(prereq.type, normalizedUrl)
					: null;
			if (kvHit !== null) {
				console.log(`[orchestrator] prereq ${prereq.type}: kv cache hit`);
				const row = await this.prerequisiteResults.upsert(prereq.type, normalizedUrl, kvHit);
				const now = new Date();
				await this.prerequisiteRuns.insert({
					id: crypto.randomUUID(),
					reportId,
					prerequisiteType: prereq.type,
					status: "completed",
					prerequisiteResultId: row.id,
					startedAt: now,
					completedAt: now,
				});
				continue;
			}

			const dbHit = await this.prerequisiteResults.findFresh(
				prereq.type,
				normalizedUrl,
				prereq.cacheTtlMs,
			);
			if (dbHit) {
				console.log(`[orchestrator] prereq ${prereq.type}: d1 cache hit`);
				const now = new Date();
				await this.prerequisiteRuns.insert({
					id: crypto.randomUUID(),
					reportId,
					prerequisiteType: prereq.type,
					status: "completed",
					prerequisiteResultId: dbHit.id,
					startedAt: now,
					completedAt: now,
				});
				if (prereq.cacheTtlMs > 0) {
					await this.prerequisiteCache.put(
						prereq.type,
						normalizedUrl,
						JSON.parse(dbHit.resultJson) as unknown,
						prereq.cacheTtlMs,
					);
				}
				continue;
			}

			console.log(`[orchestrator] prereq ${prereq.type}: cache miss, queued`);
			const hasDeps = (prereq.dependsOn?.length ?? 0) > 0;
			await this.prerequisiteRuns.insert({
				id: crypto.randomUUID(),
				reportId,
				prerequisiteType: prereq.type,
				status: hasDeps ? "awaiting_prerequisites" : "pending",
			});
		}

		for (const module of listModules()) {
			const cachedResult =
				module.cacheTtlMs > 0 ? await this.moduleCache.findFresh(module.type, normalizedUrl) : null;
			if (cachedResult !== null) {
				console.log(`[orchestrator] module ${module.type}: kv cache hit`);
				const now = new Date();
				await this.moduleRuns.insert({
					id: crypto.randomUUID(),
					reportId,
					moduleType: module.type,
					status: "completed",
					resultJson: JSON.stringify(cachedResult),
					startedAt: now,
					completedAt: now,
				});
				continue;
			}

			console.log(`[orchestrator] module ${module.type}: cache miss, queued`);
			const hasDeps = (module.dependsOn?.length ?? 0) > 0;
			await this.moduleRuns.insert({
				id: crypto.randomUUID(),
				reportId,
				moduleType: module.type,
				status: hasDeps ? "awaiting_prerequisites" : "pending",
			});
		}

		await this.dispatchReady(reportId, url);
	}

	async onPrerequisiteCompleted(reportId: string, _prerequisiteType: string): Promise<void> {
		const report = await this.reports.findById(reportId);
		if (!report) {
			throw new Error(`Report not found: ${reportId}`);
		}
		await this.dispatchReady(reportId, report.url);
	}

	async onPrerequisiteFailed(reportId: string, failedType: string, error: string): Promise<void> {
		const failedSet = new Set<string>([failedType]);
		let changed = true;
		while (changed) {
			changed = false;
			for (const prereq of listPrerequisites()) {
				if (failedSet.has(prereq.type)) continue;
				const deps = prereq.dependsOn ?? [];
				if (deps.some((d) => failedSet.has(d))) {
					failedSet.add(prereq.type);
					changed = true;
				}
			}
		}

		const reason = `prerequisite ${failedType} failed: ${error}`;
		const [prereqRuns, moduleRuns] = await Promise.all([
			this.prerequisiteRuns.listByReport(reportId),
			this.moduleRuns.listByReport(reportId),
		]);

		for (const run of prereqRuns) {
			if (run.prerequisiteType === failedType) continue;
			if (!failedSet.has(run.prerequisiteType)) continue;
			if (!READY_STATUSES.has(run.status)) continue;
			await this.prerequisiteRuns.markFailed(run.id, reason);
		}

		for (const run of moduleRuns) {
			const module = getModule(run.moduleType);
			if (!module) continue;
			const deps = module.dependsOn ?? [];
			if (!deps.some((d) => failedSet.has(d))) continue;
			if (!READY_STATUSES.has(run.status)) continue;
			await this.moduleRuns.markFailed(run.id, reason);
		}
	}

	private async dispatchReady(reportId: string, url: string): Promise<void> {
		const [prereqRuns, moduleRuns] = await Promise.all([
			this.prerequisiteRuns.listByReportWithResults(reportId),
			this.moduleRuns.listByReport(reportId),
		]);

		const completed = new Map<string, unknown>();
		for (const run of prereqRuns) {
			if (run.status === "completed" && run.result !== null) {
				completed.set(run.prerequisiteType, run.result);
			}
		}

		for (const run of prereqRuns) {
			if (!READY_STATUSES.has(run.status)) continue;
			if (run.workflowInstanceId) continue;
			const prereq = getPrerequisite(run.prerequisiteType);
			if (!prereq) continue;
			const deps = prereq.dependsOn ?? [];
			if (!deps.every((d) => completed.has(d))) continue;
			const payload = buildPrereqResultsPayload(deps, completed);
			console.log(`[orchestrator] prereq ${run.prerequisiteType}: workflow dispatched`);
			const instance = await this.prerequisiteRunWorkflow.create({
				id: run.id,
				params: {
					reportId,
					prerequisiteRunId: run.id,
					prerequisiteType: run.prerequisiteType,
					url,
					prerequisiteResults: payload,
				},
			});
			await this.prerequisiteRuns.setWorkflowInstanceId(run.id, instance.id);
		}

		for (const run of moduleRuns) {
			if (!READY_STATUSES.has(run.status)) continue;
			if (run.workflowInstanceId) continue;
			const module = getModule(run.moduleType);
			if (!module) continue;
			const deps = module.dependsOn ?? [];
			if (!deps.every((d) => completed.has(d))) continue;
			const payload = buildPrereqResultsPayload(deps, completed);
			console.log(`[orchestrator] module ${run.moduleType}: workflow dispatched`);
			const instance = await this.moduleRunWorkflow.create({
				id: run.id,
				params: {
					reportId,
					moduleRunId: run.id,
					moduleType: run.moduleType,
					url,
					prerequisiteResults: payload,
				},
			});
			await this.moduleRuns.setWorkflowInstanceId(run.id, instance.id);
		}
	}
}

function buildPrereqResultsPayload(
	deps: readonly string[],
	completed: Map<string, unknown>,
): Record<string, unknown> {
	const payload: Record<string, unknown> = {};
	for (const dep of deps) {
		const value = completed.get(dep);
		if (value !== undefined) payload[dep] = value;
	}
	return payload;
}
