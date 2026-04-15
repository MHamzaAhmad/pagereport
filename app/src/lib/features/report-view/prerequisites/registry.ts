import type { AnyPrerequisiteRenderer, PrerequisiteRenderer } from './types';

const registry = new Map<string, AnyPrerequisiteRenderer>();

export function registerPrerequisite<T>(renderer: PrerequisiteRenderer<T>): void {
	if (registry.has(renderer.prerequisiteType)) {
		throw new Error(`Prerequisite "${renderer.prerequisiteType}" is already registered`);
	}
	registry.set(renderer.prerequisiteType, renderer as AnyPrerequisiteRenderer);
}

export function getPrerequisiteRenderer(
	prerequisiteType: string
): AnyPrerequisiteRenderer | undefined {
	return registry.get(prerequisiteType);
}

export function listPrerequisiteRenderers(): AnyPrerequisiteRenderer[] {
	return Array.from(registry.values());
}
