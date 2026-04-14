import { init, register, getLocaleFromNavigator } from 'svelte-i18n';

export const defaultLocale = 'en';

register('en', () => import('./locales/en.json'));

export function setupI18n(): void {
	void init({
		fallbackLocale: defaultLocale,
		initialLocale: typeof window !== 'undefined' ? getLocaleFromNavigator() : defaultLocale
	});
}
