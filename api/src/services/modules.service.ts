import type { ModuleRunResponse } from "@/domain/api";
import type { ModuleRun } from "@/domain/models";
import type { ModuleRunsRepo } from "@/repos";
import { listModules } from "@/services/modules";
import type { ModuleRunWorkflowParams } from "@/services/modules/registry";

export class ModulesService {
	constructor(
		private readonly moduleRuns: ModuleRunsRepo,
		private readonly workflow: Workflow<ModuleRunWorkflowParams>,
	) {}

	async startAllForReport(reportId: string, url: string): Promise<ModuleRun[]> {
		const created: ModuleRun[] = [];
		for (const module of listModules()) {
			const id = crypto.randomUUID();
			const run = await this.moduleRuns.insert({
				id,
				reportId,
				moduleType: module.type,
				status: "pending",
			});
			const instance = await this.workflow.create({
				id,
				params: { reportId, moduleRunId: id, moduleType: module.type, url },
			});
			await this.moduleRuns.setWorkflowInstanceId(id, instance.id);
			created.push(run);
		}
		return created;
	}

	async listByReport(reportId: string): Promise<ModuleRun[]> {
		return this.moduleRuns.listByReport(reportId);
	}

	async getByReportAndType(reportId: string, moduleType: string): Promise<ModuleRun | null> {
		return this.moduleRuns.findByReportAndType(reportId, moduleType);
	}

	toResponse(run: ModuleRun): ModuleRunResponse {
		return {
			id: run.id,
			reportId: run.reportId,
			moduleType: run.moduleType,
			status: run.status,
			result: run.resultJson ? (JSON.parse(run.resultJson) as unknown) : null,
			error: run.error,
			startedAt: run.startedAt ? run.startedAt.toISOString() : null,
			completedAt: run.completedAt ? run.completedAt.toISOString() : null,
			createdAt: run.createdAt.toISOString(),
			updatedAt: run.updatedAt.toISOString(),
		};
	}
}
