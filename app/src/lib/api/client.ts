import { API_BASE_URL } from '$lib/api/config';
import { ApiError } from '$lib/api/errors';

type FetchLike = typeof fetch;

interface RequestOptions {
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
	body?: unknown;
	signal?: AbortSignal;
	fetch?: FetchLike;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
	const { method = 'GET', body, signal, fetch: fetchImpl = fetch } = options;
	const url = `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

	const response = await fetchImpl(url, {
		method,
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json'
		},
		body: body === undefined ? undefined : JSON.stringify(body),
		signal
	});

	const text = await response.text();
	const parsed: unknown = text.length > 0 ? JSON.parse(text) : null;

	if (!response.ok) {
		const message = extractErrorMessage(parsed) ?? `Request failed with status ${response.status}`;
		throw new ApiError(response.status, message, parsed);
	}

	return parsed as T;
}

function extractErrorMessage(body: unknown): string | null {
	if (body && typeof body === 'object' && 'error' in body) {
		const err = (body as { error: unknown }).error;
		if (typeof err === 'string') return err;
	}
	return null;
}
