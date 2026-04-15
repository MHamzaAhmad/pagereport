import type { WorkflowStep } from "cloudflare:workers";
import type { z } from "zod";
import { CACHE_MIN_TTL_MS } from "@/domain/cache-policy";
import type { AIClient, FirecrawlClient } from "@/external";

export interface PrerequisiteRunInput {
	readonly url: string;
}

export interface PrerequisiteResults {
	get<T>(type: string, schema: z.ZodType<T>): T;
}

export interface PrerequisiteRunContext {
	readonly firecrawl: FirecrawlClient;
	readonly ai: AIClient;
	readonly prerequisites: PrerequisiteResults;
	readonly step: WorkflowStep;
}

/** Payload passed to a PrerequisiteRunWorkflow instance. */
export interface PrerequisiteRunWorkflowParams {
	readonly reportId: string;
	readonly prerequisiteRunId: string;
	readonly prerequisiteType: string;
	readonly url: string;
	readonly prerequisiteResults: Record<string, unknown>;
}

export interface Prerequisite<TResult = unknown> {
	readonly type: string;
	readonly dependsOn?: readonly string[];
	readonly resultSchema: z.ZodType<TResult>;
	/** Cache TTL in milliseconds. 0 = never cache. Use `Number.POSITIVE_INFINITY` for forever. */
	readonly cacheTtlMs: number;
	run(input: PrerequisiteRunInput, ctx: PrerequisiteRunContext): Promise<TResult>;
}

const registry = new Map<string, Prerequisite>();

export function registerPrerequisite<TResult>(prerequisite: Prerequisite<TResult>): void {
	if (registry.has(prerequisite.type)) {
		throw new Error(`Prerequisite already registered: ${prerequisite.type}`);
	}
	if (
		prerequisite.cacheTtlMs !== 0 &&
		prerequisite.cacheTtlMs !== Number.POSITIVE_INFINITY &&
		prerequisite.cacheTtlMs < CACHE_MIN_TTL_MS
	) {
		throw new Error(
			`Prerequisite ${prerequisite.type} cacheTtlMs must be 0 (opt-out) or >= ${CACHE_MIN_TTL_MS}ms (1h)`,
		);
	}
	registry.set(prerequisite.type, prerequisite as Prerequisite);
}

export function getPrerequisite(type: string): Prerequisite | undefined {
	return registry.get(type);
}

export function listPrerequisites(): readonly Prerequisite[] {
	return [...registry.values()];
}

export function makePrerequisiteResults(record: Record<string, unknown>): PrerequisiteResults {
	return {
		get<T>(type: string, schema: z.ZodType<T>): T {
			if (!(type in record)) {
				throw new Error(`Prerequisite result not supplied: ${type}`);
			}
			return schema.parse(record[type]);
		},
	};
}
