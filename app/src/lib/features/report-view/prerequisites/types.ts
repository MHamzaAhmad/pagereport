import type { Component } from 'svelte';
import type { ZodType } from 'zod';

export interface PrerequisiteRenderer<T = unknown> {
	prerequisiteType: string;
	labelKey: string;
	descriptionKey: string;
	schema: ZodType<T>;
	component: Component<{ result: T }>;
}

export type AnyPrerequisiteRenderer = PrerequisiteRenderer<unknown>;
