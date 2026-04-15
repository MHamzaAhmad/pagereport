<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { PUBLIC_TURNSTILE_SITE_KEY } from '$env/static/public';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import TurnstileWidget from '$lib/features/turnstile/TurnstileWidget.svelte';
	import { ArrowRight } from 'phosphor-svelte';
	import { CreateReportForm } from '$lib/features/report-input/use-create-report.svelte';

	const turnstileSiteKey = PUBLIC_TURNSTILE_SITE_KEY ?? '';
	const turnstileEnabled = turnstileSiteKey.length > 0;
	const form = new CreateReportForm(turnstileEnabled);

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		const result = await form.submit();
		if (result) {
			form.url = '';
			await goto(resolve('/reports/[id]', { id: result.id }), { noScroll: true });
			window.scrollTo({ top: 0, behavior: 'smooth' });
		}
	}
</script>

<header
	class="border-border sticky top-0 z-40 border-b backdrop-blur-md supports-[backdrop-filter]:bg-[color:oklch(0.99_0.003_250/0.8)]"
>
	<div class="mx-auto flex max-w-3xl flex-col gap-2 px-4 py-3">
		<div class="flex items-center gap-4 sm:gap-6">
			<a
				href={resolve('/')}
				class="text-foreground hidden font-serif text-2xl leading-none sm:block"
			>
				{$_('topBar.wordmark')}
			</a>
			<form class="flex min-w-0 flex-1 items-center gap-2" onsubmit={handleSubmit}>
				<Input
					type="url"
					inputmode="url"
					autocomplete="url"
					placeholder={$_('topBar.placeholder')}
					bind:value={form.url}
					disabled={form.isSubmitting}
					required
					aria-label={$_('topBar.placeholder')}
					class="h-10 flex-1"
				/>
				<Button
					type="submit"
					size="md"
					disabled={!form.canSubmit}
					aria-label={$_('topBar.submitAria')}
					class="shrink-0 px-3 sm:px-4"
				>
					<span class="hidden sm:inline">
						{form.isSubmitting ? $_('topBar.submitting') : $_('topBar.submit')}
					</span>
					<ArrowRight size={16} weight="bold" />
				</Button>
			</form>
		</div>
		{#if turnstileEnabled}
			<div class="flex justify-end">
				<TurnstileWidget
					siteKey={turnstileSiteKey}
					onToken={(token: string) => form.setTurnstileToken(token)}
					onExpire={() => form.setTurnstileToken(null)}
				/>
			</div>
		{/if}
	</div>
</header>
