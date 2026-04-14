import { waitLocale } from 'svelte-i18n';
import { setupI18n } from '$lib/i18n';

export const prerender = false;
export const ssr = true;

setupI18n();

export async function load(): Promise<Record<string, never>> {
	await waitLocale();
	return {};
}
