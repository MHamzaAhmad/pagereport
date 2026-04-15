import type { ModuleRunStatus } from './module-run';

export type PrerequisiteRunStatus = ModuleRunStatus;

export interface PrerequisiteRunResponse {
	id: string;
	reportId: string;
	prerequisiteType: string;
	status: PrerequisiteRunStatus;
	result: unknown;
	error: string | null;
	startedAt: string | null;
	completedAt: string | null;
	createdAt: string;
	updatedAt: string;
}
