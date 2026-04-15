<script lang="ts">
	import { _ } from 'svelte-i18n';
	import ModuleCard from './ModuleCard.svelte';
	import { getModuleRenderer } from './modules';
	import type { ModuleRunResponse } from '$lib/types';

	type Props = { runs: ModuleRunResponse[] };
	let { runs }: Props = $props();

	const UNREGISTERED_PRIORITY = Number.MAX_SAFE_INTEGER;

	const sortedRuns = $derived(
		[...runs].sort((a, b) => {
			const pa = getModuleRenderer(a.moduleType)?.priority ?? UNREGISTERED_PRIORITY;
			const pb = getModuleRenderer(b.moduleType)?.priority ?? UNREGISTERED_PRIORITY;
			if (pa !== pb) return pa - pb;
			return a.moduleType.localeCompare(b.moduleType);
		})
	);
</script>

{#if sortedRuns.length === 0}
	<p class="text-muted-foreground text-sm">{$_('report.empty')}</p>
{:else}
	<div class="flex flex-col">
		{#each sortedRuns as run (run.id)}
			<ModuleCard {run} />
		{/each}
	</div>
{/if}
