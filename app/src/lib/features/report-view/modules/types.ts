import type { Component } from 'svelte';
import type { ZodType } from 'zod';

export interface ModuleRenderer<T = unknown> {
	moduleType: string;
	labelKey: string;
	descriptionKey: string;
	priority: number;
	schema: ZodType<T>;
	component: Component<{ result: T }>;
}

export type AnyModuleRenderer = ModuleRenderer<unknown>;
