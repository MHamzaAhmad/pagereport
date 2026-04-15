<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Collapsible from '$lib/components/ui/Collapsible.svelte';
	import ModulePendingSkeleton from './ModulePendingSkeleton.svelte';
	import ModuleErrorState from './ModuleErrorState.svelte';
	import { getPrerequisiteRenderer } from './prerequisites';
	import type { PrerequisiteRunResponse } from '$lib/types';

	type Props = { run: PrerequisiteRunResponse };
	let { run }: Props = $props();

	const renderer = $derived(getPrerequisiteRenderer(run.prerequisiteType));

	const parsed = $derived.by(() => {
		if (!renderer || run.status !== 'completed' || run.result === null) return null;
		const res = renderer.schema.safeParse(run.result);
		return res.success ? res.data : null;
	});

	const parseError = $derived.by(() => {
		if (!renderer || run.status !== 'completed' || run.result === null) return null;
		const res = renderer.schema.safeParse(run.result);
		return res.success ? null : res.error.message;
	});
</script>

{#if renderer}
	<Collapsible title={$_(renderer.labelKey)} description={$_(renderer.descriptionKey)}>
		{#if run.status === 'pending' || run.status === 'running' || run.status === 'awaiting_prerequisites'}
			<ModulePendingSkeleton status={run.status} />
		{:else if run.status === 'failed'}
			<ModuleErrorState message={run.error} />
		{:else if run.status === 'completed'}
			{#if parsed}
				{@const RendererComponent = renderer.component}
				<RendererComponent result={parsed} />
			{:else if parseError}
				<ModuleErrorState message={parseError} />
			{:else}
				<ModuleErrorState message={null} />
			{/if}
		{/if}
	</Collapsible>
{/if}
