export interface TurnstileRenderOptions {
	sitekey: string;
	callback: (token: string) => void;
	'expired-callback'?: () => void;
	'error-callback'?: () => void;
	theme?: 'light' | 'dark' | 'auto';
}

export interface TurnstileGlobal {
	render(container: HTMLElement, options: TurnstileRenderOptions): string;
	remove(widgetId: string): void;
}

declare global {
	interface Window {
		turnstile?: TurnstileGlobal;
		__turnstileLoadingPromise?: Promise<void>;
	}
}
