export const moduleRunStatusValues = [
	'pending',
	'awaiting_prerequisites',
	'running',
	'completed',
	'failed'
] as const;
export type ModuleRunStatus = (typeof moduleRunStatusValues)[number];

export interface ModuleRunResponse {
	id: string;
	reportId: string;
	moduleType: string;
	status: ModuleRunStatus;
	result: unknown;
	error: string | null;
	startedAt: string | null;
	completedAt: string | null;
	createdAt: string;
	updatedAt: string;
}

export function isTerminalStatus(status: ModuleRunStatus): boolean {
	return status === 'completed' || status === 'failed';
}
