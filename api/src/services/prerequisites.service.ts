import type { PrerequisiteRunResponse } from "@/domain/api";
import type { NewPrerequisiteRun, PrerequisiteRun } from "@/domain/models";
import type { PrerequisiteRunsRepo, PrerequisiteRunWithResult } from "@/repos";

export class PrerequisitesService {
	constructor(private readonly prerequisiteRuns: PrerequisiteRunsRepo) {}

	async createRun(input: NewPrerequisiteRun): Promise<PrerequisiteRun> {
		return this.prerequisiteRuns.insert(input);
	}

	async listByReport(reportId: string): Promise<PrerequisiteRunWithResult[]> {
		return this.prerequisiteRuns.listByReportWithResults(reportId);
	}

	async getByReportAndType(
		reportId: string,
		prerequisiteType: string,
	): Promise<PrerequisiteRun | null> {
		return this.prerequisiteRuns.findByReportAndType(reportId, prerequisiteType);
	}

	toResponse(run: PrerequisiteRunWithResult): PrerequisiteRunResponse {
		return {
			id: run.id,
			reportId: run.reportId,
			prerequisiteType: run.prerequisiteType,
			status: run.status,
			result: run.result,
			error: run.error,
			startedAt: run.startedAt ? run.startedAt.toISOString() : null,
			completedAt: run.completedAt ? run.completedAt.toISOString() : null,
			createdAt: run.createdAt.toISOString(),
			updatedAt: run.updatedAt.toISOString(),
		};
	}
}
