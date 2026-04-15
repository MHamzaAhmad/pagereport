<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import { ArrowRight } from 'phosphor-svelte';
	import { CreateReportForm } from '$lib/features/report-input/use-create-report.svelte';

	const form = new CreateReportForm();

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
	<div class="mx-auto flex max-w-3xl items-center gap-4 px-4 py-3 sm:gap-6">
		<a href={resolve('/')} class="text-foreground hidden font-serif text-2xl leading-none sm:block">
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
				disabled={form.isSubmitting}
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
</header>
