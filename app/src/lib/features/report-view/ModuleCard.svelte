<script lang="ts">
	import { _ } from 'svelte-i18n';
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

<section class="border-border border-t py-10 first:border-t-0 first:pt-0">
	<header class="mb-6 flex items-start justify-between gap-4">
		<div class="min-w-0">
			<h2 class="text-foreground font-serif text-3xl leading-tight sm:text-4xl">
				{#if renderer}
					{$_(renderer.labelKey)}
				{:else}
					{$_('module.unknown.title')}
				{/if}
			</h2>
			{#if renderer}
				<p class="text-muted-foreground mt-2 max-w-xl text-sm leading-relaxed">
					{$_(renderer.descriptionKey)}
				</p>
			{:else}
				<p class="text-muted-foreground mt-2 text-sm">{$_('module.unknown.description')}</p>
			{/if}
		</div>
		<div class="shrink-0 pt-2">
			<ModuleStatusBadge status={run.status} />
		</div>
	</header>

	<div>
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
</section>
