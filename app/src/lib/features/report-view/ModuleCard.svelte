<script lang="ts">
	import { _ } from 'svelte-i18n';
	import Card from '$lib/components/ui/Card.svelte';
	import ModuleStatusBadge from './ModuleStatusBadge.svelte';
	import ModulePendingSkeleton from './ModulePendingSkeleton.svelte';
	import ModuleErrorState from './ModuleErrorState.svelte';
	import { getModuleRenderer } from './modules';
	import type { ModuleRunResponse } from '$lib/types';

	type Props = { run: ModuleRunResponse };
	let { run }: Props = $props();

	const renderer = $derived(getModuleRenderer(run.moduleType));

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

<Card class="flex h-full flex-col gap-4">
	<header class="flex items-start justify-between gap-3">
		<div class="min-w-0">
			<h3 class="text-foreground truncate text-base font-semibold">
				{#if renderer}
					{$_(renderer.labelKey)}
				{:else}
					{$_('module.unknown.title')}
				{/if}
			</h3>
			{#if renderer}
				<p class="text-muted-foreground mt-0.5 text-xs">{$_(renderer.descriptionKey)}</p>
			{:else}
				<p class="text-muted-foreground mt-0.5 text-xs">{$_('module.unknown.description')}</p>
			{/if}
		</div>
		<ModuleStatusBadge status={run.status} />
	</header>

	<div class="flex-1">
		{#if run.status === 'pending' || run.status === 'running' || run.status === 'awaiting_prerequisites'}
			<ModulePendingSkeleton status={run.status} />
		{:else if run.status === 'failed'}
			<ModuleErrorState message={run.error} />
		{:else if run.status === 'completed'}
			{#if renderer && parsed}
				{@const RendererComponent = renderer.component}
				<RendererComponent result={parsed} />
			{:else if parseError}
				<ModuleErrorState message={parseError} />
			{:else}
				<ModuleErrorState message={null} />
			{/if}
		{/if}
	</div>
</Card>
