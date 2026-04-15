import type { ModuleRunResponse } from "@/domain/api";
import type { ModuleRun, NewModuleRun } from "@/domain/models";
import type { ModuleRunsRepo } from "@/repos";

export class ModulesService {
	constructor(private readonly moduleRuns: ModuleRunsRepo) {}

	async createRun(input: NewModuleRun): Promise<ModuleRun> {
		return this.moduleRuns.insert(input);
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
