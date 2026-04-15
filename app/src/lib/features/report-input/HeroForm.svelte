<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { PUBLIC_TURNSTILE_SITE_KEY } from '$env/static/public';
	import Button from '$lib/components/ui/Button.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import TurnstileWidget from '$lib/features/turnstile/TurnstileWidget.svelte';
	import { ArrowRight, WarningCircle } from 'phosphor-svelte';
	import { CreateReportForm } from './use-create-report.svelte';

	const turnstileSiteKey = PUBLIC_TURNSTILE_SITE_KEY ?? '';
	const turnstileEnabled = turnstileSiteKey.length > 0;
	const form = new CreateReportForm(turnstileEnabled);

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		const result = await form.submit();
		if (result) {
			await goto(resolve('/reports/[id]', { id: result.id }));
		}
	}

	const errorMessage = $derived.by(() => {
		if (!form.error) return null;
		if (form.error === 'urlInvalid') return $_('home.urlInvalid');
		if (form.error === 'rateLimited') return $_('home.rateLimited');
		if (form.error === 'turnstileRequired') return $_('turnstile.required');
		return $_('errors.generic');
	});
</script>

<form class="w-full space-y-3" onsubmit={handleSubmit}>
	<div
		class="border-border bg-surface focus-within:border-foreground hover:border-muted-foreground/40 flex items-center gap-1 rounded-full border p-1.5 pl-2 transition-colors focus-within:hover:border-[var(--color-foreground)]"
	>
		<input
			id="report-url-hero"
			type="url"
			inputmode="url"
			autocomplete="url"
			placeholder={$_('home.urlPlaceholder')}
			bind:value={form.url}
			disabled={form.isSubmitting}
			required
			aria-label={$_('home.urlPlaceholder')}
			class="text-foreground placeholder:text-subtle h-11 min-w-0 flex-1 bg-transparent px-3 text-base outline-none focus-visible:ring-0 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
		/>
		<Button type="submit" size="md" disabled={!form.canSubmit} class="shrink-0">
			{form.isSubmitting ? $_('home.submitting') : $_('home.submit')}
			<ArrowRight size={16} weight="bold" />
		</Button>
	</div>

	<p class="text-subtle text-xs leading-relaxed">
		{$_('home.urlTooltip')}
	</p>

	{#if turnstileEnabled}
		<TurnstileWidget
			siteKey={turnstileSiteKey}
			onToken={(token: string) => form.setTurnstileToken(token)}
			onExpire={() => form.setTurnstileToken(null)}
		/>
	{/if}

	{#if errorMessage}
		<Alert tone="danger">
			<WarningCircle size={18} weight="fill" />
			<p>{errorMessage}</p>
		</Alert>
	{/if}
</form>
