import type { ModuleRunResponse } from '$lib/types/module-run';
import type { PrerequisiteRunResponse } from '$lib/types/prerequisite-run';

export interface CreateReportInput {
	url: string;
}

export interface ReportResponse {
	id: string;
	url: string;
	createdAt: string;
}

export interface ReportWithModulesResponse extends ReportResponse {
	moduleRuns: ModuleRunResponse[];
	prerequisites: PrerequisiteRunResponse[];
}
