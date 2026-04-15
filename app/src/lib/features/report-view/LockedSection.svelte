<script lang="ts">
	import LockedModuleCard from './LockedModuleCard.svelte';
	import UnlockBundleButton from './UnlockBundleButton.svelte';
	import { getModuleRenderer } from './modules';
	import type { ModuleRunResponse } from '$lib/types';

	type Props = { reportId: string; runs: ModuleRunResponse[] };
	let { reportId, runs }: Props = $props();

	const renderable = $derived(
		runs
			.map((run) => ({ run, renderer: getModuleRenderer(run.moduleType) }))
			.filter(
				(
					entry
				): entry is {
					run: ModuleRunResponse;
					renderer: NonNullable<ReturnType<typeof getModuleRenderer>>;
				} => entry.renderer !== undefined
			)
			.sort((a, b) => a.renderer.priority - b.renderer.priority)
	);
</script>

{#if renderable.length > 0}
	<div class="mt-10 flex flex-col gap-6">
		<UnlockBundleButton {reportId} lockedCount={renderable.length} />
		<div class="flex flex-col">
			{#each renderable as { run, renderer } (run.id)}
				<LockedModuleCard {renderer} />
			{/each}
		</div>
	</div>
{/if}
