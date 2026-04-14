import type { ModuleRunResponse } from '$lib/types/module-run';

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
}
