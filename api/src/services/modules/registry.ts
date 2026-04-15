import type { WorkflowStep } from "cloudflare:workers";
import type { z } from "zod";
import { CACHE_MIN_TTL_MS } from "@/domain/cache-policy";
import type { AIClient, BrowserClient, LighthouseClient, TrustMrrClient } from "@/external";
import type { PrerequisiteResults } from "@/services/prerequisites/registry";

export interface ModuleRunInput {
	readonly url: string;
}

/** Payload passed to a ModuleRunWorkflow instance. */
export interface ModuleRunWorkflowParams {
	readonly reportId: string;
	readonly moduleRunId: string;
	readonly moduleType: string;
	readonly url: string;
	readonly prerequisiteResults: Record<string, unknown>;
}

export interface ModuleRunContext {
	readonly browser: BrowserClient;
	readonly ai: AIClient;
	readonly lighthouse: LighthouseClient;
	readonly topPerformerSource: TrustMrrClient;
	readonly prerequisites: PrerequisiteResults;
	readonly step: WorkflowStep;
}

export interface AnalysisModule<TResult = unknown> {
	readonly type: string;
	readonly dependsOn?: readonly string[];
	readonly resultSchema: z.ZodType<TResult>;
	/**
	 * Cache TTL in milliseconds. 0 = never cache (explicit opt-out).
	 * Minimum non-zero value is CACHE_MIN_TTL_MS (1 hour) — enforced at registration.
	 */
	readonly cacheTtlMs: number;
	run(input: ModuleRunInput, ctx: ModuleRunContext): Promise<TResult>;
}

const registry = new Map<string, AnalysisModule>();

export function registerModule<TResult>(module: AnalysisModule<TResult>): void {
	if (registry.has(module.type)) {
		throw new Error(`Module already registered: ${module.type}`);
	}
	if (module.cacheTtlMs !== 0 && module.cacheTtlMs < CACHE_MIN_TTL_MS) {
		throw new Error(
			`Module ${module.type} cacheTtlMs must be 0 (opt-out) or >= ${CACHE_MIN_TTL_MS}ms (1h)`,
		);
	}
	registry.set(module.type, module as AnalysisModule);
}

export function getModule(type: string): AnalysisModule | undefined {
	return registry.get(type);
}

export function listModules(): readonly AnalysisModule[] {
	return [...registry.values()];
}
