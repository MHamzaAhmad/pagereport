<script lang="ts">
	import { _ } from 'svelte-i18n';
	import { page } from '$app/state';
	import { onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Alert from '$lib/components/ui/Alert.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Skeleton from '$lib/components/ui/Skeleton.svelte';
	import ReportHeader from '$lib/features/report-view/ReportHeader.svelte';
	import ModuleList from '$lib/features/report-view/ModuleList.svelte';
	import PrerequisiteList from '$lib/features/report-view/PrerequisiteList.svelte';
	import { ReportState } from '$lib/stores';
	import { ArrowLeft, WarningCircle } from 'phosphor-svelte';

	const state = new ReportState();

	$effect(() => {
		const id = page.params.id;
		if (id) void state.load(id);
	});

	onDestroy(() => state.stop());
</script>

<main class="mx-auto max-w-5xl px-4 py-8 sm:py-12">
	<div class="mb-6">
		<Button variant="ghost" size="sm" onclick={() => goto(resolve('/'))}>
			<ArrowLeft size={14} weight="bold" />
			{$_('report.backHome')}
		</Button>
	</div>

	{#if state.isLoading && !state.report}
		<div class="space-y-6">
			<Skeleton class="h-8 w-2/3" />
			<Skeleton class="h-4 w-1/3" />
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
				<Skeleton class="h-48 w-full" />
				<Skeleton class="h-48 w-full" />
			</div>
		</div>
	{:else if state.error && !state.report}
		<Alert tone="danger">
			<WarningCircle size={18} weight="fill" />
			<p>{$_('report.loadError')}: {state.error}</p>
		</Alert>
	{:else if state.report}
		<div class="space-y-8">
			<ReportHeader report={state.report} />
			<PrerequisiteList prerequisites={state.report.prerequisites} />
			<ModuleList runs={state.report.moduleRuns} />
		</div>
	{/if}
</main>
