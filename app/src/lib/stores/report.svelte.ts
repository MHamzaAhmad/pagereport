import { reportsApi, ApiError } from '$lib/api';
import type { ReportWithModulesResponse, ModuleRunStatus } from '$lib/types';
import { isTerminalStatus } from '$lib/types';

const POLL_INTERVAL_MS = 2000;

function allTerminal(statuses: ModuleRunStatus[]): boolean {
	return statuses.length > 0 && statuses.every(isTerminalStatus);
}

export class ReportState {
	report = $state<ReportWithModulesResponse | null>(null);
	error = $state<string | null>(null);
	isLoading = $state<boolean>(false);

	#pollTimer: ReturnType<typeof setTimeout> | null = null;
	#abortController: AbortController | null = null;
	#currentId: string | null = null;

	get isPolling(): boolean {
		return this.#pollTimer !== null;
	}

	async load(id: string): Promise<void> {
		this.reset();
		this.#currentId = id;
		this.isLoading = true;
		try {
			await this.#fetchOnce(id);
			this.#scheduleNextPollIfNeeded();
		} finally {
			this.isLoading = false;
		}
	}

	stop(): void {
		if (this.#pollTimer !== null) {
			clearTimeout(this.#pollTimer);
			this.#pollTimer = null;
		}
		if (this.#abortController) {
			this.#abortController.abort();
			this.#abortController = null;
		}
	}

	reset(): void {
		this.stop();
		this.report = null;
		this.error = null;
		this.#currentId = null;
	}

	async #fetchOnce(id: string): Promise<void> {
		this.#abortController = new AbortController();
		try {
			const data = await reportsApi.getReport(id, { signal: this.#abortController.signal });
			this.report = data;
			this.error = null;
		} catch (err) {
			if (err instanceof DOMException && err.name === 'AbortError') return;
			this.error = err instanceof ApiError ? err.message : 'Failed to load report';
		} finally {
			this.#abortController = null;
		}
	}

	#scheduleNextPollIfNeeded(): void {
		if (!this.report || !this.#currentId) return;
		const statuses = [
			...this.report.moduleRuns.map((m) => m.status),
			...this.report.prerequisites.map((p) => p.status)
		];
		if (allTerminal(statuses)) return;

		this.#pollTimer = setTimeout(() => {
			void this.#poll();
		}, POLL_INTERVAL_MS);
	}

	async #poll(): Promise<void> {
		this.#pollTimer = null;
		if (!this.#currentId) return;
		await this.#fetchOnce(this.#currentId);
		this.#scheduleNextPollIfNeeded();
	}
}
