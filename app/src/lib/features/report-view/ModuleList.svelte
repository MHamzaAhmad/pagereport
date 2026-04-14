<script lang="ts">
	import { _ } from 'svelte-i18n';
	import ModuleCard from './ModuleCard.svelte';
	import type { ModuleRunResponse } from '$lib/types';

	type Props = { runs: ModuleRunResponse[] };
	let { runs }: Props = $props();
</script>

{#if runs.length === 0}
	<p class="text-muted-foreground text-sm">{$_('report.empty')}</p>
{:else}
	<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
		{#each runs as run (run.id)}
			<ModuleCard {run} />
		{/each}
	</div>
{/if}
