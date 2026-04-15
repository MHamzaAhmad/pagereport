<script lang="ts">
	import PrerequisiteCard from './PrerequisiteCard.svelte';
	import { getPrerequisiteRenderer } from './prerequisites';
	import type { PrerequisiteRunResponse } from '$lib/types';

	type Props = { prerequisites: PrerequisiteRunResponse[] };
	let { prerequisites }: Props = $props();

	const visible = $derived(
		prerequisites.filter((run) => getPrerequisiteRenderer(run.prerequisiteType) !== undefined)
	);
</script>

{#if visible.length > 0}
	<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
		{#each visible as run (run.id)}
			<PrerequisiteCard {run} />
		{/each}
	</div>
{/if}
