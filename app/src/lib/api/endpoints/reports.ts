import { apiRequest } from '$lib/api/client';
import type { CreateReportInput, ModuleRunResponse, ReportWithModulesResponse } from '$lib/types';

interface RequestContext {
	fetch?: typeof fetch;
	signal?: AbortSignal;
}

export function createReport(
	input: CreateReportInput,
	ctx: RequestContext = {}
): Promise<ReportWithModulesResponse> {
	return apiRequest<ReportWithModulesResponse>('/reports', {
		method: 'POST',
		body: input,
		...ctx
	});
}

export function getReport(
	id: string,
	ctx: RequestContext = {}
): Promise<ReportWithModulesResponse> {
	return apiRequest<ReportWithModulesResponse>(`/reports/${encodeURIComponent(id)}`, ctx);
}

export function getModuleRun(
	reportId: string,
	moduleType: string,
	ctx: RequestContext = {}
): Promise<ModuleRunResponse> {
	return apiRequest<ModuleRunResponse>(
		`/reports/${encodeURIComponent(reportId)}/modules/${encodeURIComponent(moduleType)}`,
		ctx
	);
}
