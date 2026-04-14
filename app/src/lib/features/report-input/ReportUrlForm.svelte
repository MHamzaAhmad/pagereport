<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Button from '$lib/components/ui/Button.svelte';
	import Input from '$lib/components/ui/Input.svelte';
	import Label from '$lib/components/ui/Label.svelte';
	import Tooltip from '$lib/components/ui/Tooltip.svelte';
	import Alert from '$lib/components/ui/Alert.svelte';
	import { Info, MagnifyingGlass, WarningCircle } from 'phosphor-svelte';
	import { CreateReportForm } from './use-create-report.svelte';

	const form = new CreateReportForm();

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
		if (form.error === 'generic') return $_('errors.generic');
		return form.error;
	});
</script>

<form class="w-full space-y-4" onsubmit={handleSubmit}>
	<div>
		<div class="mb-1.5 flex items-center gap-1.5">
			<Label for="report-url">{$_('home.urlLabel')}</Label>
			<Tooltip content={$_('home.urlTooltip')}>
				<Info size={14} class="text-muted-foreground" />
			</Tooltip>
		</div>
		<Input
			id="report-url"
			type="url"
			inputmode="url"
			autocomplete="url"
			placeholder={$_('home.urlPlaceholder')}
			bind:value={form.url}
			disabled={form.isSubmitting}
			required
		/>
	</div>

	{#if errorMessage}
		<Alert tone="danger">
			<WarningCircle size={18} weight="fill" />
			<p>{errorMessage}</p>
		</Alert>
	{/if}

	<Button type="submit" size="lg" disabled={form.isSubmitting} class="w-full sm:w-auto">
		<MagnifyingGlass size={18} weight="bold" />
		{form.isSubmitting ? $_('home.submitting') : $_('home.submit')}
	</Button>
</form>
