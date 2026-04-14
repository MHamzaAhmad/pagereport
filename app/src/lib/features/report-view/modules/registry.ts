import type { AnyModuleRenderer, ModuleRenderer } from './types';

const registry = new Map<string, AnyModuleRenderer>();

export function registerModule<T>(renderer: ModuleRenderer<T>): void {
	if (registry.has(renderer.moduleType)) {
		throw new Error(`Module "${renderer.moduleType}" is already registered`);
	}
	registry.set(renderer.moduleType, renderer as AnyModuleRenderer);
}

export function getModuleRenderer(moduleType: string): AnyModuleRenderer | undefined {
	return registry.get(moduleType);
}

export function listModuleRenderers(): AnyModuleRenderer[] {
	return Array.from(registry.values());
}
