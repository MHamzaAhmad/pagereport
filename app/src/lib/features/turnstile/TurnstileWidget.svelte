<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { _ } from 'svelte-i18n';
	import './turnstile.types';

	interface Props {
		siteKey: string;
		onToken: (token: string) => void;
		onExpire?: () => void;
	}

	const { siteKey, onToken, onExpire }: Props = $props();

	const SCRIPT_URL = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

	let container: HTMLDivElement | undefined = $state();
	let widgetId: string | null = null;
	let errored = $state(false);

	function loadScript(): Promise<void> {
		if (typeof window === 'undefined') return Promise.resolve();
		if (window.turnstile) return Promise.resolve();
		if (window.__turnstileLoadingPromise) return window.__turnstileLoadingPromise;

		const promise = new Promise<void>((resolve, reject) => {
			const script = document.createElement('script');
			script.src = SCRIPT_URL;
			script.async = true;
			script.defer = true;
			script.onload = () => resolve();
			script.onerror = () => reject(new Error('Failed to load Turnstile script'));
			document.head.appendChild(script);
		});
		window.__turnstileLoadingPromise = promise;
		return promise;
	}

	onMount(async () => {
		try {
			await loadScript();
			if (!container || !window.turnstile) return;
			widgetId = window.turnstile.render(container, {
				sitekey: siteKey,
				callback: (token: string) => onToken(token),
				'expired-callback': () => onExpire?.(),
				'error-callback': () => {
					errored = true;
				},
				theme: 'auto'
			});
		} catch {
			errored = true;
		}
	});

	onDestroy(() => {
		if (widgetId && typeof window !== 'undefined' && window.turnstile) {
			window.turnstile.remove(widgetId);
		}
	});
</script>

<div class="flex flex-col gap-2">
	<div bind:this={container}></div>
	{#if errored}
		<p class="text-danger text-xs">{$_('turnstile.failed')}</p>
	{/if}
</div>
