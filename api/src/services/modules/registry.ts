import type { WorkflowStep } from "cloudflare:workers";
import type { z } from "zod";
import type { AIClient, BrowserClient, LighthouseClient } from "@/external";
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
	readonly prerequisites: PrerequisiteResults;
	readonly step: WorkflowStep;
}

export interface AnalysisModule<TResult = unknown> {
	readonly type: string;
	readonly dependsOn?: readonly string[];
	readonly resultSchema: z.ZodType<TResult>;
	run(input: ModuleRunInput, ctx: ModuleRunContext): Promise<TResult>;
}

const registry = new Map<string, AnalysisModule>();

export function registerModule<TResult>(module: AnalysisModule<TResult>): void {
	if (registry.has(module.type)) {
		throw new Error(`Module already registered: ${module.type}`);
	}
	registry.set(module.type, module as AnalysisModule);
}

export function getModule(type: string): AnalysisModule | undefined {
	return registry.get(type);
}

export function listModules(): readonly AnalysisModule[] {
	return [...registry.values()];
}
