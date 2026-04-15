import { apiRequest } from '$lib/api/client';

interface RequestContext {
	fetch?: typeof fetch;
	signal?: AbortSignal;
}

export interface CreateCheckoutResponse {
	url: string;
}

export function createCheckout(
	reportId: string,
	ctx: RequestContext = {}
): Promise<CreateCheckoutResponse> {
	return apiRequest<CreateCheckoutResponse>(`/reports/${encodeURIComponent(reportId)}/purchase`, {
		method: 'POST',
		...ctx
	});
}
