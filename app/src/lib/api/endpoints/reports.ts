import { apiRequest } from '$lib/api/client';
import type { CreateReportInput, ModuleRunResponse, ReportWithModulesResponse } from '$lib/types';

interface RequestContext {
	fetch?: typeof fetch;
	signal?: AbortSignal;
}

interface CreateReportContext extends RequestContext {
	turnstileToken?: string;
}

export function createReport(
	input: CreateReportInput,
	ctx: CreateReportContext = {}
): Promise<ReportWithModulesResponse> {
	const { turnstileToken, ...rest } = ctx;
	const headers: Record<string, string> = {};
	if (turnstileToken) headers['cf-turnstile-token'] = turnstileToken;
	return apiRequest<ReportWithModulesResponse>('/reports', {
		method: 'POST',
		body: input,
		headers,
		...rest
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
