import type { Component } from 'svelte';
import type { ZodType } from 'zod';

export type ModuleTier = 'free' | 'paid';

export interface ModuleRenderer<T = unknown> {
	moduleType: string;
	tier: ModuleTier;
	labelKey: string;
	descriptionKey: string;
	/**
	 * Value-forward subheading shown on the locked card. Required for paid modules,
	 * optional for free. One short sentence telling the user why this module matters.
	 */
	paidHookKey?: string;
	priority: number;
	schema: ZodType<T>;
	component: Component<{ result: T }>;
	/**
	 * Believable static sample that matches `schema`. Rendered blurred on the locked
	 * card so the paid module feels "already generated, waiting behind the paywall".
	 * Required for paid modules.
	 */
	previewSample?: T;
}

export type AnyModuleRenderer = ModuleRenderer<unknown>;
